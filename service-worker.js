const CACHE="wujin-xiantu-v14-cache";
const FALLBACK="./index.html?v=13";
self.addEventListener("install",e=>{self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const req=e.request;
  if(req.mode==="navigate"){
    e.respondWith(fetch(req,{cache:"no-store"}).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(FALLBACK,c));return res}).catch(()=>caches.match(FALLBACK)));
    return;
  }
  e.respondWith(fetch(req,{cache:"no-store"}).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(req,c));return res}).catch(()=>caches.match(req)));
});
