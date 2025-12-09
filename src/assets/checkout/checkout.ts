import '../../main.scss';
import './checkout.scss';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

const CART_KEY = 'happyPawsCart';

function loadCart(): CartItem[] {
  try {
    const data = localStorage.getItem(CART_KEY);
    if (!data) return [];
    return JSON.parse(data) as CartItem[];
  } catch {
    return [];
  }
}

function getTotals(cart: CartItem[]): { totalItems: number; totalPrice: number } {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { totalItems, totalPrice };
}

function updateBadge(totalItems: number): void {
  const cartBadge = document.getElementById('cartCount') as HTMLElement | null;
  if (!cartBadge) return;
  cartBadge.textContent = totalItems.toString();
}

function renderSummary(): void {
  const itemsSpan = document.getElementById('checkoutItems') as HTMLElement | null;
  const totalSpan = document.getElementById('checkoutTotal') as HTMLElement | null;

  const cart = loadCart();
  const { totalItems, totalPrice } = getTotals(cart);

  if (itemsSpan) itemsSpan.textContent = totalItems.toString();
  if (totalSpan) totalSpan.textContent = `${totalPrice} kr`;

  updateBadge(totalItems);
}

function showCheckoutPopup(
  name: string,
  totalItems: number,
  totalPrice: number
): void {
  const overlay = document.createElement('div');
  overlay.className = 'checkout-popup-overlay';

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

  const buttons = overlay.querySelectorAll<HTMLButtonElement>(
    '.checkout-popup__btn'
  );

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'home') {
        window.location.href = 'index.html';
      } else {
        document.body.removeChild(overlay);
      }
    });
  });
}

function initCheckout(): void {
  const form = document.getElementById('checkoutForm') as HTMLFormElement | null;

  // Fyll på med test-data om cart är tom (bara för nu innan merge)
  seedTestCartForDev();

  renderSummary();

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const cart = loadCart();
    const { totalItems, totalPrice } = getTotals(cart);

    if (cart.length === 0 || totalItems === 0) {
      alert('Your cart is empty. Please add some products before checkout.');
      return;
    }

    const nameInput = document.getElementById('name') as HTMLInputElement | null;
    const name = (nameInput?.value.trim() || 'friend').split(' ')[0];

    // töm vagnen
    localStorage.removeItem(CART_KEY);

    // uppdatera UI
    renderSummary();

    // resetta formuläret
    form.reset();

    // visa waggy tail popup
    showCheckoutPopup(name, totalItems, totalPrice);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  initCheckout();
});

function seedTestCartForDev(): void {
  const currentCart = loadCart();
  if (currentCart.length > 0) {
    // Om något redan ligger i cart (senare från product-sidan), gör inget.
    return;
  }

  const testCart: CartItem[] = [
    {
      id: 'test-1',
      name: 'Chewy Test Bone',
      price: 149,
      quantity: 1,
    },
    {
      id: 'test-2',
      name: 'Plush Fox (Test)',
      price: 199,
      quantity: 2,
    },
  ];

  localStorage.setItem(CART_KEY, JSON.stringify(testCart));
}

