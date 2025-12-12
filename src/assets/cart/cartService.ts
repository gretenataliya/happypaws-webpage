import type { Product } from "../models/Product";

export type CartItem = Product & {
  quantity: number;
};

const CART_KEY = "happyPawsCart";

/* Hämta cart */
export function getCart(): CartItem[] {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

/* Spara cart */
function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* Lägg till produkt */
export function addToCart(product: Product) {
  const cart = getCart();

  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart(cart);
  updateCartCount();
}

/* Uppdatera cart-badge */
export function updateCartCount() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.textContent = totalQty.toString();
  }
}
