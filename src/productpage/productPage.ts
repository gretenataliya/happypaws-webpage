import { products } from "../assets/products";
import { renderProducts } from "./productServices";
import "./productPageStyle.scss";
import ".././main.scss";

//-----Category Buttons---------------------------------------------------

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

//---------------------------------------------------------------------------
//---KNAPP FÖR SORTERING:

//---------------------------------------------------------------------------

renderProducts(products);

//---------------------------------------------------------------------------
