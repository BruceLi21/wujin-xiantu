const CACHE="wujin-xiantu-v17-cache";
const FALLBACK="./index.html?v=17";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const req=e.request;
  if(req.mode==="navigate"){
    e.respondWith(fetch(req,{cache:"no-store"}).then(res=>{
      const clone=res.clone();caches.open(CACHE).then(c=>c.put(FALLBACK,clone));return res;
    }).catch(()=>caches.match(FALLBACK)));
    return;
  }
  e.respondWith(fetch(req,{cache:"no-store"}).then(res=>{
    const clone=res.clone();caches.open(CACHE).then(c=>c.put(req,clone));return res;
  }).catch(()=>caches.match(req)));
});
