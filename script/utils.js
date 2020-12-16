console.info('utils.js carregado');
var _info; var _count = 0;
const Utils = {};
Utils.newUUID = () => {
	let UUID;
	if (window.crypto.getRandomValues){
	console.log("Navegador compativel com 'Crypto API'");
	UUID = "xxxxxxxx-xxxx-4xxx-9xxx-xxxxxxxxxxxx".replace(/x/g, () => {return Number((window.crypto.getRandomValues(new Uint8Array(1)) % 16)).toString(16)});
	} else {
	console.warn("Navegador não compativel com 'Crypto API'");
	UUID = "xxxxxxxx-xxxx-4xxx-9xxx-xxxxxxxxxxxx".replace(/x/g, () => {return Number((Math.random() * 16) | 0).toString(16)});
	}
	return UUID
}
Utils.version = "0.0.2-alpha";
Utils.dateCreation = "sexta-feira, 06 de novembro de 2020";
Utils.load = (url,mimetype) => {
	if('fetch' in window){
		fetch(url).then(url=>{
			switch (mimetype){
				case 'text':
					return url.text();
					break;
				case 'blob':
					return url.blob();
					break;
				default:
					return null;
			}
		}).then(url=>{
			_info = url;
			return url
		}).catch (err=>{console.log("erro",err)});
	}
}
Utils.img = document.querySelectorAll('img[data-src]');
Utils.imgLoad = image=>{
	image.setAttribute("src",image.getAttribute("data-src"));
	image.onload = ()=>{
		image.removeAttribute("data-src");
	}
}
document.querySelector(".icon").addEventListener("click",function(){
	let a = document.querySelector("nav");
	if(a.className == ""){
		a.className = "active"
	} else {
		a.className = "";
	}
});
if ("IntersectionObserver" in window) {
	var observer = new IntersectionObserver(function(items, observer){
		items.forEach(function(item){
			if(item.isIntersecting){
				Utils.imgLoad(item.target);
				observer.unobserve(item.target);
			}
		});
	});
	Utils.img.forEach(function(img){
		observer.observe(img);
	});
} else {
	Utils.img.forEach(function(img){
		Utils.imgLoad(img);
	});
}
function conteudo() {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () =>{
		if(xhr.readyState == "4" && xhr.status == "200"){
			const rsp = JSON.parse(xhr.responseText);
			for(var i=0; i < rsp.banner.length; i++){
				let conte = document.createElement("div");
				conte.className = "container";
				document.querySelector("#banner").appendChild(conte);
				let sli = document.createElement("img");
				sli.className = "slide";
				sli.src = rsp.banner[i].urlImg;
				document.querySelectorAll(".container")[i].appendChild(sli);
				let legen = document.createElement("div");
				legen.className = "legen";
				document.querySelectorAll(".container")[i].appendChild(legen);
				let legenda = document.createTextNode(rsp.banner[i].lege);
				document.querySelectorAll(".legen")[i].append(legenda);
			}
			for(var y=0; y < rsp.Materia.length; y++){
				let templa = "<article><h2>#titu</h2><p>#pa</p><footer>#author<time>#time</time></footer></article>";
				document.querySelector("main").innerHTML += templa.replace(/#titu/, rsp.Materia[y].Titulo)
				.replace(/#pa/, rsp.Materia[y].artigo)
				.replace(/#author/,rsp.Materia[y].author)
				.replace(/#time/,rsp.Materia[y].Publicacao);
			}
		}
	}
	xhr.open('GET', "/script/material.json");
	xhr.send();
}
function slides() {
	const slide = document.querySelectorAll(".container");
	for (var i = 0; i < slide.length; i++){
		slide[i].style.display = "none";
	}
	_count++;
	if(_count > slide.length){_count = 1;}
	slide[(_count - 1)].style.display = "block";
	setTimeout(slides, 4000);
}
if(document.getElementsByClassName("btnIns")){
	let deathed;
	let btn = document.getElementsByClassName("btnIns")[0]
	btn.style.display = "none";
	window.addEventListener('beforeinstallprompt', e=>{
		e.preventDefault();
		deathed = e;
		btn.style.display = "block";
		btn.addEventListener("click", ()=>{
			btn.style.display = "none";
			deathed.prompt();
			deathed.userChoice.then(choice=>{
				if (choice === "accepted") {
					console.log('aceito');
				}else{
					console.log('negado');
				}
				deathed = null;
			});
		});
	});
}
(function(){conteudo();})();
setTimeout(slides,1000);