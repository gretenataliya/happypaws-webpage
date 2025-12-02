import "./style.css";
import { products } from "./assets/products";

// Testkod:
const renderTopSellers = () => {
  const topSellerContainer = document.getElementById("topSellerContainer");

  if (topSellerContainer) {
    products.forEach((product) => {
      if (product.isTopSeller === true) {
        const card = document.createElement("div");
        const name = document.createElement("h2");
        const imgContainer = document.createElement("div");
        const img = document.createElement("img");

        name.innerHTML = product.name;
        img.src = product.img;
        card.className = "topSellerCard";
        imgContainer.className = "imgContainer";

        card.appendChild(name);
        imgContainer.appendChild(img);
        card.appendChild(imgContainer);
        topSellerContainer.appendChild(card);
      }
    });
  }
};

renderTopSellers();
