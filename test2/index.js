const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017';

//Tạo API lấy tất cả sản phẩm

app.get('/inventory', (req, res) => {
  MongoClient.connect(url, function(err, client) {
    const db = client.db("test");
    const collection = db.collection('inventory');
    collection.find({}).toArray(function(err, docs) {
      res.send(docs);
      client.close();
    });
  });
});

//Tạo API để chỉ lấy các sản phẩm có số lượng dưới 100

app.get('/inventoryUpdate', (req, res) => {
  MongoClient.connect(url, function(err, client) {
    const db = client.db(dbName);
    const collection = db.collection('inventory');
    collection.find({instock: {$lt: 100}}).toArray(function(err, docs) {
      res.send(docs);
      client.close();
    });
  });
});

//API đăng nhập và tạo mã thông báo

const secretKey = 'mysecretkey';

const users = [
  {username: 'admin', password: 'MindX@2022'},
  {username: 'alice', password: 'MindX@2022'}
];

app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const {username, password} = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    const token = jwt.sign({username}, secretKey);
    res.send({token});
  } else {
    res.status(401).send('Invalid username or password');
  }
});

//Chặn người dùng chưa đăng nhập

const jwtMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).send('Invalid token');
    }
  } else {
    res.status(401).send('Missing token');
  }
};

app.get('/orders', jwtMiddleware, (req, res) => {
  MongoClient.connect(url, function(err, client) {
    const db = client.db(dbName);
    const collection = db.collection('orders');
    collection.find({}).toArray(function(err, docs) {
      res.send(docs);
      client.close();
    });
  });
});

//tạo một API để lấy đơn đặt hàng với mô tả sản phẩm

app.get('/orders', jwtMiddleware, (req, res) => {
  MongoClient.connect(url, function(err, client) {
    const db = client.db(dbName);
    const collection = db.collection('orders');
    collection.aggregate([
      {
        $lookup: {
          from: 'inventory',
          localField: 'item',
          foreignField: 'sku',
          as: 'product'
        }
      }
    ]).toArray(function(err, docs) {
      res.send(docs);
      client.close();
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});