import "./style.css";
import { products } from "./assets/products";

// Testkod:
const test = () => {
  const app = document.getElementById("app");

  if (app) {
    products.forEach((product) => {
      const container = document.createElement("div");
      const name = document.createElement("h2");
      const imgContainer = document.createElement("div");
      const img = document.createElement("img");

      name.innerHTML = product.name;
      img.src = product.img;

      container.appendChild(name);
      imgContainer.appendChild(img);
      container.appendChild(imgContainer);
      app.appendChild(container);
    });
  }
};

test();
