import { products } from "../assets/products";

// Visa produkter på product page:
const renderProducts = () => {
  const productContainer = document.getElementById("productContainer");

  if (productContainer) {
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
};
renderProducts();
//-------------------------------------------------------------
