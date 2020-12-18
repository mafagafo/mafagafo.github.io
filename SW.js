const cacheList = ["/","/script/app.js","/css/style.css"];
const My = "LIB"
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(My).then(function(caches){
            console.log('Caches foi utilizado');
            return caches.addAll(cacheList)
        })
    );
});
self.addEventListener("fetch", function(event){
    event.respondWith(
        caches.match(event.request).then(function(response){
            if(response){
                return response;
            }
            var Fetcheven = event.request.clone();
            return fetch(Fetcheven).then(function(resposta){
                if(!resposta|| resposta.status !== 200 || resposta.type !== "basic" ){
                    return resposta;
                }
                var resposToCache = resposta.clone();
                caches.open(My).then(function(cache){
                    cache.put(event.request,resposToCache);
                });
                return resposta
            })
        })
    )
});
self.addEventListener("activate", (e)=>{
    e.waitUntil(caches.keys().then(keyList =>{
        return Promise.all(keyList.map(key=>{
            if(key !== My){
                return caches.delete(key);
            }
        }));
    }));
});
async function updateArticles() {
    const articlesCache = await caches.open(My);
    await articlesCache.add('/');
  }
self.addEventListener('sync', event=>{
    if(event.tag === "Sinc"){
        event.waitUntil(
            updateArticles()
        );
    }
});
self.addEventListener('periodicsync', event => {
    event.waitUntil(updateArticles());
  });