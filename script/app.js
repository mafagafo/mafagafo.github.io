var _images = document.querySelectorAll('img[data-src]');
var _galeria = document.getElementsByClassName('col');
function carrImagen(imagem) {
    imagem.setAttribute('src', imagem.getAttribute("data-src"));
    imagem.onload = () => {
        imagem.removeAttribute('data-src');
    }
}
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/SW.js').then(registro=>{
        console.log("Service Worker registrado");
    }, erro => {
        console.log("Não foi possível registra o service Worker", erro);
    });
} else {
    console.log("Navegador não é compativel com o service worker");
}
if('share'in navigator){
    document.getElementById("share").addEventListener("click",async ()=>{
        try {
            await navigator.share({title : "Projeto expanção Jovem - Grajaú", text: "Tenha sempre perto de você, toda a programação do PEJ - Grajaú", url : document.querySelector('link[rel=canonical]').href});
        } catch (error) {
            return null
        }
    });
} else {
    document.getElementById("share").style.display = 'none';
}
document.getElementById('btmn').addEventListener('click',()=>{
    let el = document.querySelector('nav');
    if(el.className === "active"){
        el.className = "";
    }  else {
        el.className = "active"
    }
});
async function periodico() {
    const regis = await navigator.serviceWorker.ready;
    try {
        await regis.periodicSync.register('bg-sinc', {minIterval: 24*60*60*1000})
    } catch (error) {
        console.log('deu ruim', error);
    }
}
async function conte() {
    if ('fetch' in window){
        const templa = "<article><h2>#TITULO</h2><p>#ABSTRATO</p><figure><img src='#IMAGEM' alt='#LEGENDA' title='#LEGENDA'><figcaption>#LEGENDA</figcaption></figure><p>#MATERIA</p><div><p>#AUTOR<br/>Data de publicação: <time datatime='#DATA'>#DATA</time></p></div></article>";
        fetch("/script/material.json").then(response=>{
            response.json().then(dados=>{
                dados.forEach(element => {
                    document.querySelector('main').innerHTML += templa.replace(/#TITULO/g, element.titulo)
                    .replace(/#ABSTRATO/g, element.abstrato).replace(/#IMAGEM/g,element.imagem)
                    .replace(/#LEGENDA/g,element.legenda).replace(/#MATERIA/g, element.materia)
                    .replace(/#AUTOR/g, element.autor).replace(/#DATA/g, element.data);
                });
            })
        });
    } else {
        const templa = "<article><h2>#TITULO</h2><p>#ABSTRATO</p><figure><img src='#IMAGEM' alt='#LEGENDA' title='#LEGENDA'><figcaption>#LEGENDA</figcaption></figure><p>#MATERIA</p><footer><p>#AUTOR<br/>Data de publicação: <time datatime='#DATA'>#DATA</time></p></footer></article>";
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () =>{
            if(xhr.readyState == "4" && xhr.status == "200"){
                let rsp = JSON.parse(xhr.responseText);
                for (let i = 0; i < rsp.length; i++){
                    document.querySelector('main').innerHTML += templa.replace(/#TITULO/g, rsp[i].titulo)
                    .replace(/#ABSTRATO/g, rsp[i].abstrato).replace(/#IMAGEM/g,rsp[i].imagem)
                    .replace(/#LEGENDA/g,rsp[i].legenda).replace(/#MATERIA/g, rsp[i].materia)
                    .replace(/#AUTOR/g, rsp[i].autor).replace(/#DATA/g, rsp[i].data);                
                }
            }
        }
        xhr.open('GET', "/script/material.json");
        xhr.send(null);
    }
}
if(document.getElementsByClassName('install') != null){
    var death;
    let insta =  document.getElementsByClassName("install")[0];
    insta.style.display = 'none';
    window.addEventListener("beforeinstallprompt", e => {
        e.preventDefault();
        death = e;
        insta.style.display = 'block';
        insta.addEventListener("click", ()=>{
            insta.style.display = 'none';
            death.prompt();
            death.userChoice.then(choice =>{
                if(choice === "accepted") {
                    console.log("aceito")
                } else {
                    console.log("negado")
                }
                death = null;
            });
            navigator.serviceWorker.ready.then(sync=>{
                sync.sync.register("Sinc").then(event=>{console.log('Sicronização de fundo registrada',event)}).catch(err=>console.log("erro no registro da sincronização", err))
            });
        });   
    });
}
if('IntersectionObserver' in window){
    var observador = new IntersectionObserver(function(itens, observador){
        itens.forEach(function(item){
            if(item.isIntersecting){
                carrImagen(item.target);
                observador.unobserve(item.target);
            }
        });
    });
    _images.forEach(function (img){
        observador.observe(img)
    });
} else {
    _images.forEach(function(img){
        carrImagen(img)
    });
}
function one(){
    for(let i =0; i < _galeria.length; i++){
        _galeria[i].style.flex = '100%'
    }
}
function two(){
    for (let i =0; i < _galeria.length; i++){
        _galeria[i].style.flex = "50%";
    }
}
function tree(){
    for(let i = 0; i < _galeria.length; i++){
        _galeria[i].style.flex = "25%";
    }
}
function interruptor(){
    let cab = document.querySelector('header'), mn = document.querySelector('nav'), foo = document.querySelector('footer');
    if(localStorage.luzes == null){
        localStorage.setItem("luzes", "yes");
    } else if (localStorage.luzes === "yes"){
        localStorage.luzes = "no";
        cab.className = 'nocturne';
        mn.className = 'nocturne';
        foo.className = 'nocturne';
    }else if(localStorage.luzes === "no"){
        localStorage.luzes = "yes";
        cab.className = 'diem';
        mn.className = 'diem';
        foo.className = 'diem';
    }
}
periodico();