import "../main.scss";
import "./productPageStyle.scss";

import { products } from "../assets/products";
import { renderProducts } from "./productServices";
import { updateCartCount } from "../assets/cart/cartService";

type Category = "all" | "eat" | "sleep" | "walk" | "play";

let activeCategory: Category = "all";
let searchTerm = "";

// ---------- Helpers ----------
function getCategoryFromUrl(): Category | null {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("category")?.toLowerCase();

  const allowed: Category[] = ["all", "eat", "sleep", "walk", "play"];
  if (!cat) return null;
  if (allowed.includes(cat as Category)) return cat as Category;

  return null;
}

function updateUrlCategory(category: Category) {
  const url = new URL(window.location.href);
  url.searchParams.set("category", category);
  window.history.replaceState({}, "", url.toString());
}

function setActiveCategoryButton(category: Category) {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".catBtn");
  buttons.forEach((btn) => {
    const btnCat = (btn.dataset.category || "") as Category;
    btn.classList.toggle("is-active", btnCat === category);
  });
}

// ---------- Filtering ----------
function getFilteredProducts() {
  let result = [...products];

  if (activeCategory !== "all") {
    result = result.filter((p) => p.category === activeCategory);
  }

  if (searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description ?? "").toLowerCase().includes(term)
    );
  }

  return result;
}

function applyFilters() {
  renderProducts(getFilteredProducts());
}

// ---------- Init buttons ----------
function initCategoryButtons() {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".catBtn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = (btn.dataset.category || "all") as Category;

      activeCategory = category;
      setActiveCategoryButton(category);
      updateUrlCategory(category);

      applyFilters();
    });
  });
}

// ---------- Init search ----------
function initSearch() {
  const input = document.getElementById(
    "productSearchInput"
  ) as HTMLInputElement | null;

  if (!input) return;

  input.addEventListener("input", () => {
    searchTerm = input.value;
    applyFilters();
  });
}

// ---------- Init from URL ----------
function initCategoryFromUrl() {
  const fromUrl = getCategoryFromUrl();
  if (!fromUrl) return;

  activeCategory = fromUrl;
  setActiveCategoryButton(fromUrl);
}

// ---------- DOM Ready ----------
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  initCategoryButtons();
  initSearch();

  initCategoryFromUrl();
  applyFilters();
});
