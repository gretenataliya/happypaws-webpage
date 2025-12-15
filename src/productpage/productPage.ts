import ".././main.scss";
import "../productpage/productPageStyle.scss";

import { products } from "../assets/products";
import { renderProducts } from "./productServices";
import { updateCartCount } from "../cart/cartService";

type Category = "eat" | "sleep" | "walk" | "play";

const ALLOWED_CATEGORIES: Category[] = ["eat", "sleep", "walk", "play"];

let activeCategories = new Set<Category>(); // tom Set = "All Products"
let searchTerm = "";

/* -----------------------------
  Helpers
----------------------------- */

function isCategory(value: string): value is Category {
  return (ALLOWED_CATEGORIES as string[]).includes(value);
}

function normalizeCategory(value: unknown): Category | null {
  const v = String(value ?? "").toLowerCase().trim();
  return isCategory(v) ? v : null;
}

function getFilteredProducts() {
  let result = [...products];

  // Category filter (om activeCategories är tom => visa alla)
  if (activeCategories.size > 0) {
    result = result.filter((p: any) => {
      const cat = normalizeCategory(p.category);
      return cat ? activeCategories.has(cat) : false;
    });
  }

  // Search filter
  const term = searchTerm.trim().toLowerCase();
  if (term !== "") {
    result = result.filter((p: any) => {
      const name = String(p.name ?? "").toLowerCase();
      const desc = String(p.description ?? "").toLowerCase();
      return name.includes(term) || desc.includes(term);
    });
  }

  return result;
}

function applyFilters() {
  renderProducts(getFilteredProducts());
  syncActiveButtonStyles();
  syncUrl();
}

function syncActiveButtonStyles() {
  // Förutsätter att dina knappar har class="catBtn"
  const buttons = document.querySelectorAll<HTMLButtonElement>(".catBtn");

  buttons.forEach((btn) => {
    const raw = btn.dataset.category;
    if (!raw) return;

    const cat = normalizeCategory(raw);

    // All-knappen: aktiv om inga kategorier är valda
    if (raw === "all") {
      btn.classList.toggle("is-active", activeCategories.size === 0);
      return;
    }

    if (!cat) return;
    btn.classList.toggle("is-active", activeCategories.has(cat));
  });
}

function syncUrl() {
  const url = new URL(window.location.href);

  // Spara categories i query string
  if (activeCategories.size === 0) {
    url.searchParams.delete("category");
    url.searchParams.delete("categories");
  } else {
    const list = Array.from(activeCategories).join(",");
    url.searchParams.set("categories", list);
    url.searchParams.delete("category"); // vi kör bara categories när vi har set
  }

  // Spara search i query string (valfritt men nice)
  if (searchTerm.trim() === "") {
    url.searchParams.delete("q");
  } else {
    url.searchParams.set("q", searchTerm.trim());
  }

  window.history.replaceState({}, "", url.toString());
}

function setCategoriesFromUrl() {
  const url = new URL(window.location.href);

  // 1) Multi: ?categories=eat,walk
  const multi = url.searchParams.get("categories");
  if (multi) {
    activeCategories.clear();
    multi
      .split(",")
      .map((x) => x.trim().toLowerCase())
      .forEach((x) => {
        const cat = normalizeCategory(x);
        if (cat) activeCategories.add(cat);
      });
    return;
  }

  // 2) Single: ?category=eat
  const single = url.searchParams.get("category");
  if (single) {
    activeCategories.clear();
    const cat = normalizeCategory(single);
    if (cat) activeCategories.add(cat);
    return;
  }

  // 3) Hash: productPage.html#eat
  const hash = window.location.hash.replace("#", "").trim().toLowerCase();
  if (hash) {
    activeCategories.clear();
    const cat = normalizeCategory(hash);
    if (cat) activeCategories.add(cat);
    return;
  }

  // Inget hittat => All
  activeCategories.clear();
}

function setSearchFromUrl() {
  const url = new URL(window.location.href);
  const q = url.searchParams.get("q");
  if (q) searchTerm = q;

  const input = document.getElementById("productSearchInput") as HTMLInputElement | null;
  if (input) input.value = searchTerm;
}

/* -----------------------------
  Init UI
----------------------------- */

function initCategoryButtons() {
  // Förutsätter:
  // - All Products knapp har data-category="all"
  // - Eat har data-category="eat" osv
  const buttons = document.querySelectorAll<HTMLButtonElement>(".catBtn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const raw = btn.dataset.category;
      if (!raw) return;

      // All Products: rensa set
      if (raw === "all") {
        activeCategories.clear();
        applyFilters();
        return;
      }

      const cat = normalizeCategory(raw);
      if (!cat) return;

      // Toggle kategori (multi-select)
      if (activeCategories.has(cat)) {
        activeCategories.delete(cat);
      } else {
        activeCategories.add(cat);
      }

      applyFilters();
    });
  });
}

function initSearch() {
  const input = document.getElementById("productSearchInput") as HTMLInputElement | null;
  if (!input) return;

  input.addEventListener("input", () => {
    searchTerm = input.value;
    applyFilters();
  });
}

function scrollToFiltersIfNeeded() {
  // Valfritt: scrolla till productSection när man kommer via nav
  // Sätt id="productSection" på din wrapper/sektion
  const hasCategoryIntent =
    new URL(window.location.href).searchParams.has("category") ||
    new URL(window.location.href).searchParams.has("categories") ||
    window.location.hash.length > 1;

  if (!hasCategoryIntent) return;

  const section = document.getElementById("productSection");
  if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* -----------------------------
  Start
----------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  setCategoriesFromUrl();
  setSearchFromUrl();

  initCategoryButtons();
  initSearch();

  applyFilters();
  scrollToFiltersIfNeeded();
});
