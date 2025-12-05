import './main.scss';
import { products } from "./assets/products";

// Visa TopSeller-produkter på landing page:
const renderTopSellers = () => {
  const topSellerContainer = document.getElementById("topSellerContainer");

  if (topSellerContainer) {
    products.forEach((product) => {
      if (product.isTopSeller === true) {
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
        topSellerContainer.appendChild(card);
      }
    });
  }
};
renderTopSellers();
//-------------------------------------------------------------
