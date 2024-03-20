const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const port = 3005;

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'secret',
  });
  connection.connect((err) => {
    if(err){
    console.log("Error in connecting to the database",err.message);
    return;
  }
  console.log("Connected to the database");
});

app.get('/stores', (req, res) => {
    Store.findAll() 
      .then(stores => {
        res.json(stores); 
      })
      .catch(error => {
        console.error('Error fetching stores:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  

app.get('/products/companies/:companyname/categories/:categoryname/products', (req, res) => {
    const { companyname, categoryname } = req.params;
    const { top, minPrice, maxPrice } = req.query;
  
    const store = stores.find(store => store.name === companyname);
    const product = products.find(product => product.name === categoryname);
  
    if (!store || !product) {
      return res.status(404).json({ error: 'Company or category not found' });
    }
  
    const filteredProducts = storeProducts.filter(storeProduct => {
      return storeProduct.storeId === store.id
        && storeProduct.productId === product.id
        && storeProduct.price >= minPrice
        && storeProduct.price <= maxPrice;
    });
  
    const sortedProducts = filteredProducts.sort((a, b) => a.price - b.price).slice(0, top);
  
    res.json(sortedProducts);
  });
  


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});