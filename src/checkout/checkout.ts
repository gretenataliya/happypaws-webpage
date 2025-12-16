import '../main.scss';
import './checkout.scss';
import { getCart, updateCartCount } from "../cart/cartService";
import type { CartItem } from "../cart/cartService";

const CART_KEY = "happyPawsCart";

function getTotals(cart: CartItem[]): { totalItems: number; totalPrice: number } {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
}

function renderSummary(): void {
  const itemsSpan = document.getElementById("checkoutItems") as HTMLElement | null;
  const totalSpan = document.getElementById("checkoutTotal") as HTMLElement | null;
  const listDiv = document.getElementById("checkoutList") as HTMLElement | null;

  const cart = getCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (itemsSpan) itemsSpan.textContent = totalItems.toString();
  if (totalSpan) totalSpan.textContent = `${totalPrice} kr`;

  // Render product list
  if (listDiv) {
    if (cart.length === 0) {
      listDiv.innerHTML = `<p class="checkout-empty">Your cart is empty.</p>`;
    } else {
      listDiv.innerHTML = cart
        .map((item) => {
          const imgUrl = item.image ?? "/placeholder.jpg";
          const lineTotal = item.price * item.quantity;

          return `
            <div class="checkout-item">
              <img class="checkout-item__img" src="${imgUrl}" alt="${item.name}" />
              <div class="checkout-item__info">
                <div class="checkout-item__name">${item.name}</div>
                <div class="checkout-item_meta">${item.quantity} x ${item.price} kr</div>
              </div>
              <div class="checkout-item__total">${lineTotal} kr</div>
            </div>
          `;
        })
        .join("");
    }
  }

  // Updates cart count badge
  updateCartCount();
}

function showCheckoutPopup(name: string, totalItems: number, totalPrice: number): void {
  const overlay = document.createElement("div");
  overlay.className = "checkout-popup-overlay";

  overlay.innerHTML = `
    <div class="checkout-popup">
      <div class="checkout-popup__paw">🐾</div>
      <h2>Order confirmed!</h2>
      <p>Thank you, ${name}.</p>
      <p class="checkout-popup__summary">
        ${totalItems} item(s) on the way - total <strong>${totalPrice} kr</strong>.
      </p>
      <p class="checkout-popup__tiny">
        Tail wags are being prepared… 💌
      </p>
      <div class="checkout-popup__buttons">
        <button class="checkout-popup__btn checkout-popup__btn--primary" data-action="home">
          Back to home
        </button>
        <button class="checkout-popup__btn checkout-popup__btn--secondary" data-action="close">
          Stay on this page
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const buttons = overlay.querySelectorAll<HTMLButtonElement>(".checkout-popup__btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;

      if (action === "home") {
        window.location.href = "index.html";
        return;
      }

      document.body.removeChild(overlay);
    });
  });
}

function initCheckout(): void {
  // Set badge immediately when the page loads
  updateCartCount();

  // Render totals immediately
  renderSummary();

  const form = document.getElementById("checkoutForm") as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const cart = getCart();
    const { totalItems, totalPrice } = getTotals(cart);

    if (cart.length === 0 || totalItems === 0) {
      alert("Your cart is empty. Please add some products before checkout.");
      return;
    }

    const nameInput = document.getElementById("name") as HTMLInputElement | null;
    const name = (nameInput?.value.trim() || "friend").split(" ")[0];

    // Empty cart
    localStorage.removeItem(CART_KEY);

    // Update UI
    renderSummary();

    // Reset form
    form.reset();

    // Popup
    showCheckoutPopup(name, totalItems, totalPrice);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCheckout();
});

