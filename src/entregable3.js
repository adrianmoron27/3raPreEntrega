import fs from "fs"

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async init() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch {
      this.products = [];
    }
  }

  async addProduct(product) {
    if (!product.title || !product.descripcion || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.log('Todos los campos deben estar completos');
      return;
    }

    if (this.products.some(existingProduct => existingProduct.code === product.code)) {
      console.log('Ya existe un producto con el mismo código.');
      return;
    }

    product.id = this.getNextId();
    this.products.push(product);
    await this.saveProductsToFile();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(existingProduct => existingProduct.id === id);
    if (product) {
      return product;
    } else {
      console.log('El producto con el ID especificado no existe');
      return null;
    }
  }

  async updateProduct(id, updatedProduct) {
    const index = this.products.findIndex(existingProduct => existingProduct.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      await this.saveProductsToFile();
    } else {
      console.log('El producto con el ID especificado no existe');
    }
  }

  async deleteProduct(id) {
    const index = this.products.findIndex(existingProduct => existingProduct.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      await this.saveProductsToFile();
    } else {
      console.log('El producto con el ID especificado no existe');
    }
  }

  getNextId() {
    const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
  }

  async saveProductsToFile() {
    const productsJSON = JSON.stringify(this.products, null, 2);
    try {
      await fs.promises.writeFile(this.path, productsJSON);
    } catch (error) {
      console.log('Error al guardar los productos en el archivo:', error);
    }
  }
}

export default ProductManager