"use strict";

// Selecting the navbar element
const navbar = document.querySelector("[data-navbar]");
// Selecting all the navbar links
const navbarLinks = document.querySelectorAll("[data-nav-link]");
// Selecting the navbar toggler button
const navbarToggler = document.querySelector("[data-nav-toggler]");

// Adding event listener to the navbar toggler button
navbarToggler.addEventListener("click", function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
});

// Looping through each navbar link
for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function () {
    navbar.classList.remove("active");
    navbarToggler.classList.remove("active");
  });
}
