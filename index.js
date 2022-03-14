const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.aqab4.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const productCollection = client.db(process.env.DB_Name).collection("products");
  const orderCollection = client.db(process.env.DB_Name).collection("orders");
  
  app.post('/addProduct', (req, res)=>{
      const products = req.body;
      productCollection.insertOne(products)
      .then(result=>{
        console.log(result.acknowledged);
          res.send(result.acknowledged);
      })
  })

  app.get('/products', (req, res)=>{
    productCollection.find({}).limit(20)
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  app.get('/products/:key', (req, res)=>{
    productCollection.find({key: req.params.key})
    .toArray((err, documents)=>{
      res.send(documents[0]);
    })
  })

  app.post('/productsByKeys', (req, res)=>{
    const productKeys = req.body;
    productCollection.find({key: {$in: productKeys}})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })

  app.post('/addOrder', (req, res)=>{
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result=>{
      console.log(result.acknowledged);
        res.send(result.acknowledged);
    })
})

});

app.listen(port);