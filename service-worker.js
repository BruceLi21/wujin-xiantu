const CACHE="wujin-xiantu-v20-cache";
const FALLBACK="./index.html?v=20";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request,{cache:"no-store"}).then(res=>{
      const c=res.clone(); caches.open(CACHE).then(x=>x.put(FALLBACK,c)); return res;
    }).catch(()=>caches.match(FALLBACK)));
    return;
  }
  e.respondWith(fetch(e.request,{cache:"no-store"}).catch(()=>caches.match(e.request)));
});
