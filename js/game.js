const DB_NAME="wujin-xiantu-db";
const STORE="save";
const KEY="main-save";
const OFFLINE_CAP_SECONDS=24*60*60;

const realms=[
  {name:"煉氣一層",need:100,rate:1.0,breakthrough:.92,power:10},
  {name:"煉氣二層",need:240,rate:1.4,breakthrough:.88,power:14},
  {name:"煉氣三層",need:520,rate:1.9,breakthrough:.84,power:19},
  {name:"煉氣四層",need:900,rate:2.5,breakthrough:.80,power:25},
  {name:"煉氣五層",need:1500,rate:3.2,breakthrough:.76,power:32},
  {name:"煉氣六層",need:2400,rate:4.1,breakthrough:.72,power:41},
  {name:"煉氣七層",need:3800,rate:5.2,breakthrough:.68,power:52},
  {name:"煉氣八層",need:6000,rate:6.5,breakthrough:.64,power:65},
  {name:"煉氣九層",need:9200,rate:8.0,breakthrough:.55,power:80},
  {name:"築基初期",need:15000,rate:10.5,breakthrough:.50,power:110},
  {name:"築基中期",need:26000,rate:13.0,breakthrough:.46,power:145},
  {name:"築基後期",need:42000,rate:16.5,breakthrough:.42,power:185},
  {name:"築基圓滿",need:65000,rate:20.0,breakthrough:0,power:235}
];

const zones=[
  {id:"greenhill",name:"青石坡",boss:"鐵背狼王",minRealm:0,difficulty:10,energy:1,desc:"山腳妖氣淡薄，適合初入仙途者。",monsters:["山狼","赤尾狐","灰背野豬"],materials:["狼牙","獸皮","青靈草"],equipDrop:["青竹劍","粗布道袍"]},
  {id:"blackwood",name:"黑木林",boss:"百年黑木猿",minRealm:2,difficulty:20,energy:1,desc:"林中常有低階妖獸與採藥人出沒。",monsters:["黑木猿","毒牙蛇","青眼狼"],materials:["黑木枝","蛇膽","凝露草"],equipDrop:["玄鐵短劍","青紋護腕"]},
  {id:"mistvalley",name:"迷霧谷",boss:"霧影妖豹",minRealm:4,difficulty:34,energy:2,desc:"靈霧終年不散，機緣與凶險並存。",monsters:["霧影豹","腐骨蜥","石甲蟲"],materials:["霧靈花","妖骨","下品妖丹","紫靈草"],equipDrop:["霧隱袍","靈紋玉佩"]},
  {id:"redcliff",name:"赤霞崖",boss:"赤羽炎鷹",minRealm:6,difficulty:54,energy:2,desc:"赤霞照壁，偶有築基修士遺物現世。",monsters:["赤焰鷹","火紋蜥","岩甲猿"],materials:["赤霞石","火靈芝","中品妖丹"],equipDrop:["赤霞劍","玄火護符"]},
  {id:"ancientruin",name:"古修遺跡",boss:"鎮墓石傀",minRealm:9,difficulty:82,energy:3,desc:"築基後方可深入，傳聞其中藏有古修功法。",monsters:["石傀儡","殘魂修士","噬靈獸"],materials:["古紋石","魂晶","遺跡殘片"],equipDrop:["古修法袍","鎮魂玉"]}
];

const equipmentDefs={
  "青竹劍":{slot:"weapon",power:6,rate:.03,desc:"青竹削成，蘊有微弱靈氣。"},
  "粗布道袍":{slot:"armor",power:4,rate:0,desc:"普通散修常穿的道袍。"},
  "玄鐵短劍":{slot:"weapon",power:11,rate:.04,desc:"玄鐵打造，沉重鋒利。"},
  "青紋護腕":{slot:"accessory",power:8,rate:.02,desc:"可穩定運轉靈氣。"},
  "霧隱袍":{slot:"armor",power:16,rate:.05,desc:"披上後身形若隱若現。"},
  "靈紋玉佩":{slot:"accessory",power:14,rate:.06,desc:"提升吐納效率。"},
  "赤霞劍":{slot:"weapon",power:24,rate:.05,desc:"劍身泛赤霞之光。"},
  "玄火護符":{slot:"accessory",power:20,rate:.04,desc:"蘊有玄火氣息。"},
  "古修法袍":{slot:"armor",power:32,rate:.08,desc:"古修遺留的法袍。"},
  "鎮魂玉":{slot:"accessory",power:28,rate:.07,desc:"能穩固神魂與道心。"}
};

const qualityDefs=[
  {id:"common",name:"凡品",mult:1.00,weight:55,className:"quality-common"},
  {id:"good",name:"良品",mult:1.18,weight:28,className:"quality-good"},
  {id:"superior",name:"上品",mult:1.42,weight:12,className:"quality-superior"},
  {id:"exquisite",name:"極品",mult:1.75,weight:4,className:"quality-exquisite"},
  {id:"spirit",name:"靈器",mult:2.20,weight:1,className:"quality-spirit"}
];

const affixDefs=[
  {name:"鋒銳",kind:"power",min:2,max:10},
  {name:"聚靈",kind:"rate",min:.01,max:.05},
  {name:"招財",kind:"stone",min:.02,max:.10},
  {name:"悟道",kind:"breakthrough",min:.01,max:.04}
];

const skillDefs={
  "吐納訣":{power:3,rate:.08,desc:"最基礎的吐納法門。"},
  "青木長生訣":{power:8,rate:.15,desc:"木系養生功法，修煉綿長。"},
  "玄元心法":{power:14,rate:.12,desc:"中正平和，攻守兼備。"},
  "赤陽真訣":{power:20,rate:.10,desc:"剛猛炙熱，提升戰力。"},
  "太虛養神篇":{power:24,rate:.18,desc:"古修養神法門，修煉效率極高。"}
};

const alchemyRecipes=[
  {name:"聚氣丹",desc:"服用後立即獲得 500 修為。",stone:30,mats:{"青靈草":2}},
  {name:"小還丹",desc:"服用後立即治癒內傷。",stone:50,mats:{"凝露草":2,"蛇膽":1}},
  {name:"築基丹",desc:"本次突破成功率 +20%。",stone:100,mats:{"紫靈草":2,"下品妖丹":1}}
];

const events=[
  {title:"殘破洞府",text:"你在山壁後發現一處被藤蔓遮掩的洞府。",reward:{spiritStone:60,daoHeart:1,item:["殘缺玉簡",1]}},
  {title:"前輩殘念",text:"一道模糊身影於識海中掠過，只留下一句「修心勝於修力」。",reward:{daoHeart:2,cultivation:80}},
  {title:"靈泉",text:"山澗深處湧出一眼靈泉，你盤坐片刻，氣海清明。",reward:{cultivation:120}},
  {title:"神秘藥草",text:"岩縫中生著一株泛著淡紫光芒的靈草。",reward:{item:["紫靈草",2],spiritStone:20}},
  {title:"煉丹師遺物",text:"你在枯骨旁發現一只丹瓶，瓶中尚有一顆丹藥。",reward:{item:["築基丹",1]}},
  {title:"無名石碑",text:"碑文殘缺，但你仍從中悟出一絲天地至理。",reward:{daoHeart:1,cultivation:180}},
  {title:"散修交易",text:"一名散修急於趕路，願低價出售一卷功法。",reward:{skill:"青木長生訣"}},
  {title:"古修藏書",text:"破敗石室中保存著半卷古法，文字仍散發微光。",reward:{skill:"玄元心法"}}
];

function defaultSave(){
  return {
    version:5,playerName:"李柏儒",realmIndex:0,cultivation:0,spiritStone:120,daoHeart:0,
    injuryUntil:0,mode:"breath",energy:5,energyUpdatedAt:Date.now(),lastTickAt:Date.now(),lastSavedAt:Date.now(),
    inventory:{},equipmentInventory:[],equipmentMeta:{},equipped:{weapon:null,armor:null,accessory:null},
    learnedSkills:["吐納訣"],equippedSkills:["吐納訣"],skillLevels:{"吐納訣":1},
    zoneWins:{},bossReady:{},activePillBonus:0,
    stats:{kills:0,events:0,breakthroughs:0,bossKills:0,alchemy:0},
    logs:["初入仙途，靈台清明。"]
  };
}

let state=null,db=null;
const $=id=>document.getElementById(id);
const fmt=n=>Math.floor(n).toLocaleString("zh-TW");
function escapeHTML(str){return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

function openDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains(STORE))d.createObjectStore(STORE)};
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });
}
function readSave(){
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,"readonly"),req=tx.objectStore(STORE).get(KEY);
    req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);
  });
}
function writeSave(){
  state.lastSavedAt=Date.now();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put(state,KEY);
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
  });
}

function migrateSave(save){
  const base=defaultSave();
  if(!save)return base;
  const s={...base,...save};
  s.version=5;
  s.inventory={...(save.inventory||{})};
  s.equipmentInventory=Array.isArray(save.equipmentInventory)?save.equipmentInventory:[];
  s.equipmentMeta={...(save.equipmentMeta||{})};
  s.equipped={...base.equipped,...(save.equipped||{})};
  s.learnedSkills=Array.isArray(save.learnedSkills)&&save.learnedSkills.length?save.learnedSkills:["吐納訣"];
  s.equippedSkills=Array.isArray(save.equippedSkills)&&save.equippedSkills.length?save.equippedSkills:["吐納訣"];
  s.skillLevels={...(save.skillLevels||{})};
  for(const name of s.learnedSkills)if(!s.skillLevels[name])s.skillLevels[name]=1;
  s.zoneWins={...(save.zoneWins||{})};
  s.bossReady={...(save.bossReady||{})};
  s.stats={...base.stats,...(save.stats||{})};
  s.activePillBonus=Number(save.activePillBonus||0);
  s.spiritStone=Math.max(0,Number(s.spiritStone||0));
  for(const name of s.equipmentInventory){
    if(equipmentDefs[name]&&!s.equipmentMeta[name])s.equipmentMeta[name]=makeEquipmentMeta(name,0);
  }
  return s;
}

function realm(){return realms[Math.min(state.realmIndex,realms.length-1)]}
function isInjured(){return Date.now()<state.injuryUntil}
function addLog(t){state.logs.unshift(t);state.logs=state.logs.slice(0,60)}
function addItem(name,count=1){state.inventory[name]=(state.inventory[name]||0)+count}
function removeItem(name,count=1){
  if((state.inventory[name]||0)<count)return false;
  state.inventory[name]-=count;if(state.inventory[name]<=0)delete state.inventory[name];return true;
}

function rollQuality(minIndex=0){
  const pool=qualityDefs.slice(minIndex),total=pool.reduce((a,q)=>a+q.weight,0);let r=Math.random()*total;
  for(const q of pool){r-=q.weight;if(r<=0)return q}return pool[0];
}
function qualityOf(id){return qualityDefs.find(q=>q.id===id)||qualityDefs[0]}
function makeEquipmentMeta(name,minQuality=0){
  const q=rollQuality(minQuality),base=equipmentDefs[name];
  const affixCount=q.id==="common"?0:q.id==="good"?1:q.id==="superior"?2:3;
  const pool=[...affixDefs],affixes=[];
  for(let i=0;i<affixCount&&pool.length;i++){
    const idx=Math.floor(Math.random()*pool.length),d=pool.splice(idx,1)[0],raw=d.min+Math.random()*(d.max-d.min);
    affixes.push({name:d.name,kind:d.kind,value:d.kind==="power"?Math.round(raw):Number(raw.toFixed(3))});
  }
  return {quality:q.id,power:Math.round(base.power*q.mult),rate:Number((base.rate*q.mult).toFixed(3)),affixes};
}
function equipmentStats(name){
  const base=equipmentDefs[name],m=state.equipmentMeta[name]||{quality:"common",power:base.power,rate:base.rate,affixes:[]};
  const out={power:m.power??base.power,rate:m.rate??base.rate,stone:0,breakthrough:0};
  for(const a of m.affixes||[])out[a.kind]=(out[a.kind]||0)+a.value;
  return out;
}
function affixText(a){
  if(a.kind==="power")return `${a.name} 戰力 +${a.value}`;
  if(a.kind==="rate")return `${a.name} 修煉 +${Math.round(a.value*100)}%`;
  if(a.kind==="stone")return `${a.name} 靈石 +${Math.round(a.value*100)}%`;
  return `${a.name} 突破 +${Math.round(a.value*100)}%`;
}
function equipmentBonus(){
  return Object.values(state.equipped).filter(Boolean).reduce((acc,name)=>{
    if(!equipmentDefs[name])return acc;
    const d=equipmentStats(name);acc.power+=d.power;acc.rate+=d.rate;acc.stone+=d.stone||0;acc.breakthrough+=d.breakthrough||0;return acc;
  },{power:0,rate:0,stone:0,breakthrough:0});
}
function skillBonus(){
  return state.equippedSkills.reduce((acc,name)=>{
    const d=skillDefs[name];if(!d)return acc;
    const lv=Math.max(1,Math.min(5,state.skillLevels[name]||1)),mult=1+(lv-1)*.20;
    acc.power+=d.power*mult;acc.rate+=d.rate*mult;return acc;
  },{power:0,rate:0});
}
function totalPower(){const e=equipmentBonus(),s=skillBonus();return realm().power+state.daoHeart*1.2+e.power+s.power}
function currentRate(){
  const e=equipmentBonus(),s=skillBonus(),mult=1+e.rate+s.rate;
  return realm().rate*(state.mode==="wander"?.62:1)*(isInjured()?.7:1)*mult;
}
function currentStoneRate(){const e=equipmentBonus();return(state.mode==="wander"?.12:.025)*(1+(e.stone||0))}
function breakthroughChance(){
  if(state.realmIndex>=realms.length-1)return 0;
  const base=realm().breakthrough,dao=Math.min(.20,state.daoHeart*.01),injury=isInjured()?-.15:0,e=equipmentBonus();
  return Math.max(.05,Math.min(.99,base+dao+injury+state.activePillBonus+(e.breakthrough||0)));
}

function restoreEnergy(){
  const now=Date.now(),elapsed=Math.max(0,now-(state.energyUpdatedAt||now)),gained=Math.floor(elapsed/(20*60*1000));
  if(gained>0){state.energy=Math.min(5,state.energy+gained);state.energyUpdatedAt+=gained*20*60*1000}
}
function applyElapsed(seconds,offline=false){
  const capped=Math.max(0,Math.min(seconds,offline?OFFLINE_CAP_SECONDS:seconds)),cGain=currentRate()*capped,sGain=currentStoneRate()*capped;
  state.cultivation+=cGain;state.spiritStone+=sGain;return{cGain,sGain,seconds:capped};
}

function learnSkill(name){
  if(!skillDefs[name])return;
  if(!state.learnedSkills.includes(name)){state.learnedSkills.push(name);state.skillLevels[name]=1;addLog(`領悟功法《${name}》。`)}
}
function equipSkill(name){
  if(!state.learnedSkills.includes(name))return;
  if(state.equippedSkills.includes(name)){state.equippedSkills=state.equippedSkills.filter(x=>x!==name);return}
  if(state.equippedSkills.length>=3){addLog("最多同時裝備 3 本功法。");return}
  state.equippedSkills.push(name);
}
function skillUpgradeCost(name){const lv=state.skillLevels[name]||1;return 100*lv*lv}
function upgradeSkill(name){
  const lv=state.skillLevels[name]||1;if(lv>=5)return false;
  const cost=skillUpgradeCost(name);if(state.spiritStone<cost)return false;
  state.spiritStone-=cost;state.skillLevels[name]=lv+1;addLog(`《${name}》提升至第 ${lv+1} 重。`);return true;
}

function equipItem(name){
  const d=equipmentDefs[name];if(!d||!state.equipmentInventory.includes(name))return;
  state.equipped[d.slot]=name;addLog(`裝備「${name}」。`);
}
function tryEquipmentDrop(z,boss=false){
  if(Math.random()>(boss?1:.28))return null;
  const name=z.equipDrop[Math.floor(Math.random()*z.equipDrop.length)];
  if(!state.equipmentInventory.includes(name)){
    state.equipmentInventory.push(name);state.equipmentMeta[name]=makeEquipmentMeta(name,boss?1:0);
    return `${qualityOf(state.equipmentMeta[name].quality).name}·${name}`;
  }
  state.spiritStone+=boss?60:25;return `${name}（重複，轉化靈石 +${boss?60:25}）`;
}
function trySkillDrop(z){
  if(Math.random()>=.08)return null;
  let name=null;
  if(z.id==="blackwood")name="青木長生訣";
  if(z.id==="mistvalley")name="玄元心法";
  if(z.id==="redcliff")name="赤陽真訣";
  if(z.id==="ancientruin")name="太虛養神篇";
  if(name){learnSkill(name);return name}return null;
}

function canCraft(recipe){
  return state.spiritStone>=recipe.stone&&Object.entries(recipe.mats).every(([n,c])=>(state.inventory[n]||0)>=c);
}
function craft(recipeName){
  const r=alchemyRecipes.find(x=>x.name===recipeName);if(!r||!canCraft(r))return false;
  state.spiritStone-=r.stone;for(const[n,c]of Object.entries(r.mats))removeItem(n,c);
  addItem(r.name,1);state.stats.alchemy=(state.stats.alchemy||0)+1;addLog(`煉成「${r.name}」×1。`);return true;
}
function useInventoryItem(name){
  if(!(state.inventory[name]||0))return false;
  if(name==="聚氣丹"){removeItem(name,1);state.cultivation+=500;addLog("服用聚氣丹，修為 +500。");return true}
  if(name==="小還丹"){removeItem(name,1);state.injuryUntil=0;addLog("服用小還丹，內傷已癒。");return true}
  return false;
}

function renderInventory(){
  const entries=Object.entries(state.inventory).filter(([,n])=>n>0);
  $("bagCount").textContent=`${entries.length} 種物品`;
  $("inventoryList").innerHTML=entries.length?entries.map(([name,count])=>{
    let desc="修仙途中取得的材料或道具。";
    if(name==="築基丹")desc="突破時可增加 20% 成功率。";
    if(name==="聚氣丹")desc="立即增加 500 修為。";
    if(name==="小還丹")desc="立即治癒內傷。";
    const usable=name==="聚氣丹"||name==="小還丹";
    return `<div class="item-row"><div class="row-copy"><b>${escapeHTML(name)}</b><small>${desc}</small></div><div class="item-actions"><strong>×${count}</strong>${usable?`<button class="item-use-btn" data-use-item="${name}" type="button">使用</button>`:""}</div></div>`;
  }).join(""):`<div class="empty">儲物袋目前是空的。</div>`;
  document.querySelectorAll(".item-use-btn").forEach(b=>b.addEventListener("click",async()=>{useInventoryItem(b.dataset.useItem);render();await writeSave()}));
}
function renderAlchemy(){
  $("alchemyText").textContent=`已煉 ${state.stats.alchemy||0} 次`;
  $("alchemyList").innerHTML=alchemyRecipes.map(r=>{
    const mats=Object.entries(r.mats).map(([n,c])=>`${n} ${state.inventory[n]||0}/${c}`).join("、"),ok=canCraft(r);
    return `<div class="recipe-row"><div class="recipe-copy"><b>${r.name}</b><small>${r.desc}<br>${mats}｜靈石 ${fmt(state.spiritStone)}/${fmt(r.stone)}</small></div><button class="recipe-btn" data-craft="${r.name}" type="button" ${ok?"":"disabled"}>煉製</button></div>`;
  }).join("");
  document.querySelectorAll(".recipe-btn").forEach(b=>b.addEventListener("click",async()=>{craft(b.dataset.craft);render();await writeSave()}));
}
function renderEquipment(){
  const labels={weapon:"武器",armor:"法衣",accessory:"飾品"};
  $("equipmentSlots").innerHTML=Object.entries(labels).map(([slot,label])=>{
    const name=state.equipped[slot],meta=name?state.equipmentMeta[name]:null,q=meta?qualityOf(meta.quality):null;
    return `<div class="slot"><span>${label}</span><strong class="${q?q.className:""}">${name?`【${q.name}】${name}`:"未裝備"}</strong></div>`;
  }).join("");
  $("equipmentBag").innerHTML=state.equipmentInventory.length?state.equipmentInventory.map(name=>{
    const d=equipmentDefs[name],m=state.equipmentMeta[name]||makeEquipmentMeta(name,0),q=qualityOf(m.quality),s=equipmentStats(name),equipped=Object.values(state.equipped).includes(name);
    const chips=[`戰力 +${s.power}`,`修煉 +${Math.round(s.rate*100)}%`,...(m.affixes||[]).map(affixText)];
    return `<div class="equip-row"><div class="row-copy"><b class="${q.className}">【${q.name}】${name}</b><small>${d.desc}</small><div class="gear-meta">${chips.map(x=>`<span class="gear-chip">${x}</span>`).join("")}</div></div><button class="equip-btn" data-equip="${name}" type="button">${equipped?"已裝備":"裝備"}</button></div>`;
  }).join(""):`<div class="empty">尚未取得裝備，前往歷練有機會掉落。</div>`;
  document.querySelectorAll(".equip-btn").forEach(b=>b.addEventListener("click",async()=>{equipItem(b.dataset.equip);render();await writeSave()}));
}
function renderSkills(){
  $("skillCountText").textContent=`${state.equippedSkills.length} / 3`;
  $("skillList").innerHTML=state.learnedSkills.map(name=>{
    const d=skillDefs[name],on=state.equippedSkills.includes(name),lv=state.skillLevels[name]||1,mult=1+(lv-1)*.20,cost=skillUpgradeCost(name),max=lv>=5;
    return `<div class="skill-row"><div class="row-copy"><b>《${name}》</b><span class="skill-level">第 ${lv} 重</span><small>${d.desc}｜戰力 +${Math.round(d.power*mult)}｜修煉 +${Math.round(d.rate*mult*100)}%</small></div><div class="skill-actions"><button class="skill-btn" data-skill="${name}" type="button">${on?"卸下":"裝備"}</button><button class="skill-upgrade-btn" data-upgrade-skill="${name}" type="button" ${max||state.spiritStone<cost?"disabled":""}>${max?"已滿重":`升級 ${cost} 靈石`}</button></div></div>`;
  }).join("");
  document.querySelectorAll(".skill-btn").forEach(b=>b.addEventListener("click",async()=>{equipSkill(b.dataset.skill);render();await writeSave()}));
  document.querySelectorAll(".skill-upgrade-btn").forEach(b=>b.addEventListener("click",async()=>{upgradeSkill(b.dataset.upgradeSkill);render();await writeSave()}));
}
function renderZones(){
  restoreEnergy();$("energyText").textContent=`體力 ${state.energy} / 5`;
  $("zoneList").innerHTML=zones.map(z=>{
    const locked=state.realmIndex<z.minRealm,wins=state.zoneWins[z.id]||0,boss=!!state.bossReady[z.id],can1=!locked&&state.energy>=z.energy,can3=!locked&&state.energy>=z.energy*3;
    return `<section class="card zone-card"><div class="zone-top"><div><h3>${z.name}</h3><p>${z.desc}</p></div><div class="zone-level">${locked?`需 ${realms[z.minRealm].name}`:`勝場 ${wins}/4`}</div></div>${boss?`<div class="boss-line">Boss 已出現：${z.boss}</div>`:""}<div class="zone-actions"><button class="zone-btn" data-zone="${z.id}" data-runs="1" type="button" ${can1?"":"disabled"}>${locked?"境界不足":"歷練 ×1"}</button><button class="zone-btn" data-zone="${z.id}" data-runs="3" type="button" ${can3?"":"disabled"}>連續 ×3</button></div>${boss?`<button class="zone-btn boss-btn" data-boss="${z.id}" type="button" ${can1?"":"disabled"}>挑戰 Boss</button>`:""}</section>`;
  }).join("");
  document.querySelectorAll(".zone-btn[data-zone]").forEach(b=>b.addEventListener("click",()=>runAdventureBatch(b.dataset.zone,Number(b.dataset.runs))));
  document.querySelectorAll(".boss-btn").forEach(b=>b.addEventListener("click",()=>runBoss(b.dataset.boss)));
}

function render(){
  restoreEnergy();const r=realm(),chance=breakthroughChance();
  $("playerName").textContent=state.playerName;$("realmText").textContent=r.name;$("cultivationText").textContent=fmt(state.cultivation);$("stoneText").textContent=fmt(state.spiritStone);
  $("rateText").textContent=`+${currentRate().toFixed(1)} / 秒`;$("daoHeartText").textContent=fmt(state.daoHeart);$("progressLabel").textContent=`${fmt(state.cultivation)} / ${fmt(r.need)}`;$("progressBar").style.width=`${Math.min(100,state.cultivation/r.need*100)}%`;
  $("breakthroughRate").textContent=state.realmIndex>=realms.length-1?"已達版本上限":`${Math.round(chance*100)}%`;$("baseRate").textContent=state.realmIndex>=realms.length-1?"--":`${Math.round(r.breakthrough*100)}%`;$("daoBonus").textContent=`+${Math.min(20,state.daoHeart)}%`;$("pillBonus").textContent=`+${Math.round(state.activePillBonus*100)}%`;
  $("pillCountText").textContent=`×${state.inventory["築基丹"]||0}`;$("usePillBtn").disabled=!!state.activePillBonus||!(state.inventory["築基丹"]||0);$("injuryNotice").classList.toggle("hidden",!isInjured());
  const canBreak=state.cultivation>=r.need&&state.realmIndex<realms.length-1;$("breakthroughBtn").disabled=!canBreak;$("breakthroughBtn").textContent=state.realmIndex>=realms.length-1?"V0.8 開放更高境界":(canBreak?"嘗試突破":"修為未滿");
  $("runningStatus").textContent=state.mode==="wander"?"歷練中":"吐納中";document.querySelectorAll(".mode-btn").forEach(b=>b.classList.toggle("active",b.dataset.mode===state.mode));
  $("logList").innerHTML=state.logs.map(x=>`<div class="log-item">${escapeHTML(x)}</div>`).join("");
  $("mRealm").textContent=r.name;
  $("mCultivation").textContent=fmt(state.cultivation);
  $("mStone").textContent=fmt(state.spiritStone);
  $("mPower").textContent=Math.round(totalPower());
  $("powerText").textContent=`戰力 ${Math.round(totalPower())}`;$("charRealm").textContent=r.name;$("charDao").textContent=fmt(state.daoHeart);$("charPower").textContent=Math.round(totalPower());$("charKills").textContent=fmt(state.stats.kills);$("charEvents").textContent=fmt(state.stats.events);$("charBreaks").textContent=fmt(state.stats.breakthroughs||0);$("charBoss").textContent=fmt(state.stats.bossKills||0);$("charAlchemy").textContent=fmt(state.stats.alchemy||0);
  renderZones();renderInventory();renderAlchemy();renderEquipment();renderSkills();
}

async function runAdventureOnce(z){
  if(state.energy<z.energy)return{ok:false,lines:["體力不足。"]};
  state.energy-=z.energy;state.energyUpdatedAt=Date.now();
  const playerPower=totalPower()+Math.random()*8,enemyPower=z.difficulty*(.78+Math.random()*.55),monster=z.monsters[Math.floor(Math.random()*z.monsters.length)],lines=[`遭遇 ${monster}（我方 ${Math.round(playerPower)} / 敵方 ${Math.round(enemyPower)}）`];
  if(playerPower>=enemyPower){
    const cg=Math.round(25+z.difficulty*1.7+Math.random()*35),sg=Math.round(18+z.difficulty*2+Math.random()*40);
    state.cultivation+=cg;state.spiritStone+=sg;state.stats.kills+=1;state.zoneWins[z.id]=(state.zoneWins[z.id]||0)+1;lines.push(`勝利：修為 +${cg}、靈石 +${sg}`);
    if(Math.random()<.72){const item=z.materials[Math.floor(Math.random()*z.materials.length)],count=Math.random()<.18?2:1;addItem(item,count);lines.push(`${item} ×${count}`)}
    const equip=tryEquipmentDrop(z,false);if(equip)lines.push(`裝備：${equip}`);
    const skill=trySkillDrop(z);if(skill)lines.push(`功法：《${skill}》`);
    if((state.zoneWins[z.id]||0)>=4){state.zoneWins[z.id]=0;state.bossReady[z.id]=true;lines.push(`Boss「${z.boss}」出現！`)}
    if(Math.random()<.15)triggerEvent();
    return{ok:true,lines};
  }
  const loss=Math.max(5,Math.round(realm().need*.03));state.cultivation=Math.max(0,state.cultivation-loss);state.injuryUntil=Date.now()+5*60*1000;lines.push(`戰敗：修為 -${loss}，輕傷 5 分鐘。`);return{ok:false,lines};
}

async function runAdventureBatch(zoneId,runs){
  const z=zones.find(x=>x.id===zoneId);if(!z||state.realmIndex<z.minRealm)return;
  const actual=Math.min(runs,Math.floor(state.energy/z.energy));if(actual<=0)return;
  const all=[];let wins=0;
  for(let i=0;i<actual;i++){const r=await runAdventureOnce(z);if(r.ok)wins++;all.push(`第 ${i+1} 戰：${r.lines.join("；")}`)}
  $("battleResult").textContent=`${wins}/${actual} 勝`;$("battleLog").textContent=all.join("\n\n");addLog(`於「${z.name}」連戰 ${actual} 場，勝 ${wins} 場。`);render();await writeSave();
}

async function runBoss(zoneId){
  const z=zones.find(x=>x.id===zoneId);if(!z||!state.bossReady[z.id]||state.energy<z.energy)return;
  state.energy-=z.energy;state.energyUpdatedAt=Date.now();
  const playerPower=totalPower()+Math.random()*10,enemyPower=z.difficulty*1.35*(.9+Math.random()*.35),lines=[`Boss：${z.boss}`,`我方 ${Math.round(playerPower)} / Boss ${Math.round(enemyPower)}`];
  if(playerPower>=enemyPower){
    const cg=Math.round(100+z.difficulty*4),sg=Math.round(120+z.difficulty*5);
    state.cultivation+=cg;state.spiritStone+=sg;state.stats.bossKills=(state.stats.bossKills||0)+1;state.bossReady[z.id]=false;lines.push(`擊破 Boss！修為 +${cg}、靈石 +${sg}`);
    const gear=tryEquipmentDrop(z,true);if(gear)lines.push(`Boss 掉落：${gear}`);if(Math.random()<.35){addItem("築基丹",1);lines.push("築基丹 ×1")}
  }else{state.injuryUntil=Date.now()+10*60*1000;lines.push("Boss 戰敗，內傷 10 分鐘；Boss 仍會留在此處。")}
  $("battleResult").textContent=playerPower>=enemyPower?"Boss 擊破":"Boss 戰敗";$("battleLog").textContent=lines.join("\n");addLog(lines[lines.length-1]);render();await writeSave();
}

function triggerEvent(){
  const e=events[Math.floor(Math.random()*events.length)],r=e.reward,rewards=[];
  if(r.cultivation){state.cultivation+=r.cultivation;rewards.push(`修為 +${r.cultivation}`)}
  if(r.spiritStone){state.spiritStone+=r.spiritStone;rewards.push(`靈石 +${r.spiritStone}`)}
  if(r.daoHeart){state.daoHeart+=r.daoHeart;rewards.push(`道心 +${r.daoHeart}`)}
  if(r.item){addItem(r.item[0],r.item[1]);rewards.push(`${r.item[0]} ×${r.item[1]}`)}
  if(r.skill){learnSkill(r.skill);rewards.push(`領悟《${r.skill}》`)}
  state.stats.events+=1;$("eventTitle").textContent=e.title;$("eventText").textContent=e.text;$("eventRewards").innerHTML=rewards.map(x=>`<div>${escapeHTML(x)}</div>`).join("");addLog(`機緣「${e.title}」：${rewards.join("、")}`);if(typeof $("eventDialog").showModal==="function")$("eventDialog").showModal();
}

async function bootstrap(){
  db=await openDB();state=migrateSave(await readSave());restoreEnergy();
  const now=Date.now(),elapsed=Math.max(0,(now-(state.lastSavedAt||now))/1000);
  if(elapsed>=10){
    const reward=applyElapsed(elapsed,true),h=Math.floor(reward.seconds/3600),m=Math.floor((reward.seconds%3600)/60);
    $("offlineTimeText").textContent=`你離線了 ${h} 小時 ${m} 分鐘。`;$("offlineCultivationText").textContent=`+${fmt(reward.cGain)}`;$("offlineStoneText").textContent=`+${fmt(reward.sGain)}`;addLog(`閉關歸來：修為 +${fmt(reward.cGain)}、靈石 +${fmt(reward.sGain)}。`);
    if(typeof $("offlineDialog").showModal==="function")$("offlineDialog").showModal();
  }
  state.lastTickAt=now;render();await writeSave();
  setInterval(async()=>{
    const t=Date.now(),delta=Math.max(0,Math.min(5,(t-state.lastTickAt)/1000));state.lastTickAt=t;applyElapsed(delta,false);render();
    if(Math.floor(t/5000)!==Math.floor((t-1000)/5000))await writeSave();
  },1000);
}

$("breakthroughBtn").addEventListener("click",async()=>{
  const r=realm();if(state.cultivation<r.need||state.realmIndex>=realms.length-1)return;
  const chance=breakthroughChance();
  if(Math.random()<chance){state.cultivation-=r.need;state.realmIndex+=1;state.daoHeart+=1;state.stats.breakthroughs=(state.stats.breakthroughs||0)+1;addLog(`突破成功！踏入「${realm().name}」，道心 +1。`)}
  else{const penalty=Math.round(r.need*.20);state.cultivation=Math.max(0,state.cultivation-penalty);state.injuryUntil=Date.now()+10*60*1000;if(Math.random()<.18){state.daoHeart+=1;addLog(`突破失敗，修為 -${penalty}；生死間有所領悟，道心 +1。`)}else addLog(`突破失敗，修為 -${penalty}，內傷 10 分鐘。`)}
  state.activePillBonus=0;render();await writeSave();
});
$("usePillBtn").addEventListener("click",async()=>{if(state.activePillBonus||!removeItem("築基丹",1))return;state.activePillBonus=.20;addLog("服用築基丹，本次突破成功率 +20%。");render();await writeSave()});
document.querySelectorAll(".mode-btn").forEach(b=>b.addEventListener("click",async()=>{state.mode=b.dataset.mode;addLog(state.mode==="wander"?"你離開洞府，前往山野歷練。":"你盤膝而坐，開始吐納天地靈氣。");render();await writeSave()}));
document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>{const page=b.dataset.page;document.querySelectorAll(".nav-btn").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".page").forEach(x=>x.classList.toggle("active",x.id===`page-${page}`));window.scrollTo({top:0,behavior:"smooth"})}));
$("clearLogBtn").addEventListener("click",async()=>{state.logs=[];render();await writeSave()});
$("testGearBtn").addEventListener("click",async()=>{
  for(const name of["玄鐵短劍","霧隱袍","靈紋玉佩"]){if(!state.equipmentInventory.includes(name))state.equipmentInventory.push(name);state.equipmentMeta[name]=makeEquipmentMeta(name,2)}
  if(!state.learnedSkills.includes("青木長生訣")){state.learnedSkills.push("青木長生訣");state.skillLevels["青木長生訣"]=1}
  addItem("築基丹",1);addLog("已領取 V0.7 測試裝備：至少上品品質，附隨機詞條。");render();await writeSave();
});
$("testAlchemyBtn").addEventListener("click",async()=>{
  addItem("青靈草",6);
  addItem("凝露草",4);
  addItem("蛇膽",2);
  addItem("紫靈草",4);
  addItem("下品妖丹",2);
  state.spiritStone+=500;
  addLog("領取煉丹測試材料與靈石 +500。");
  render();
  await writeSave();
});

$("resetBtn").addEventListener("click",async()=>{if(!confirm("確定重置所有進度？此動作無法復原。"))return;state=defaultSave();render();await writeSave()});
document.addEventListener("visibilitychange",async()=>{if(document.visibilityState==="hidden"&&state)await writeSave()});
if("serviceWorker"in navigator)navigator.serviceWorker.register("./service-worker.js").catch(console.warn);
bootstrap().catch(err=>{console.error(err);alert("遊戲初始化失敗，請重新整理頁面。")});
