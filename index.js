const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("./src/User");
const Product = require("./src/Product");
// const cartRoutes = require('./routes/cart');
const axios = require('axios');
const path = require('path');
// const redis = require('redis');
const cartContoller = require('./controllers/cartController')

const app = express();
const port = process.env.PORT || 5000;

// Redis Cloud setup
// const redisClient = redis.createClient({
//     host: 'redis-16152.c14.us-east-1-2.ec2.cloud.redislabs.com',
//     port: 16152, 
//     password: 'ezTLRgBEecWolxfWEp1eCTTdCzhuU9uh' 
// });

// redisClient.on('error', (err) => {
//     console.error('Redis Error:', err);
// });

// Define middleware for JWT authentication
function authenticateJWT(req, res, next) {

  if (!req) {
      return res.status(500).json({ error: 'Request object is undefined' });
  }
  
  if (!req.headers) {
      return res.status(400).json({ error: 'Request headers are undefined' });
  }
  if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
  }
 
  const token = req.headers.authorization.split(' ')[1];
  
  try {
 
    const decodedToken = jwt.verify(token, '1234');
    const user = decodedToken.user;
    req.user = user;
    next();
  } catch (error) {

    return res.status(403).json({ message: 'Forbidden' });
  }
  }
  
  
  module.exports = authenticateJWT;

// MongoDB connection setup
mongoose.connect("mongodb+srv://iamlokeshselvam:iamlokeshselvam@cluster0.1wundwi.mongodb.net/myDatabase")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

    

// Setting up view engine and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Apply authentication middleware to cart routes
// app.use('/cart', authenticateJWT, cartRoutes);

// Redis caching middleware for products
// const cacheProducts = (req, res, next) => {
//     const cacheKey = 'products';

//     redisClient.get(cacheKey, async (err, data) => {
//         if (err) {
//             console.error('Redis get error:', err);
//             return res.status(500).json({ error: 'Internal Server Error' });
//         }

//         if (data !== null) {
//             return res.json(JSON.parse(data));
//         } else {
//             try {
//                 const { data } = await axios.get('https://fakestoreapi.com/products');
//                 redisClient.setex(cacheKey, 60, JSON.stringify(data));
//                 res.json(data);
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//                 res.status(500).json({ error: 'An error occurred while fetching products' });
//             }
//         }
//     });
// };

// app.get('/products', cacheProducts);


app.get('/products', async (req, res) => {
  try {

    const response = await axios.get('https://fakestoreapi.com/products');
    const products = response.data;
    // Delete existing products to avoid duplicate key errors
    await Product.deleteMany({});

    // Store each product in MongoDB
    for (const product of products) {
      await Product.create(product);
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).send({ error: 'An error occurred while fetching product data' });
  }
});


app.get('/index', (req, res) => {
  res.render('index');
});
// Register route
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 8); 
    const userData = {
      userName: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      address: req.body.address
    };

    const newUser = await User.create(userData);
    console.log('User registered:', newUser);
    res.status(201).render('registerPage', { msg: 'User registered successfully' });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.userName) {
      return res.status(400).render('registerPage', { msg: 'User with this username already exists' });
    }
    console.error('Error registering user:', error);
    res.status(500).render('registerPage', { msg: 'An error occurred while registering user' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ userName: username });

    if (!user) {
      return res.status(404).render('loginPage', { msg: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).render('loginPage', { msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, '1234'); 

    res.cookie('token', token, { httpOnly: true }); 
    res.status(200).redirect('/index')
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).render('loginPage', { msg: 'An error occurred while logging in' });
  }
});


app.use('/', require('./routes/pages'));

app.post('/cart/add', cartContoller.addToCart);
app.get('/cart/:userName/items/details', cartContoller.listCartItemsWithDetails);
app.delete('/cart/:userId/remove/:productId', cartContoller.removeFromCart);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


// // Redis client setup
// const client = createClient({
//   password: 'ezTLRgBEecWolxfWEp1eCTTdCzhuU9uh',
//   socket: {
//       host: 'redis-16152.c14.us-east-1-2.ec2.cloud.redislabs.com',
//       port: 16152
//   }
// });

// client.on('error', (err) => {
//   console.error('Redis Error:', err);
// });


// // Define middleware for JWT authentication
// function authenticateJWT(req, res, next) {
// // Check if req object is defined
// if (!req) {
//     return res.status(500).json({ error: 'Request object is undefined' });
// }

// // Check if the request contains headers
// if (!req.headers) {
//     return res.status(400).json({ error: 'Request headers are undefined' });
// }

// // Check if the authorization header is present
// if (!req.headers.authorization) {
//     return res.status(401).json({ message: 'Unauthorized' });
// }

// // Check if the authorization header contains a token
// if (!req.headers.authorization.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Unauthorized' });
// }

// // Extract the token from the authorization header
// const token = req.headers.authorization.split(' ')[1];

// try {
//   // Verify the JWT token
//   const decodedToken = jwt.verify(token, 'your_secret_key');

//   // If verification succeeds, you might extract user information from the decoded token
//   const user = decodedToken.user;

//   // Set the user object on the request for further use in your application
//   req.user = user;

//   // Call next() to proceed to the next middleware or route handler
//   next();
// } catch (error) {
//   // If an error occurs during token verification, handle it here
//   return res.status(403).json({ message: 'Forbidden' });
// }
// }


// module.exports = authenticateJWT;

// const app = express();
// const port = 5000;

// // MongoDB connection setup
// mongoose.connect("mongodb+srv://iamlokeshselvam:iamlokeshselvam@cluster0.1wundwi.mongodb.net/myDatabase")
// .then(() => {
//   console.log("MongoDB connected");
// })
// .catch((err) => {
//   console.error("Error connecting to MongoDB:", err);
// });