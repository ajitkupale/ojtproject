/* =========================================================
   IMPORTS
   - fetchMenuData : Fetches menu data from data source (API / JSON)
   - renderMenu   : Renders menu items dynamically into the DOM
   ========================================================= */
import { fetchMenuData } from "./dataService.js";
import { renderMenu } from "./renderMenu.js";

/* =========================================================
   GLOBAL STATE (SINGLE SOURCE OF TRUTH)
   ========================================================= */
// Stores all menu items fetched from data source
let menuItems = [];

// Tracks currently selected category
let activeCategory = "all";

// Price of the currently selected item in order modal
let currentItemPrice = 0; 

// Tracks if order modal was closed manually
 let isManualScroll = false;

// Shopping cart data (persisted using localStorage)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// MOBILE SAFETY: Disable reveal animations on small screens
if (window.innerWidth <= 768) {
  document.querySelectorAll(".reveal").forEach(el => {
    el.classList.add("reveal-active");
  });
} else {
  // For desktop, add reveal-active to all reveal elements to show them immediately
  document.querySelectorAll(".reveal").forEach(el => {
    el.classList.add("reveal-active");
  });
}

/* =========================================================
   DOM ELEMENT REFERENCES
   ========================================================= */
// Menu items container
const menuContainer = document.getElementById("menuContainer");

// Category filter buttons
const filterButtons = document.querySelectorAll(".filter-btn");

// Mobile navigation toggle button
const mobileToggle = document.querySelector(".mobile-nav-toggle");

// Navigation links list
const navList = document.querySelector(".nav-list");

// Search input field
const searchInput = document.getElementById("searchInput");

// Book table button in navbar
const bookTableBtn = document.querySelector(".nav-actions .primary");

// Book table modal elements
const bookTableModal = document.getElementById("bookTableModal");
const closeBookTable = document.getElementById("closeBookTable");

// Order modal elements
const orderModal = document.getElementById("orderModal");
const closeOrder = document.getElementById("closeOrder");
const orderItemName = document.getElementById("orderItemName");
const orderItemPrice = document.getElementById("orderItemPrice");

// Quantity controls
const qtyInput = document.getElementById("orderQty");
const incBtn = document.getElementById("increaseQty");
const decBtn = document.getElementById("decreaseQty");

// Active navbar section-wise
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

// Designer modal elements
const designerModal = document.getElementById("designerModal");
const closeDesignerModal = document.getElementById("closeDesignerModal");

// Cart count badge
const cartCountEl = document.getElementById("cartCount");

// Cart modal elements
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// Cart icon
const cartIcon = document.querySelector(".cart-icon");

/* =========================================================
   ADD TO CART BUTTON
   ========================================================= */

// Add to cart button inside order modal
const addToCartBtn = document.querySelector("#orderModal .btn.primary");

/* =========================================================
   1. MOBILE NAVIGATION TOGGLE
   - Toggles mobile menu visibility
   - Switches icon between hamburger and close
   ========================================================= */
mobileToggle.addEventListener("click", () => {
    // Toggle navigation visibility
    navList.classList.toggle("active");

    // Change icon state
    const icon = mobileToggle.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-times");
});

/* =========================================================
   2. INITIALIZE MENU
   - Fetches menu data on page load
   - Renders menu items
   - Triggers animations
   ========================================================= */
async function init() {
    try {
        // Fetch menu data
        menuItems = await fetchMenuData();

        // Render menu if data exists
        if (menuItems.length) {
            renderMenu(menuItems, menuContainer);
            animateCards();
        }
    } catch (error) {
        // Log error if fetch fails
        console.error("Failed to load menu", error);
    }
}

/* =========================================================
   3. SEARCH + CATEGORY FILTER (COMBINED LOGIC)
   ========================================================= */
function applyFilters() {
    // Convert search text to lowercase
    const searchTerm = searchInput.value.toLowerCase();

    // Filter menu items based on category & search term
    const filteredItems = menuItems.filter(item => {
        const matchesCategory =
            activeCategory === "all" || item.category.toLowerCase() === activeCategory;

        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    // Render filtered menu
    renderMenu(filteredItems, menuContainer);
    animateCards();
}

/* =========================================================
   4. CATEGORY FILTER BUTTONS
   ========================================================= */
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove("active"));

        // Add active class to clicked button
        btn.classList.add("active");

        // Update selected category
        activeCategory = btn.dataset.category;

        // Apply filters
        applyFilters();
    });
});

/* =========================================================
   5. SEARCH INPUT HANDLER
   ========================================================= */
// Apply filters on every keystroke
searchInput.addEventListener("input", applyFilters);

/* =========================================================
   MENU CARD ANIMATION
   - Adds staggered fade-in effect
   ========================================================= */
function animateCards() {
    const cards = document.querySelectorAll(".menu-card");

    cards.forEach((card, index) => {
        // Reset animation
        card.classList.remove("fade-in");

        // Apply animation with delay
        setTimeout(() => {
            card.classList.add("fade-in");
        }, index * 100);
    });
}

/* =========================================================
   SMOOTH SCROLL FOR NAVIGATION LINKS
   ========================================================= */
document.querySelectorAll(".nav-link").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        // Get target section
        const target = document.querySelector(this.getAttribute("href"));
        if (!target) return;

        // Smooth scroll with offset for fixed header
        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: "smooth"
        });

        // Close mobile menu after navigation
        navList.classList.remove("active");
    });
})

/* =========================================================
   BOOK TABLE MODAL HANDLERS
   ========================================================= */
bookTableBtn.addEventListener("click", (e) => {
  e.preventDefault();
//   bookTableModal.style.display = "flex";
    bookTableModal.classList.add("active");
});

// Close book table modal
closeBookTable.addEventListener("click", () => {
//   bookTableModal.style.display = "none";
    bookTableModal.classList.remove("active");
});

// Close modal when clicking outside content
window.addEventListener("click", (e) => {
  if (e.target === bookTableModal) {
    // bookTableModal.style.display = "none";
    bookTableModal.classList.remove("active");
  }
});

/* =========================================================
   ORDER MODAL HANDLERS
   ========================================================= */

//    Open order modal
   document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-order");
  if (!btn) return;

  currentItemPrice = Number(btn.dataset.price);

  orderItemName.textContent = btn.dataset.name;
  orderItemName.dataset.id = btn.dataset.id; // Add item ID to modal
//   orderItemPrice.textContent = ₹${btn.dataset.price};
  qtyInput.value = 1;

  orderItemPrice.textContent = `₹${currentItemPrice}`;

  //orderModal.style.display = "flex";
  orderModal.classList.add("active");

});

// Close order modal

closeOrder.addEventListener("click", () => {
// orderModal.style.display = "none";
  orderModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === orderModal) {
    orderModal.classList.remove("active");
  }
});

    /* helper function for ordr modal */
    function updateTotalPrice() {
      const quantity = Number(qtyInput.value);
      const totalPrice = currentItemPrice * quantity;
      orderItemPrice.textContent = `₹${totalPrice}`;
    }

    incBtn.addEventListener("click",() => {
        qtyInput.value = +qtyInput.value + 1;
        updateTotalPrice();
    });

    decBtn.addEventListener("click",() => {
      if (qtyInput.value > 1) {
        qtyInput.value = +qtyInput.value - 1;
        updateTotalPrice();
      }
    });

    // Add to cart button event listener
    addToCartBtn.addEventListener("click", () => {
        const itemId = Number(orderItemName.dataset.id); // Assuming we add data-id to orderItemName
        const name = orderItemName.textContent;
        const price = currentItemPrice;
        const quantity = Number(qtyInput.value);

        addToCart(itemId, name, price, quantity);
    });

/* =========================================================
   DESIGNER MODAL HANDLERS
   ========================================================= */
// Close designer modal
closeDesignerModal.addEventListener("click", () => {
  designerModal.classList.remove("active");
  localStorage.setItem("designerIntroSeen", "true");
});

// Close modal when clicking outside content
window.addEventListener("click", (e) => {
  if (e.target === designerModal) {
    designerModal.classList.remove("active");
    localStorage.setItem("designerIntroSeen", "true");
  }
});

/* =========================================================
   SCROLL REVEAL ANIMATION
   ========================================================= */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach(section => {
  revealObserver.observe(section);
});


/* =========================================================
   ACTIVE NAV LINK ON SCROLL
   ========================================================= */
// const sections = document.querySelectorAll("section[id]");
// const navLinks = document.querySelectorAll(".nav-link");

const navObserver = new IntersectionObserver(entries => {
  if (isManualScroll) return;

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${entry.target.id}`) {
          link.classList.add("active");
        }
      });
    }
  });
}, {
  rootMargin: "-90px 0px -60% 0px",
  threshold: 0
});

sections.forEach(section => navObserver.observe(section));




/* =========================================================
   CART FUNCTIONALITY
   ========================================================= */

// Add item to cart
function addToCart(itemId, name, price, quantity) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        // Update quantity if item exists
        existingItem.quantity += quantity;
    } else {
        // Add new item to cart
        cart.push({
            id: itemId,
            name: name,
            price: price,
            quantity: quantity
        });
    }

    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count display
    updateCartCount();

    // Close order modal
    orderModal.classList.remove("active");

    // Optional: Show success message
    alert(`${name} added to cart!`);
}

// Update cart count badge
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
        cartCountEl.style.display = totalItems > 0 ? "block" : "none";
    }
}

// Render cart items in modal
function renderCart() {
    cartItemsEl.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
        cartTotalEl.textContent = "₹0";
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price} x ${item.quantity} = ₹${itemTotal}</p>
            </div>
            <button class="remove-btn" data-id="${item.id}">Remove</button>
        `;
        cartItemsEl.appendChild(itemEl);
    });

    cartTotalEl.textContent = `₹${total}`;

    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const itemId = Number(e.target.dataset.id);
            removeItem(itemId);
        });
    });
}

// Remove item from cart
function removeItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

/* =========================================================
   DOM CONTENT LOADED
   ========================================================= */
// Initialize application once DOM is ready
document.addEventListener("DOMContentLoaded", () => {

  //show designer intro modal only once
  const hasVisited = localStorage.getItem("designerIntroSeen");

  if (!hasVisited) {
    //designerModal.style.display = "flex";
    designerModal.classList.add("active");
   // localStorage.setItem("designerIntroSeen", "true");
  }

  // Initialize cart count on load
  updateCartCount();

  init();//Initialize menu and filters
});
