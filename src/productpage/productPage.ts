import { products } from "../assets/products";

document.getElementById("allBtn")?.addEventListener("click", () => {
  renderProducts(products);
});

document.getElementById("eatBtn")?.addEventListener("click", () => {
  renderProducts(products.filter((product) => product.category == "eat"));
});

document.getElementById("sleepBtn")?.addEventListener("click", () => {
  renderProducts(products.filter((product) => product.category == "sleep"));
});

document.getElementById("walkBtn")?.addEventListener("click", () => {
  renderProducts(products.filter((product) => product.category == "walk"));
});

document.getElementById("playBtn")?.addEventListener("click", () => {
  renderProducts(products.filter((product) => product.category == "play"));
});

// Visa produkter på product page:
function renderProducts(products) {
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
      card.className = "topSellerCard";
      imgContainer.className = "imgContainer";

      imgContainer.appendChild(img);
      card.appendChild(imgContainer);
      card.appendChild(name);
      card.appendChild(price);
      productContainer.appendChild(card);
    });
  }
}

//-------------------------------------------------------------
