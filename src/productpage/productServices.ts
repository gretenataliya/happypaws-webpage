import type { Product } from "../models/Product";
import { addToCart } from "../cart/cartService";

export function renderProducts(list: Product[]) {
  const productContainer = document.getElementById("productContainer");
  if (!productContainer) return;

  productContainer.innerHTML = "";

  if (list.length === 0) {
    productContainer.innerHTML = `<p style="padding:12px;margin:0;">No products found.</p>`;
    return;
  }

  list.forEach((product) => {
    const card = document.createElement("div");
    const name = document.createElement("h3");
    const price = document.createElement("h4");
    const imgContainer = document.createElement("div");
    const img = document.createElement("img");

    name.textContent = product.name;
    price.textContent = `${product.price} SEK`;

    img.src = product.img;
    img.alt = product.name;
    img.className = "productImg";

    card.className = "productCard";
    imgContainer.className = "imgContainer";

    imgContainer.appendChild(img);
    card.appendChild(imgContainer);
    card.appendChild(name);
    card.appendChild(price);

    productContainer.appendChild(card);

    card.addEventListener("click", () => {
      const modal = document.getElementById("modal") as HTMLDialogElement | null;
      if (!modal) return;
      createModal(product);
      modal.showModal();
    });
  });
}

export function createModal(product: Product) {
  const modalBody = document.getElementById("modalBody");
  if (!modalBody) return;

  modalBody.innerHTML = "";

  const img = document.createElement("img");
  img.src = product.img;
  img.alt = product.name;
  img.className = "modalImg";

  const textDiv = document.createElement("div");
  textDiv.className = "textDiv";

  const name = document.createElement("h3");
  name.textContent = product.name;

  const description = document.createElement("p");
  description.textContent = product.description;

  const price = document.createElement("h4");
  price.textContent = `${product.price} SEK`;

  const cartBtn = document.createElement("button");
  cartBtn.className = "cartBtn";
  cartBtn.type = "button";
  cartBtn.textContent = "Add to Cart";

  cartBtn.addEventListener("click", () => {
    addToCart(product);

    const modal = document.getElementById("modal") as HTMLDialogElement | null;
    modal?.close();
  });

  textDiv.appendChild(name);
  textDiv.appendChild(description);
  textDiv.appendChild(price);
  textDiv.appendChild(cartBtn);

  modalBody.appendChild(img);
  modalBody.appendChild(textDiv);

  const closeBtn = document.getElementById("closeModalBtn");
  closeBtn?.addEventListener("click", () => {
    const modal = document.getElementById("modal") as HTMLDialogElement | null;
    modal?.close();
  });
}
