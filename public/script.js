
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#close-cart");


document.addEventListener("DOMContentLoaded", () => {
  const shopContent = document.querySelector(".shop-content");

  // Function to fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("/products");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  // Function to render products on the frontend
  const renderProducts = (products) => {
    if (Array.isArray(products)) {
      // Check if products is an array
      products.forEach(product => {
        const productBox = document.createElement("div");
        productBox.classList.add("product-box");
        productBox.innerHTML = `
                  <div>
                      <img src="${product.image}" class="product-img">
                      <h2 class="product-title">${product.title.toUpperCase().trim()}</h2>
                  </div>
                  <div class="product-key">
                      <span class="price">₹${product.price}</span>
                      <i class='bx bx-cart-add add-cart'></i>
                  </div>
              `;
        const addToCartButton = productBox.querySelector(".add-cart");
        addToCartButton.addEventListener("click", () => {
          addProductToCart(product.title.toUpperCase(), product.price, product.image);
        });
        shopContent.appendChild(productBox);
      });
    } else {
      console.error("Received invalid product data:", products);
    }
  };



  // Fetch products from the backend and render them
  fetchProducts()
    .then((products) => {
      renderProducts(products);
    })
    .catch((error) => {
      console.error("Error rendering products:", error);
    });
});

// open the cart
cartIcon.addEventListener("click", () => {
  cart.classList.add("active");
});

//close the cart
closeCart.addEventListener("click", () => {
  cart.classList.remove("active");
});

// handle the ready state
const ready = () => {
  // remove cart 
  const removeCartBtn = document.getElementsByClassName("cart-remove");
  for (var i = 0; i < removeCartBtn.length; i++) {
    const button = removeCartBtn[i];
    button.addEventListener("click", removeCartItem);
  }

  // quantity input
  const quantity = document.getElementsByClassName("cart-quantity");
  for (var i = 0; i < quantity.length; i++) {
    const input = quantity[i];
    input.addEventListener("change", quantityChange);
  }

  //add to cart buttons
  const addCart = document.getElementsByClassName("add-cart");
  for (var i = 0; i < addCart.length; i++) {
    const button = addCart[i];
    button.addEventListener("click", addCartClicked);
  }
};

// Check DOM ready 
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

// add a product to the cart
const addProductToCart = (title, price, productImg) => {
    const cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    const cartItems = document.getElementsByClassName("cart-content")[0];
    const cartItemsNames = cartItems.getElementsByClassName("cart-product-title");

    for (let i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText === title) {
            alert("You have already added this item to the cart.");
            return;
        }
    }

    const cartBoxContent = `
        <img src="${productImg}" alt="" class="cart-img"/>
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" name="" id="" value="1" class="cart-quantity"> 
        </div>
        <i class="bx bx-trash-alt cart-remove"></i>
    `;

    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);

    cartShopBox.getElementsByClassName("cart-remove")[0].addEventListener("click", removeCartItem);
    cartShopBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", quantityChange);

    updateTotal();
}

//remove a cart item
const removeCartItem = (e) => {
    const btnClicked = e.target;
    btnClicked.parentElement.remove();
    updateTotal()
}

// handle quantity change
const quantityChange = (e) => {
  const input = e.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateTotal();
};

// Add product to cart
const addToCart = async (productId, quantity) => {
  try {
      const response = await fetch('/cart/add', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId, quantity })
      });
      const data = await response.json();
      if (data.success) {
          alert(data.message);
      } else {
          console.error(data.message);
      }
  } catch (error) {
      console.error('Error adding item to cart:', error);
  }
};

//handle add to cart button click
const addCartClicked = (e) => {
  const button = e.target;
  const shopProduct = button.parentElement;
  const productId = shopProduct.dataset.productId;
  const quantity = 1;
  const title = shopProduct
    .getElementsByClassName("product-title")[0]
    .innerText.toUpperCase()
    .trim();
  const price = shopProduct.getElementsByClassName("price")[0].innerText;
  const productImg = shopProduct.getElementsByClassName("product-img")[0].src;
  addProductToCart(title, price, productImg);
  addToCart(productId, quantity);
  updateTotal();
};

//update the total cost
const updateTotal = () => {
  const cartContent = document.getElementsByClassName("cart-content")[0];
  const cartBoxes = cartContent.getElementsByClassName("cart-box");
  let total = 0;
  for (let i = 0; i < cartBoxes.length; i++) {
    const cartBox = cartBoxes[i];
    const priceElement = cartBox.getElementsByClassName("cart-price")[0];
    const quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    const price = parseFloat(priceElement.innerText.replace("₹", "").trim());
    const quantity = parseInt(quantityElement.value);
    if (!isNaN(price) && !isNaN(quantity)) {
      total += price * quantity;
    } else {
      console.error(
        "Invalid price or quantity:",
        priceElement.innerText,
        quantityElement.value
      );
    }
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("total-price")[0].innerText =
    "₹" + total.toFixed(2);
};
