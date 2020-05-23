"use strict";

let makeElement = function (tagName, className, link) {
	let element = document.createElement(tagName);
	element.classList.add(className);
	element.src = link;
	return element;
};

let mainBlock = document.querySelector(".main-block");
const MENU = document.getElementById("main-nav");
let gallery = makeElement("div","gallery");

mainBlock.appendChild(gallery);

// ? подсветка кнопок меню

MENU.addEventListener("click", (event) => {
	MENU.querySelectorAll("a").forEach((el) =>
		el.classList.remove("main-nav__link--active")
	);
	event.target.classList.add("main-nav__link--active");
});








// var link = document.createElement(a);
// link.href = "http://...com";

// var im = document.createElement("img");
// link.appendChild(im);
