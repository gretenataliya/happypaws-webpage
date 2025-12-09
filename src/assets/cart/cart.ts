import '../../main.scss';   // om du vill ha ALLA globala styles här också
import './cart.scss';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

const CART_KEY = 'happyPawsCart';

const cartContainer = document.getElementById('cartItems') as HTMLElement | null;
const totalPriceElement = document.getElementById('totalPrice') as HTMLElement | null;
const totalItemsElement = document.getElementById('totalItems') as HTMLElement | null;
const clearCartBtn = document.getElementById('clearCartBtn') as HTMLButtonElement | null;
const checkoutBtn = document.getElementById('checkoutBtn') as HTMLButtonElement | null;
const cartBadge = document.getElementById('cartCount') as HTMLElement | null; // om du har bubblan i navbar

function loadCart(): CartItem[] {
  try {
    const data = localStorage.getItem(CART_KEY);
    if (!data) return [];
    return JSON.parse(data) as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge(cart);
}

function getTotals(cart: CartItem[]): { totalItems: number; totalPrice: number } {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
}

// 🔹 GÖR TILL EXPORT + låt cart vara optional
export function updateCartBadge(cartFromOutside?: CartItem[]): void {
  if (!cartBadge) return;

  const cart = cartFromOutside ?? loadCart();
  const { totalItems } = getTotals(cart);
  cartBadge.textContent = totalItems.toString();
}

// 🔹 Ändra signaturen så quantity är optional (så hennes kod funkar)
export function addToCart(newItem: {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity?: number;
}): void {
  const cart = loadCart();
  const existing = cart.find((item) => item.id === newItem.id);

  if (existing) {
    existing.quantity += newItem.quantity ?? 1;
  } else {
    cart.push({
      id: newItem.id,
      name: newItem.name,
      price: newItem.price,
      image: newItem.image,
      quantity: newItem.quantity ?? 1,
    });
  }

  saveCart(cart);
  renderCart();
}

function removeFromCart(id: string): void {
  let cart = loadCart();
  cart = cart.filter((item) => item.id !== id);
  saveCart(cart);
  renderCart();
}

function updateQuantity(id: string, delta: number): void {
  const cart = loadCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    const filtered = cart.filter((i) => i.id !== id);
    saveCart(filtered);
  } else {
    saveCart(cart);
  }

  renderCart();
}

function clearCart(): void {
  const cart = loadCart();
  if (cart.length === 0) {
    alert('Cart is already empty.');
    return;
  }

  const confirmClear = confirm('Are you sure you want to clear the cart?');
  if (!confirmClear) return;

  saveCart([]);
  renderCart();
}

function checkout(): void {
  const cart = loadCart();
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  saveCart([]);
  renderCart();
}

function renderCart(): void {
  if (!cartContainer || !totalItemsElement || !totalPriceElement) return;

  const cart = loadCart();

  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="cart-empty">Din kundvagn är tom.</p>`;
    totalItemsElement.textContent = '0';
    totalPriceElement.textContent = '0 kr';

    if (clearCartBtn) clearCartBtn.disabled = true;
    if (checkoutBtn) checkoutBtn.disabled = true;

    return;
  }

  if (clearCartBtn) clearCartBtn.disabled = false;
  if (checkoutBtn) checkoutBtn.disabled = false;

  cart.forEach((item) => {
    const article = document.createElement('article');
    article.className = 'cart-item';
    article.dataset.id = item.id;

    article.innerHTML = `
      <img
        src="${item.image ?? '/placeholder.jpg'}"
        alt="${item.name}"
        class="cart-item__image"
      />
      <div class="cart-item__info">
        <h3 class="cart-item__name">${item.name}</h3>
        <p class="cart-item__price">${item.price} kr</p>
        <div class="cart-item__controls">
          <button class="cart-item__qty-btn" data-action="decrease" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="cart-item__qty-btn" data-action="increase" data-id="${item.id}">+</button>
          <button class="cart-item__remove" data-action="remove" data-id="${item.id}">Ta bort</button>
        </div>
      </div>
    `;

    cartContainer.appendChild(article);
  });

  const { totalItems, totalPrice } = getTotals(cart);
  totalItemsElement.textContent = totalItems.toString();
  totalPriceElement.textContent = `${totalPrice} kr`;
  updateCartBadge(cart);
}

if (cartContainer) {
  cartContainer.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;

    if (action === 'increase') {
      updateQuantity(id, 1);
    } else if (action === 'decrease') {
      updateQuantity(id, -1);
    } else if (action === 'remove') {
      removeFromCart(id);
    }
  });
}

if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    clearCart();
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    checkout();
  });
}

renderCart();


// Om du vill kunna anropa från andra TS-filer
// exempel: import { addToCart } i produktlistan

// 🚧 Bara för test – ta bort sen
// importera inget här, bara klistra in längst ner i cart.ts

// Testa att lägga till en produkt automatiskt
// så du ser att sidan renderar allt rätt
// Kommentera bort detta när du är klar med testet.
addToCart({
  id: 'test-1',
  name: 'Test-leksak',
  price: 199,
  image: '/img/test-toy.jpg'
});
