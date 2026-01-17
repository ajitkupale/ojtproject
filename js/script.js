/* --------------------------------
IMPORT
-fetchmenudata:fetch menu data from data source(API/JSON)
-rendermenu :renders menu items dynamically into the DOM
------------------------------------*/


import { fetchMenuData } from "./dataService.js";
import { renderMenu } from "./renderMenu.js";

/*----------------------------
 GLOBAL STATE (SINGLE SOURCE OF TRUTH)
 ---------------------------------*/

// stores all menu items fetched from data source
let menuItems=[];

// track currentaly selected category
let activeCategory="all";

// shopping cart data(persisted using localstorage)
// lrt cart  JSON


/*-----------------------
 DOM ELEMENT REFERENCES
 ------------------------*/

//  menu items container
const menuContainer=document.getElementById("menuContainer");

// category filter buttons
const filterButtons = document.querySelectorAll(".filter-btn");

// mobile navigation toggle button
const mobileToggle = document.querySelector(".mobile-nav-toggle");

// navigation link list
const navList = document.querySelector(".nav-list");

// search input field
const searchInput = document.getElementById("searchInput");


/*---------------------------------------
 1.MOBILE NAVIGATION TOGGLE
 -toggle mobile menu visibility
 -switches icon betwwen hamburger and close
 ----------------------------------*/

 mobileToggle.addEventListener("click",()=>{
    // toggle navigation visibility
    navList.classList.toggle("active");

    // change icon state
    const icon = mobileToggle.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-times");
 });


 /*==============================
  2. INITIALIZE MENU
  - fetch menu data on page load
  - render menu items
  - triggers animations
  ===========================*/

  async function init(){
    try{
        // fetch menu data
        menuItems = await fetchMenuData();

        // render menu if data exists
        if(menuItems.length){
            renderMenu(menuItems,menuContainer);
            animateCards();
        }
    } catch(error){
        // log error if fetch fails
        console.error("failed to load menu",error);
    }
  }

  /*====================================
   3.SEARCH + CATEGORY FILTER (COMBINED LOGIC)

   ======================================*/

   function applyFilters(){
        // convert search text to lowercase
        const searchTerm = searchInput.value.toLowerCase();

        // filter menu items based on category and search term
        const filteredItems = menuItems.filter(item => {
            const matchesCategory =
                activeCategory === "all" || item.category === activeCategory;

            const matchesCategory =
                item.name.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm);

            return matchesCategory && matchesSearch;


        });

        // render filterd menu
        renderMenu(filteredItems,menuContainer);
        animateCards();
   }

   /*=========================
   4  CATEGORY FILTER BUTTONS

   =======================*/

   filterButtons.forEach(btn =>{
        btn.addEventListener("click",()=>{

            // remove active class from all buttons
            filterButtons.forEach(b=>b.classList.remove("active"));

            // add active class to clicked button
            btn.classList.add("active");

            // update selected category
            activeCategory = btn.dataset.category;

            // apply filters
            applyFilters();
        });
   });


 /*=========================
 5 SREACH INPUT HANDLER

   =======================*/


// apply filters on every keystroke
searchInput.addEventListener("input",applyFilters);



 /*=========================
 6 MENU CARD ANIMATION
 -adds staggerd fade-in effect

=======================*/

function animateCards(){
    const cards = document.querySelectorAll(".menu-card");

    cards.forEach((card,index)=>{
        // reset animation
        cards.classList.remove("fade-in");

        // apply animation with delay

    })
  }


  /* =========================================================
   DOM CONTENT LOADED
   ========================================================= */
// Initialize application once DOM is ready
document.addEventListener("DOMContentLoaded", init);
