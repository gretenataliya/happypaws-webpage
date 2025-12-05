import { products } from "./assets/products";

let catSleep = products.filter((product) => product.category == "sleep");
console.log(catSleep);
