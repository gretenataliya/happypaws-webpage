import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "aboutPage.html"),
        contact: resolve(__dirname, "contactPage.html"),
        cart: resolve(__dirname, "cart.html"),
        checkout: resolve(__dirname, "checkout.html"),
        product: resolve(__dirname, "productPage.html"),
      },
    },
  },
});
