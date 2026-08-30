const DB_NAME="wujin-xiantu-db", STORE="save", KEY="main-save", OFFLINE_CAP=86400;
const $=id=>document.getElementById(id), fmt=n=>Math.floor(n).toLocaleString("zh-TW");
const realms=[
{name:"煉氣一層",need:100,rate:1,br:.92,power:10},{name:"煉氣二層",need:240,rate:1.4,br:.88,power:14},
{name:"煉氣三層",need:520,rate:1.9,br:.84,power:19},{name:"煉氣四層",need:900,rate:2.5,br:.80,power:25},
{name:"煉氣五層",need:1500,rate:3.2,br:.76,power:32},{name:"煉氣六層",need:2400,rate:4.1,br:.72,power:41},
{name:"煉氣七層",need:3800,rate:5.2,br:.68,power:52},{name:"煉氣八層",need:6000,rate:6.5,br:.64,power:65},
{name:"煉氣九層",need:9200,rate:8,br:.55,power:80},{name:"築基初期",need:14000,rate:10.5,br:.70,power:105},
{name:"築基中期",need:26000,rate:14.7,br:.62,power:135},{name:"築基後期",need:42000,rate:20.5,br:.55,power:175}
];
const zones=[
{id:"green",name:"青石坡",desc:"山腳妖氣淡薄，適合初入仙途者。",min:0,d:5,mon:["灰背野豬","山魈"],boss:"鐵鬃王",mats:["青靈草","狼牙"]},
{id:"black",name:"黑木林",desc:"林中常有低階妖獸與採藥人出沒。",min:2,d:9,mon:["黑木狼","毒牙蛇"],boss:"黑木妖狼王",mats:["青靈草","蛇膽"]},
{id:"mist",name:"迷霧谷",desc:"靈霧終年不散，機緣與凶險並存。",min:4,d:15,mon:["霧狐","石甲蟲"],boss:"霧隱妖狐",mats:["凝露草","紫靈草"]},
{id:"red",name:"赤霞崖",desc:"赤霞照壁，偶有築基修士遺物現世。",min:6,d:22,mon:["赤羽鷹","火蜥"],boss:"赤霞妖鷹",mats:["紫靈草","下品妖丹"]},
{id:"ruin",name:"古修遺跡",desc:"築基後方可深入，殘陣中藏有古修功法。",min:9,d:32,mon:["傀儡守衛","殘魂"],boss:"古修殘魂",mats:["下品妖丹","玄鐵"]},
{id:"abyss",name:"幽冥澗",desc:"陰煞之氣濃重，唯根基深厚者可行。",min:10,d:42,mon:["幽冥鬼卒","噬魂獸"],boss:"幽冥鬼王",mats:["玄鐵","紫靈草"]}
];
const gearDefs={
"青竹劍":{slot:"weapon",power:12,rate:.04},"玄鐵短劍":{slot:"weapon",power:22,rate:.06},
"霧隱袍":{slot:"armor",power:20,rate:.05},"赤霞法衣":{slot:"armor",power:34,rate:.07},
"靈紋玉佩":{slot:"accessory",power:14,rate:.06},"聚靈環":{slot:"accessory",power:25,rate:.09}
};
const skills={"吐納訣":{power:3,rate:.08},"青木長生訣":{power:10,rate:.12},"玄元心法":{power:18,rate:.15},"赤陽真訣":{power:25,rate:.18}};
const recipes=[
{name:"聚氣丹",desc:"服用後立即獲得 500 修為。",mats:{"青靈草":2},stone:30},
{name:"小還丹",desc:"服用後立即治癒內傷。",mats:{"凝露草":2,"蛇膽":1},stone:50},
{name:"築基丹",desc:"本次突破成功率 +20%。",mats:{"紫靈草":2,"下品妖丹":1},stone:100}
];
function defaults(){return {playerName:"李柏儒",realmIndex:0,cultivation:10,spiritStone:120,daoHeart:0,mode:"breath",activePillBonus:0,injuryUntil:0,
inventory:{"狼牙":2,"青靈草":1,"築基丹":1},equipped:{weapon:null,armor:null,accessory:null},equipmentInventory:["青竹劍","靈紋玉佩"],
equipmentMeta:{},learnedSkills:["吐納訣"],equippedSkills:["吐納訣"],skillLevels:{"吐納訣":1},zoneWins:{},bossReady:{},
stats:{kills:0,events:0,breakthroughs:0,bossKills:0,alchemy:0},logs:["踏入仙途，天地靈氣自此入體。"],lastSavedAt:Date.now(),lastTickAt:Date.now()}}
let db,state,ui={zonePage:0,gearPage:0},battleBusy=false;
function realm(){return realms[Math.min(state.realmIndex,realms.length-1)]}
function migrate(x){const d=defaults(); if(!x)return d; const s={...d,...x}; s.inventory={...d.inventory,...(x.inventory||{})};s.equipped={...d.equipped,...(x.equipped||{})};
s.stats={...d.stats,...(x.stats||{})};s.zoneWins=x.zoneWins||{};s.bossReady=x.bossReady||{};s.equipmentInventory=x.equipmentInventory||d.equipmentInventory;
s.learnedSkills=x.learnedSkills||d.learnedSkills;s.equippedSkills=x.equippedSkills||d.equippedSkills;s.skillLevels=x.skillLevels||d.skillLevels;return s}
function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};
r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function readSave(){return new Promise(res=>{const t=db.transaction(STORE,"readonly"),r=t.objectStore(STORE).get(KEY);r.onsuccess=()=>res(r.result||null);r.onerror=()=>res(null)})}
function writeSave(){state.lastSavedAt=Date.now();return new Promise(res=>{const t=db.transaction(STORE,"readwrite");t.objectStore(STORE).put(state,KEY);t.oncomplete=()=>res()})}
function addLog(s){state.logs=[s,...(state.logs||[])].slice(0,6)}
function equipBonus(){let p=0,r=0;Object.values(state.equipped).filter(Boolean).forEach(n=>{const d=gearDefs[n];if(d){p+=d.power;r+=d.rate}});return{p,r}}
function skillBonus(){let p=0,r=0;state.equippedSkills.forEach(n=>{const d=skills[n];if(d){const lv=state.skillLevels[n]||1,m=1+(lv-1)*.2;p+=d.power*m;r+=d.rate*m}});return{p,r}}
function power(){const e=equipBonus(),s=skillBonus();return Math.round(realm().power+state.daoHeart*1.2+e.p+s.p)}
function rate(){const e=equipBonus(),s=skillBonus();return realm().rate*(state.mode==="wander"?.62:1)*(Date.now()<state.injuryUntil?.7:1)*(1+e.r+s.r)}
function stoneRate(){return state.mode==="wander"?.12:.025}
function brChance(){if(state.realmIndex>=realms.length-1)return 0;return Math.max(.05,Math.min(.99,realm().br+Math.min(.2,state.daoHeart*.01)+state.activePillBonus-(Date.now()<state.injuryUntil?.15:0)))}
function apply(sec){state.cultivation+=rate()*sec;state.spiritStone+=stoneRate()*sec}
function render(){
 const r=realm(),p=power(),pct=Math.min(100,state.cultivation/r.need*100);
 if($("caveStone"))$("caveStone").textContent=fmt(state.spiritStone);
 if($("caveCult"))$("caveCult").textContent=fmt(state.cultivation);
 if($("cavePower"))$("cavePower").textContent=p;
 if($("charHeroName"))$("charHeroName").textContent=state.playerName;
 if($("charHeroRealm"))$("charHeroRealm").textContent=r.name;
 if($("charHeroPower"))$("charHeroPower").textContent=p;
 if($("charEquipSummary")){
   const labels={weapon:"武器",armor:"法衣",accessory:"飾品"};
   $("charEquipSummary").innerHTML=Object.entries(labels).map(([slot,label])=>{
     const n=state.equipped[slot]||"未裝備";
     return `<div><span>${label}</span><strong>${esc(n)}</strong></div>`;
   }).join("");
 }
 $("nameTop").textContent=state.playerName;$("realmTop").textContent=r.name+" · 散修";$("statCult").textContent=fmt(state.cultivation);$("statStone").textContent=fmt(state.spiritStone);$("statPower").textContent=p;
 $("realmHero").textContent=r.name;$("rate").textContent="+"+rate().toFixed(1)+" / 秒";$("progText").textContent=fmt(state.cultivation)+" / "+fmt(r.need);$("progBar").style.width=pct+"%";
 $("remain").textContent=state.cultivation>=r.need?"可嘗試突破":"尚需 "+fmt(r.need-state.cultivation)+" 修為";$("breakRate").textContent=state.realmIndex>=realms.length-1?"上限":Math.round(brChance()*100)+"%";
 $("baseRate").textContent=Math.round(r.br*100)+"%";$("daoBonus").textContent="+"+Math.min(20,state.daoHeart)+"%";$("pillBonus").textContent="+"+Math.round(state.activePillBonus*100)+"%";
 $("pillCount").textContent=state.inventory["築基丹"]||0;$("pillBtn").disabled=!!state.activePillBonus||!(state.inventory["築基丹"]||0);
 const can=state.cultivation>=r.need&&state.realmIndex<realms.length-1;$("breakBtn").disabled=!can;$("breakBtn").textContent=state.realmIndex>=realms.length-1?"目前版本上限":can?"嘗試突破":"修為未滿";
 document.querySelectorAll(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode===state.mode));$("log").innerHTML=(state.logs||[]).map(x=>"<div>・"+esc(x)+"</div>").join("");
 $("gearPower").textContent="戰力 "+p;$("renameInput").value=document.activeElement===$("renameInput")?$("renameInput").value:state.playerName;
 $("cRealm").textContent=r.name;$("cDao").textContent=fmt(state.daoHeart);$("cPower").textContent=p;$("cKills").textContent=fmt(state.stats.kills);$("cEvents").textContent=fmt(state.stats.events);
 $("cBreaks").textContent=fmt(state.stats.breakthroughs);$("cBoss").textContent=fmt(state.stats.bossKills);$("cAlchemy").textContent=fmt(state.stats.alchemy);
 renderZones();renderBag();renderAlchemy();renderGear();renderSkills()
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderBag(){const a=Object.entries(state.inventory).filter(([,n])=>n>0);$("bagCount").textContent=a.length+" 種物品 · 上下滑動";$("bag").innerHTML=a.length?a.map(([n,c])=>{
 let d="材料或道具";if(n==="築基丹")d="突破成功率 +20%";if(n==="聚氣丹")d="立即獲得 500 修為";if(n==="小還丹")d="立即治癒內傷";const usable=["聚氣丹","小還丹"].includes(n);
 return `<div class="item"><div class="row"><div class="copy"><b>${esc(n)}</b><small>${d}</small></div><div class="qty">×${c}</div></div>${usable?`<button data-use="${n}" style="width:100%;margin-top:8px">使用</button>`:""}</div>`}).join(""):"<div class='item'>儲物袋目前是空的</div>";
 document.querySelectorAll("[data-use]").forEach(b=>b.onclick=async()=>{useItem(b.dataset.use);render();await writeSave()})}
function useItem(n){if(!(state.inventory[n]||0))return;if(n==="聚氣丹"){state.inventory[n]--;state.cultivation+=500;addLog("服用聚氣丹，修為 +500。")}
 if(n==="小還丹"){state.inventory[n]--;state.injuryUntil=0;addLog("服用小還丹，內傷已癒。")}}
function canCraft(r){return state.spiritStone>=r.stone&&Object.entries(r.mats).every(([n,c])=>(state.inventory[n]||0)>=c)}
function renderAlchemy(){$("alchemyCount").textContent="已煉 "+state.stats.alchemy+" 次";$("alchemy").innerHTML=recipes.map(r=>{
 const mats=Object.entries(r.mats).map(([n,c])=>`${n} ${state.inventory[n]||0}/${c}`).join("、");return `<div class="recipe"><div class="row"><div class="copy"><b>${r.name}</b><small>${r.desc}<br>${mats}｜靈石 ${fmt(state.spiritStone)}/${r.stone}</small></div><button data-craft="${r.name}" ${canCraft(r)?"":"disabled"}>煉製</button></div></div>`}).join("");
 document.querySelectorAll("[data-craft]").forEach(b=>b.onclick=async()=>{const r=recipes.find(x=>x.name===b.dataset.craft);if(!canCraft(r))return;state.spiritStone-=r.stone;Object.entries(r.mats).forEach(([n,c])=>state.inventory[n]-=c);state.inventory[r.name]=(state.inventory[r.name]||0)+1;state.stats.alchemy++;addLog("煉成「"+r.name+"」×1。");render();await writeSave()})}
function qclass(i){return ["quality-common","quality-good","quality-fine","quality-epic","quality-legend"][Math.min(4,i||0)]}
function renderGear(){const labels={weapon:"武器",armor:"法衣",accessory:"飾品"};$("slots").innerHTML=Object.entries(labels).map(([s,l])=>`<div class="slot"><span>${l}</span><strong>${state.equipped[s]||"未裝備"}</strong></div>`).join("");
 const a=state.equipmentInventory||[],per=4,pc=Math.max(1,Math.ceil(a.length/per));ui.gearPage=Math.max(0,Math.min(ui.gearPage,pc-1));$("gPage").textContent=(ui.gearPage+1)+"/"+pc;$("gPrev").disabled=ui.gearPage<=0;$("gNext").disabled=ui.gearPage>=pc-1;
 const vis=a.slice(ui.gearPage*per,ui.gearPage*per+per);$("gears").innerHTML=vis.length?vis.map((n,i)=>{const d=gearDefs[n]||{slot:"weapon",power:0,rate:0},old=state.equipped[d.slot],od=old?gearDefs[old]:null,delta=d.power-(od?.power||0),eq=old===n;
 return `<div class="gear ${eq?"equipped":""}" data-card="${n}"><div class="row"><div class="copy"><b class="${qclass(i%4)}">${n}</b><small>戰力 +${d.power} · 修煉 +${Math.round(d.rate*100)}%<br>${eq?"目前裝備":old?`比較 ${old} · 戰力 ${delta>=0?"+":""}${delta}`:"此欄位尚未裝備"}</small></div><button data-equip="${n}">${eq?"已裝備":"換上"}</button></div></div>`}).join(""):"<div class='gear'>尚無裝備</div>";
 document.querySelectorAll("[data-card]").forEach(c=>c.onclick=e=>{if(e.target.closest("button"))return;c.classList.toggle("selected")});
 document.querySelectorAll("[data-equip]").forEach(b=>b.onclick=async()=>{const n=b.dataset.equip,d=gearDefs[n];if(!d)return;state.equipped[d.slot]=n;addLog("裝備「"+n+"」。");render();await writeSave()})}
function renderSkills(){$("skillCount").textContent=state.equippedSkills.length+" / 3";$("skills").innerHTML=(state.learnedSkills||[]).map(n=>{const d=skills[n],lv=state.skillLevels[n]||1,on=state.equippedSkills.includes(n),cost=100*lv*lv;
 return `<div class="skill"><div class="copy"><b>《${n}》</b><small>第 ${lv} 重 · 戰力 +${Math.round(d.power*(1+(lv-1)*.2))} · 修煉 +${Math.round(d.rate*(1+(lv-1)*.2)*100)}%</small></div><div class="row" style="margin-top:8px"><button data-skill="${n}">${on?"卸下":"裝備"}</button><button data-up="${n}" ${lv>=5||state.spiritStone<cost?"disabled":""}>${lv>=5?"已滿":"升級 "+cost}</button></div></div>`}).join("");
 document.querySelectorAll("[data-skill]").forEach(b=>b.onclick=async()=>{const n=b.dataset.skill;if(state.equippedSkills.includes(n))state.equippedSkills=state.equippedSkills.filter(x=>x!==n);else if(state.equippedSkills.length<3)state.equippedSkills.push(n);render();await writeSave()});
 document.querySelectorAll("[data-up]").forEach(b=>b.onclick=async()=>{const n=b.dataset.up,lv=state.skillLevels[n]||1,c=100*lv*lv;if(lv<5&&state.spiritStone>=c){state.spiritStone-=c;state.skillLevels[n]=lv+1;addLog("《"+n+"》提升至第 "+(lv+1)+" 重。");render();await writeSave()}})}
function renderZones(){const per=2,pc=Math.ceil(zones.length/per);ui.zonePage=Math.max(0,Math.min(ui.zonePage,pc-1));$("zPage").textContent=(ui.zonePage+1)+"/"+pc;$("zPrev").disabled=ui.zonePage<=0;$("zNext").disabled=ui.zonePage>=pc-1;
 const visibleZones=zones.slice(ui.zonePage*per,ui.zonePage*per+per);
 if($("sceneZone")&&visibleZones[0])$("sceneZone").textContent=visibleZones[0].name;
 $("zones").innerHTML=visibleZones.map(z=>{const lock=state.realmIndex<z.min;return `<div class="card zone"><h3>${z.name}</h3><p>${z.desc}</p><small>${lock?"需 "+realms[z.min].name:""}</small><div class="zone-actions"><button data-zone="${z.id}" data-n="1" ${lock?"disabled":""}>挑戰 1 次</button><button data-zone="${z.id}" data-n="3" ${lock?"disabled":""}>連戰 3 次</button></div></div>`}).join("");
 document.querySelectorAll("[data-zone]").forEach(b=>b.onclick=()=>runBatch(b.dataset.zone,+b.dataset.n))}
function combat(z,boss=false){const pwr=power(),p={hp:220+state.realmIndex*55,atk:Math.max(28,Math.round(pwr*1.45)),def:Math.max(10,Math.round(pwr*.55))},scale=boss?1.85:1,e={hp:Math.round((150+z.d*16)*scale),atk:Math.round((18+z.d*1.55)*scale),def:Math.round((6+z.d*.62)*scale)};return{p,e}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function animate(z){const monster=z.mon[Math.floor(Math.random()*z.mon.length)],{p,e}=combat(z),maxP=p.hp,maxE=e.hp;let ph=p.hp,eh=e.hp,round=0;$("battleStatus").textContent="戰鬥中";
 $("battle").innerHTML=`<div class="fighter enemy"><div class="fighter-top"><b>${monster}</b><span id="eh">${eh}/${maxE}</span></div><div class="hp"><i id="eb" style="width:100%"></i></div></div><div class="fighter"><div class="fighter-top"><b>${esc(state.playerName)}</b><span id="ph">${ph}/${maxP}</span></div><div class="hp"><i id="pb" style="width:100%"></i></div></div><div id="act" class="actionline">準備交戰…</div>`;
 while(ph>0&&eh>0&&round<40){round++;let raw=Math.round(p.atk*(.88+Math.random()*.24)),red=Math.round(e.def*(.82+Math.random()*.18)),dmg=Math.max(1,raw-red);eh=Math.max(0,eh-dmg);$("eh").textContent=eh+"/"+maxE;$("eb").style.width=eh/maxE*100+"%";$("act").innerHTML=`第 ${round} 回合：你攻擊 ${monster}<br>攻擊 ${raw} − 防禦 ${red} = <b>${dmg} 傷害</b>`;await sleep(650);if(eh<=0)break;
 raw=Math.round(e.atk*(.88+Math.random()*.24));red=Math.round(p.def*(.82+Math.random()*.18));dmg=Math.max(1,raw-red);ph=Math.max(0,ph-dmg);$("ph").textContent=ph+"/"+maxP;$("pb").style.width=ph/maxP*100+"%";$("act").innerHTML=`${monster} 反擊<br>敵攻 ${raw} − 你的防禦 ${red} = <b>${dmg} 傷害</b>`;await sleep(650)}
 $("battleStatus").textContent=eh<=0?"勝利":"戰敗";$("act").innerHTML=eh<=0?`${monster} 已被擊敗！你剩餘 ${ph}/${maxP} HP`:`你戰敗了，${monster} 剩餘 ${eh}/${maxE} HP`;await sleep(500);return eh<=0}
async function runBatch(id,n){if(battleBusy)return;const z=zones.find(x=>x.id===id);if(!z||state.realmIndex<z.min)return;battleBusy=true;let wins=0;
 for(let i=0;i<n;i++){const win=await animate(z);if(win){wins++;const cg=Math.round(25+z.d*1.7+Math.random()*35),sg=Math.round(18+z.d*2+Math.random()*40);state.cultivation+=cg;state.spiritStone+=sg;state.stats.kills++;state.zoneWins[z.id]=(state.zoneWins[z.id]||0)+1;
 if(Math.random()<.7){const m=z.mats[Math.floor(Math.random()*z.mats.length)];state.inventory[m]=(state.inventory[m]||0)+1}if(Math.random()<.18)dropGear(z)}
 else{state.injuryUntil=Date.now()+300000;state.cultivation=Math.max(0,state.cultivation-Math.max(5,Math.round(realm().need*.03)))};render();await sleep(250)}
 addLog(`於「${z.name}」連戰 ${n} 場，勝 ${wins} 場。`);battleBusy=false;render();await writeSave()}
function dropGear(z){const pool=["青竹劍","靈紋玉佩","玄鐵短劍","霧隱袍","赤霞法衣","聚靈環"];const n=pool[Math.min(pool.length-1,Math.floor(z.d/8))];if(!state.equipmentInventory.includes(n)){state.equipmentInventory.push(n);addLog("獲得裝備「"+n+"」。")}}
$("breakBtn").onclick=async()=>{const r=realm();if(state.cultivation<r.need||state.realmIndex>=realms.length-1)return;if(Math.random()<brChance()){state.cultivation-=r.need;state.realmIndex++;state.daoHeart++;state.stats.breakthroughs++;addLog("突破成功！踏入「"+realm().name+"」。")}
 else{const x=Math.round(r.need*.2);state.cultivation=Math.max(0,state.cultivation-x);state.injuryUntil=Date.now()+600000;addLog("突破失敗，修為 -"+x+"，內傷 10 分鐘。")}state.activePillBonus=0;render();await writeSave()}
$("pillBtn").onclick=async()=>{if(state.activePillBonus||!(state.inventory["築基丹"]||0))return;state.inventory["築基丹"]--;state.activePillBonus=.2;addLog("服用築基丹，本次突破成功率 +20%。");render();await writeSave()}
document.querySelectorAll(".mode").forEach(b=>b.onclick=async()=>{state.mode=b.dataset.mode;addLog(state.mode==="wander"?"你離開洞府，外出修行。":"你盤膝吐納，靜心修煉。");render();await writeSave()})
document.querySelectorAll(".nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav button").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".page").forEach(x=>x.classList.toggle("active",x.id==="p-"+b.dataset.page))})
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".cavepanel").forEach(x=>x.classList.toggle("active",x.id==="c-"+b.dataset.tab))})
$("zPrev").onclick=()=>{ui.zonePage--;renderZones()};$("zNext").onclick=()=>{ui.zonePage++;renderZones()};$("gPrev").onclick=()=>{ui.gearPage--;renderGear()};$("gNext").onclick=()=>{ui.gearPage++;renderGear()}
$("clearLog").onclick=async()=>{state.logs=[];render();await writeSave()};$("renameBtn").onclick=async()=>{const n=$("renameInput").value.trim();if(!n)return alert("角色名稱不能空白");state.playerName=n;addLog("道號已改為「"+n+"」。");render();await writeSave()}
$("reset").onclick=async()=>{if(!confirm("確定重置所有進度？"))return;state=defaults();render();await writeSave()}
async function boot(){db=await openDB();state=migrate(await readSave());const now=Date.now(),elapsed=Math.max(0,Math.min(OFFLINE_CAP,(now-(state.lastSavedAt||now))/1000));if(elapsed>=10){apply(elapsed);$("offlineText").textContent=`離線 ${Math.floor(elapsed/3600)} 小時 ${Math.floor((elapsed%3600)/60)} 分鐘，收益已自動加入。`;offline.showModal()}state.lastTickAt=now;render();await writeSave();
 setInterval(async()=>{const t=Date.now(),d=Math.max(0,Math.min(5,(t-state.lastTickAt)/1000));state.lastTickAt=t;apply(d);render();if(Math.floor(t/5000)!==Math.floor((t-1000)/5000))await writeSave()},1000)}
if("serviceWorker" in navigator){navigator.serviceWorker.register("./service-worker.js?v=20",{updateViaCache:"none"}).then(r=>r.update()).catch(()=>{})}
boot().catch(e=>{console.error(e);alert("遊戲初始化失敗，請重新整理頁面。")})
if($("quickBattleBtn"))$("quickBattleBtn").onclick=()=>{
  const z=zones[Math.min(zones.length-1,ui.zonePage*2)];
  if(z && state.realmIndex>=z.min) runBatch(z.id,1);
};
