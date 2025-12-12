import "../../main.scss";
import "./cart.scss";

import { getCart, updateCartCount } from "../cart/cartService";
import type { CartItem } from "../cart/cartService";

const CART_KEY = "happyPawsCart";

const cartContainer = document.getElementById("cartItems") as HTMLElement | null;
const totalPriceElement = document.getElementById("totalPrice") as HTMLElement | null;
const totalItemsElement = document.getElementById("totalItems") as HTMLElement | null;

const clearCartBtn = document.getElementById("clearCartBtn") as HTMLButtonElement | null;
const checkoutBtn = document.getElementById("checkoutBtn") as HTMLButtonElement | null;

function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function getTotals(cart: CartItem[]): { totalItems: number; totalPrice: number } {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
}

function removeFromCart(id: string): void {
  const nextCart = getCart().filter((item) => item.id !== id);
  saveCart(nextCart);
  renderCart();
}

function updateQuantity(id: string, delta: number): void {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.quantity += delta;

  const nextCart = item.quantity <= 0 ? cart.filter((i) => i.id !== id) : cart;
  saveCart(nextCart);
  renderCart();
}

function clearCart(): void {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Cart is already empty.");
    return;
  }

  const confirmClear = confirm("Are you sure you want to clear the cart?");
  if (!confirmClear) return;

  saveCart([]);
  renderCart();
}

function renderCart(): void {
  if (!cartContainer || !totalItemsElement || !totalPriceElement) return;

  const cart = getCart();
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
    totalItemsElement.textContent = "0";
    totalPriceElement.textContent = "0 kr";

    if (clearCartBtn) clearCartBtn.disabled = true;
    if (checkoutBtn) checkoutBtn.disabled = true;

    updateCartCount();
    return;
  }

  if (clearCartBtn) clearCartBtn.disabled = false;
  if (checkoutBtn) checkoutBtn.disabled = false;

  cart.forEach((item) => {
    const article = document.createElement("article");
    article.className = "cart-item";
    article.dataset.id = item.id;

    // item.img finns i Product (din products-lista använder "img")
    const imageUrl = item.image ?? "/placeholder.jpg";

    article.innerHTML = `
      <img
        src="${imageUrl}"
        alt="${item.name}"
        class="cart-item__image"
      />
      <div class="cart-item__info">
        <h3 class="cart-item__name">${item.name}</h3>
        <p class="cart-item__price">${item.price} kr</p>

        <div class="cart-item__controls">
          <button class="cart-item__qty-btn" data-action="decrease" data-id="${item.id}">-</button>
          <span class="cart-item__qty">${item.quantity}</span>
          <button class="cart-item__qty-btn" data-action="increase" data-id="${item.id}">+</button>

          <button class="cart-item__remove" data-action="remove" data-id="${item.id}">
            Remove
          </button>
        </div>
      </div>
    `;

    cartContainer.appendChild(article);
  });

  const { totalItems, totalPrice } = getTotals(cart);
  totalItemsElement.textContent = totalItems.toString();
  totalPriceElement.textContent = `${totalPrice} kr`;

  updateCartCount();
}

// Event delegation för knappar i cart-items
if (cartContainer) {
  cartContainer.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const action = target.dataset.action;
    const id = target.dataset.id;

    if (!action || !id) return;

    if (action === "increase") updateQuantity(id, 1);
    if (action === "decrease") updateQuantity(id, -1);
    if (action === "remove") removeFromCart(id);
  });
}

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => clearCart());
}

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    window.location.href = "checkout.html";
  });
}

// Initial render
renderCart();
updateCartCount();
