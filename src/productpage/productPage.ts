import ".././main.scss";
import "../productpage/productPageStyle.scss";
import { products } from "../assets/products";
import { renderProducts } from "./productServices";
import { updateCartCount } from "../assets/cart/cartService";

type Category = "all" | "eat" | "sleep" | "walk" | "play";

let activeCategory: Category = "all";
let searchTerm = "";

/* 🔹 CENTRAL FILTER FUNCTION */
function getFilteredProducts() {
  let result = [...products];

  // Category filter
  if (activeCategory !== "all") {
    result = result.filter(
      (product) => product.category === activeCategory
    );
  }

  // Search filter
  if (searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase();
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
    );
  }

  return result;
}

/* 🔹 ONLY place renderProducts is called */
function applyFilters() {
  const filtered = getFilteredProducts();
  renderProducts(filtered);
}

/* 🔹 Category buttons */
function initCategoryButtons() {
  document.getElementById("allBtn")?.addEventListener("click", () => {
    activeCategory = "all";
    applyFilters();
  });

  document.getElementById("eatBtn")?.addEventListener("click", () => {
    activeCategory = "eat";
    applyFilters();
  });

  document.getElementById("sleepBtn")?.addEventListener("click", () => {
    activeCategory = "sleep";
    applyFilters();
  });

  document.getElementById("walkBtn")?.addEventListener("click", () => {
    activeCategory = "walk";
    applyFilters();
  });

  document.getElementById("playBtn")?.addEventListener("click", () => {
    activeCategory = "play";
    applyFilters();
  });
}

/* 🔹 Search */
function initSearch() {
  const input = document.getElementById(
    "productSearchInput"
  ) as HTMLInputElement | null;

  if (!input) {
    console.warn("Search input not found");
    return;
  }

  input.addEventListener("input", () => {
    searchTerm = input.value;
    applyFilters();
  });
}

/* 🔹 INIT */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initCategoryButtons();
  initSearch();
  applyFilters(); // FIRST render
});
