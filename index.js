const port = 4000;
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://amaadhav938:5rc3UFqyzvsqyEqT@cluster0.ovydhlv.mongodb.net/ecomerce");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(null, `${file.originalname}_${Date.now()}`);
  }
});
const upload = multer({ storage: storage });

const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
  likes: { type: Number, default: 0 },
  comments: { type: Array, default: [] }
});

app.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/addproduct', async (req, res) => {
  let products = await Product.find({});
  let lastProduct = products.length ? products[products.length - 1] : null;
  let id = lastProduct ? lastProduct.id + 1 : 1;

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
  });

  await product.save();
  res.json({ success: true, name: req.body.name });
});

app.post('/upload', upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

app.use('/images', express.static('./upload/images'));

// Socket.IO handling
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('like', async (productId,a) => {
    const product = await Product.findById(productId);
    if (a) {
      product.likes += 1;
      await product.save();
      io.emit('update', { productId, likes: product.likes, comments: product.comments });
    }
    if (!a) {
      product.likes -= 1;
      await product.save();
      io.emit('update', { productId, likes: product.likes, comments: product.comments });
    }
  });

  socket.on('comment', async ({ productId, comment }) => {
    const product = await Product.findById(productId);
    if (product) {
      product.comments.push(comment);
      await product.save();
      io.emit('update', { productId, likes: product.likes, comments: product.comments });
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
