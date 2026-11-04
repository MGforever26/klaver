const CACHE='nodevaerk-v3.0.0';
const ASSETS=['./','./index.html','./style.css','./app.js','./engine.js','./notation.js','./curriculum.js','./learning.js','./repertoire.js','./studio.js','./icon-180.png','./icon-192.png','./icon-512.png','./vendor/vexflow.js','./icon.svg','./manifest.json'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('nodevaerk-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;event.respondWith(fetch(event.request).then(response=>{if(response.ok&&ASSETS.some(a=>new URL(a,self.location.href).href===event.request.url)){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match(event.request).then(response=>response||(event.request.mode==='navigate'?caches.match('./index.html'):Response.error()))));});

