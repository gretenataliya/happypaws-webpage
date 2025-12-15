import type { Product } from "../models/Product";

export type CartItem = {
  id: string;           // viktigt: alltid string
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

const CART_KEY = "happyPawsCart";

/* Hämta cart */
export function getCart(): CartItem[] {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? (JSON.parse(cart) as CartItem[]) : [];
}

/* Spara cart */
function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* Skapa ett stabilt unikt id även om product.id saknas */
function getProductKey(product: Product): string {
  const anyP = product as any;

  // 1) använd id om det finns
  if (anyP.id !== undefined && anyP.id !== null) {
    return String(anyP.id);
  }

  // 2) annars bygg en unik nyckel av data som skiljer produkter åt
  // (img är extra viktigt om två produkter kan ha samma namn)
  return `${product.name}|${product.price}|${anyP.img ?? ""}`
    .toLowerCase()
    .trim();
}

/* Lägg till produkt */
export function addToCart(product: Product) {
  const cart = getCart();
  const key = getProductKey(product);

  const existingItem = cart.find((item) => item.id === key);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: key,
      name: product.name,
      price: product.price,
      image: image((product as any).img),
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
  if (cartCount) cartCount.textContent = totalQty.toString();
}

function image(path?: string): string | undefined {
  if (!path) return undefined;

  // om den redan är en full URL eller absolut path, låt vara
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;

  // vanliga Vite-projekt: "src/..." måste bli "/src/..."
  if (path.startsWith("src/")) return `/${path}`;

  // "./src/..." -> "/src/..."
  if (path.startsWith("./src/")) return path.replace("./", "/");

  return path;
}
