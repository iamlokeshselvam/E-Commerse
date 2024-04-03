// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require("./src/User");
// const Product = require("./src/Product");
// const axios = require('axios');
// const redis = require('redis');
// const path = require('path');

// const app = express();
// const port = 5000;

// app.use(express.static('public'));
// app.set('view engine', 'ejs');
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // MongoDB connection setup
// mongoose.connect("mongodb+srv://iamlokeshselvam:iamlokeshselvam@cluster0.1wundwi.mongodb.net/myDatabase").then(() => {
//   console.log("MongoDB connected");
// }).catch((err) => {
//   console.error("Error connecting to MongoDB:", err);
// });

// // Redis connection setup
// const redisClient = redis.createClient();

// redisClient.on("error", function (error) {
//   console.error("Error connecting to Redis:", error);
// });

// // Middleware to cache products for 1 minute
// const cacheProducts = (req, res, next) => {
//   if (!redisClient.connected) {
//     console.error("Redis client is not connected");
//     return next();
//   }

//   redisClient.get('products', (err, data) => {
//     if (err) {
//       console.error("Error fetching data from Redis:", err);
//       return next();
//     }

//     if (data !== null) {
//       res.send(JSON.parse(data));
//     } else {
//       next();
//     }
//   });
// };

// // List Products route
// app.get('/products', cacheProducts, async (req, res) => {
//   try {
//     const response = await axios.get('https://fakestoreapi.com/products');
//     redisClient.set('products', JSON.stringify(response.data), 'EX', 60);

//     // Store products in MongoDB
//     await Product.deleteMany({});
//     await Product.insertMany(response.data);

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching product data:", error);
//     res.status(500).json({ error: 'An error occurred while fetching product data' });
//   }
// });

// // Register route
// app.post('/register', async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 8); 
//     const userData = {
//       userName: req.body.username,
//       email: req.body.email,
//       password: hashedPassword,
//       address: req.body.address
//     };

//     const newUser = await User.create(userData);
//     console.log('User registered:', newUser);
//     res.status(201).render('registerPage', { msg: 'User registered successfully' });
//   } catch (error) {
//     if (error.code === 11000 && error.keyPattern && error.keyPattern.userName) {
//       return res.status(400).render('registerPage', { msg: 'User with this username already exists' });
//     }
//     console.error('Error registering user:', error);
//     res.status(500).render('registerPage', { msg: 'An error occurred while registering user' });
//   }
// });

// // Login route
// app.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ userName: username });

//     if (!user) {
//       return res.status(404).render('loginPage', { msg: 'User not found' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).render('loginPage', { msg: 'Invalid credentials' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, '1234', { expiresIn: '1h' }); 

//     res.cookie('token', token, { httpOnly: true }); 
//     res.status(200).render('index', { msg: 'Login successful' });
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).render('loginPage', { msg: 'An error occurred while logging in' });
//   }
// });

// // Other routes
// app.use('/', require('./routes/pages'));

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("./src/User");
const Product = require("./src/Product");
const cartRoutes = require('./routes/cart');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 5000;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB connection setup
mongoose.connect("mongodb+srv://iamlokeshselvam:iamlokeshselvam@cluster0.1wundwi.mongodb.net/myDatabase")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

/// List Products route
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
    res.status(500).json({ error: 'An error occurred while fetching product data' });
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
    const token = jwt.sign({ id: user._id }, '1234', { expiresIn: '1h' }); 

    res.cookie('token', token, { httpOnly: true }); 
    res.status(200).redirect('/index')
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).render('loginPage', { msg: 'An error occurred while logging in' });
  }
});

app.use('/cart', cartRoutes);
app.use('/', require('./routes/pages'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
