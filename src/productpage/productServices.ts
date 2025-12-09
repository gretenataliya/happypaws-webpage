import type { Product } from "../models/product";

// ------Visa produkter på product page:-------------------------------------
export function renderProducts(products: Product[]) {
  const productContainer = document.getElementById("productContainer");

  if (productContainer) {
    productContainer.innerHTML = "";
    products.forEach((product) => {
      const card = document.createElement("div");
      const name = document.createElement("h3");
      const price = document.createElement("h4");
      const imgContainer = document.createElement("div");
      const img = document.createElement("img");

      name.innerHTML = product.name;
      price.innerHTML = product.price.toString() + " SEK";
      img.src = product.img;
      img.className = "productImg";
      card.className = "productCard";
      imgContainer.className = "imgContainer";

      imgContainer.appendChild(img);
      card.appendChild(imgContainer);
      card.appendChild(name);
      card.appendChild(price);
      productContainer.appendChild(card);

      card.addEventListener("click", () => {
        const modal = document.getElementById("modal");
        if (modal) {
          (modal as HTMLDialogElement).showModal();
          createModal(product); // <--- Vart ska den ligga? Kan inte vara i loopen
        }
      });
    });
  }
}

// ------Visa modal på product page:-------------------------------------
const createModal = (product: Product) => {
  const modalBody = document.getElementById("modalBody");

  if (modalBody) {
    modalBody.innerHTML = ""; //  <--- Detta gör så bara sista produkten visas, varför??
    const imgContainer = document.createElement("div");
    const img = document.createElement("img");
    const textDiv = document.createElement("div");
    const name = document.createElement("h3");
    const description = document.createElement("p");
    const price = document.createElement("h4");

    name.innerHTML = product.name;
    price.innerHTML = product.price.toString() + " SEK";
    description.innerHTML = product.description;
    img.src = product.img;
    img.className = "modalImg";

    imgContainer.appendChild(img);
    textDiv.appendChild(name);
    textDiv.appendChild(description);
    textDiv.appendChild(price);
    modalBody.appendChild(imgContainer);
    modalBody.appendChild(textDiv);
  }
};

document.getElementById("closeModalBtn")?.addEventListener("click", () => {
  const modal = document.getElementById("modal");
  if (modal) {
    (modal as HTMLDialogElement).close();
  }
});
