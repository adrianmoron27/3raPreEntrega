import express, { json } from "express"
import ProductManager from './entregable3.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager('./src/productos.json');
productManager.init()

app.get("/products", (req, res) => {
  const {limit} = req.query;
  const product = productManager.getProducts();
  console.log(product);

  if(limit > product.length){
    return res.json({ message :"El limite ingresado es mayor a la cantidad de productos" })
  }

  if (limit){
    const limioptions = product.slice(0,limit);
    return res.status(200).json(limioptions);
  }
  return res.status(200).json(product);
});

app.get("/products/:id",(req,res)=>{
  const {id} = req.params;
  try{
    const product = productManager.getProductById(Number(id));
    return res.status(200).json(product);
  }catch(error){
    return res.status(404).json({ message: error.message });
  }
})

app.listen(port, () => console.log(`Server listening on port ${port}`));
