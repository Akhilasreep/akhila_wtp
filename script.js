let books = [
  {
    id: 1,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 299,
    category: "Novel",
    cover: "https://via.placeholder.com/60x60",
    reviews: [
      { reviewerName: "John", content: "Amazing book!", rating: 5 },
      { reviewerName: "Emma", content: "Inspirational read!", rating: 4 }
    ]
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    price: 499,
    category: "Self-Help",
    cover: "https://via.placeholder.com/60x60",
    reviews: [
      { reviewerName: "Alice", content: "Life-changing!", rating: 5 },
      { reviewerName: "Mark", content: "Very useful tips.", rating: 4 }
    ]
  },
  {
    id: 3,
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    price: 350,
    category: "Biography",
    cover: "https://via.placeholder.com/60x60",
    reviews: [
      { reviewerName: "David", content: "Very motivating!", rating: 5 }
    ]
  }
];

let user = null;
let orders = [];
let notifications = [];
let otpCode = null;
let cart = [];

// Function to navigate between pages
function navigateTo(page) {
  const mainContent = document.getElementById("mainContent");
  setActiveTab(page);

  if (page === "home") {
    mainContent.innerHTML = generateHomePage();
    loadBooks();
  } else if (page === "cart") {
    mainContent.innerHTML = generateCartPage();
  } else if (page === "orders") {
    if (!user) {
      alert("You must be logged in to access this page.");
      navigateTo("account");
      return;
    }
    mainContent.innerHTML = generateOrdersPage();
  } else if (page === "account") {
    mainContent.innerHTML = generateAccountPage();
  }
}

function setActiveTab(page) {
  document.querySelectorAll('.bottom-nav ul li a').forEach(tab => tab.classList.remove('active'));
  document.getElementById(`${page}Tab`).classList.add('active');
}

document.addEventListener("DOMContentLoaded", function () {
  checkLoginStatus(); // Check login on page load
});

// Check if user is already logged in
function checkLoginStatus() {
  let loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    let user = JSON.parse(localStorage.getItem(loggedInUser));
    document.getElementById("mainContent").style.display = "block";
  }
}

// Load Books
function loadBooks() {
  displayBooks(books);
}

// Generate Home Page
function generateHomePage() {
  return `
    <div class="search-container">
      <input type="text" id="searchInput" placeholder="Search books..." oninput="searchBooks()" />
    </div>
    <h2>Books for Sale</h2>
    <div id="bookList"></div>
  `;
}

// Search books
function searchBooks() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(query) || 
    book.author.toLowerCase().includes(query) || 
    book.category.toLowerCase().includes(query)
  );
  displayBooks(filteredBooks);
}

function displayBooks(bookList) {
  const bookListContainer = document.getElementById("bookList");
  bookListContainer.innerHTML = bookList.length > 0
    ? bookList.map(book => {
          const totalReviews = book.reviews.length;
        const avgRating = totalReviews > 0
          ? (book.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
          : "No Ratings";

        return `
          <div class="book-card">
            <div class="heart-icon" onclick="addToWishlist(${book.id})">❤️</div>
            <img src="${book.cover}" alt="${book.title}" width="60" height="60" />
            <h3>${book.title}</h3>
            <p>by ${book.author}</p>
            <p>Price: ₹${book.price}</p>
            <p>📦 Available: ${book.quantity || "Out of Stock"}</p>
            <p>⭐ ${avgRating} (${totalReviews} reviews)</p>
            <button onclick="addToCart(${book.id})" ${book.quantity === 0 ? "disabled" : ""}>
              ${book.quantity === 0 ? "Out of Stock" : "🛒 Add to Cart"}
            </button>
            <button onclick="viewReviews(${book.id})">📖 View Reviews</button>
          </div>
        `;
      }).join("")
    : "<p>No books available.</p>";
}
  
function viewReviews(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return alert("Book not found!");

  const reviewsHTML = book.reviews.length > 0
    ? book.reviews.map(review => `
      <p>📝 "${review.content}" - <b>${review.reviewerName}</b> (${review.rating} ⭐)</p>
    `).join("")
    : "<p>No reviews yet.</p>";

  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML = `
    <h2>Reviews for "${book.title}"</h2>
    ${reviewsHTML}
    <button onclick="navigateTo('home')">🔙 Back</button>
  `;
}
function removeOneFromCart(bookId) {
  const cartItem = cart.find(item => item.id === bookId);
  if (cartItem.quantity > 1) {
    cartItem.quantity -= 1;
  } else {
    cart = cart.filter(item => item.id !== bookId);
  }
  navigateTo("cart");
}

let wishlist = [];

function addToWishlist(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  if (!wishlist.some(item => item.id === bookId)) {
    wishlist.push(book);
  }

  alert(`❤️ ${book.title} has been added to your wishlist!`);
}

function generateWishlistPage() {
  return `
    <h2>💖 Your Wishlist</h2>
    <div id="wishlistList">
      ${wishlist.length > 0
        ? wishlist.map(item => `
          <div class="wishlist-item">
            <h3>${item.title}</h3>
            <p>by ${item.author}</p>
            <p>Price: ₹${item.price}</p>
            <button onclick="addToCart(${item.id})">🛒 Add to Cart</button>
            <button onclick="removeFromWishlist(${item.id})">🗑 Remove</button>
          </div>
        `).join("")
        : "<p>Your wishlist is empty. 💖</p>"
      }
    </div>
  `;
}

function removeFromWishlist(bookId) {
  wishlist = wishlist.filter(item => item.id !== bookId);
  navigateTo("wishlist");
}


function giveReview(bookId) {
  const order = orders.find(o => o.bookId === bookId);
  if (!order) {
    alert("You can only review books that you have purchased!");
    return;
  }

  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML = `
    <h2>Review "${order.bookDetails.title}"</h2>
    <form onsubmit="submitReview(event, ${order.bookId})">
      <label>Your Review</label>
      <textarea id="reviewContent" required></textarea>
      <label>Rating (1-5 ?)</label>
      <select id="reviewRating" required>
        <option value="5">⭐⭐⭐⭐⭐(5 Stars)</option>
        <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
        <option value="3">⭐⭐⭐ (3 Stars)</option>
        <option value="2">⭐⭐ (2 Stars)</option>
        <option value="1">⭐(1 Star)</option>
      </select>
      <button type="submit">Submit Review</button>
    </form>
    <button onclick="navigateTo('account')">Cancel</button>
  `;
}
function submitReview(event, bookId) {
  event.preventDefault();
  
  const content = document.getElementById("reviewContent").value;
  const rating = parseInt(document.getElementById("reviewRating").value, 10);
  
  const book = books.find(b => b.id === bookId);
  if (!book) {
    alert("Book not found.");
    return;
  }

  book.reviews.push({
    reviewerName: user.name,
    content,
    rating
  });

  saveData(); // Save to localStorage
  alert("Thank you for your review! ??");
  navigateTo("home");
}

function addToCart(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book || book.quantity === 0) return alert("Book is out of stock!");

  const cartItem = cart.find(item => item.id === bookId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...book, quantity: 1 });
  }

  alert(`${book.title} added to cart!`);
  navigateTo('cart');
}
// Cart Page
function generateCartPage() {
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return `
    <h2>🛒 Your Cart</h2>
    <div id="cartList">
      ${cart.length > 0
        ? cart.map((item, index) => `
          <div class="cart-item">
            <h3>${item.title} (x${item.quantity})</h3>
            <p>💰 Price: ₹${item.price * item.quantity}</p>
            <button onclick="removeFromCart(${index})">🗑 Remove</button>
          </div>
        `).join("")
        : "<p>Your cart is empty. 🛒</p>"
      }
    </div>
    ${cart.length > 0
      ? `<p><b>💰 Total: ₹${totalAmount}</b></p>
         <button class="checkout-btn" onclick="checkoutCart()">✅ Checkout Now</button>`
      : ""}
  `;
}
// Remove from Cart
function removeFromCart(index) {
  cart.splice(index, 1);
  navigateTo("cart");
}
// Checkout Cart (Separate Screen Like Login)
function checkoutCart() {
  if (cart.length === 0) return alert("🛑 Your cart is empty!");

  document.getElementById("mainContent").innerHTML = `
    <div class="checkout-container">
      <h2>🛍️ Checkout</h2>

      <div id="checkoutList">
        ${cart.map(item => `
          <div class="checkout-item">
            <img src="${item.cover}" alt="${item.title}" width="50" height="50" />
            <h3>${item.title} (x${item.quantity})</h3>
            <p>💰 Price: ₹${item.price * item.quantity}</p>
            <p>📦 Available: ${item.stock} items</p>
          </div>
        `).join("")}
      </div>

      <form id="checkoutForm" onsubmit="confirmOrder(event)">
        <label>👤 Full Name:</label>
        <input type="text" id="buyerName" required placeholder="Enter your name" />

        <label>📞 Phone Number:</label>
        <input type="tel" id="buyerPhone" required placeholder="Enter your phone number" />

        <label>🏢 College Name:</label>
        <input type="text" id="collegeName" required placeholder="Enter your college name" />

        <label>📚 Department & Year:</label>
        <input type="text" id="departmentYear" required placeholder="e.g., Computer Science - 2nd Year" />

        <label>📦 Number of Quantities:</label>
        <input type="number" id="numOfQuantities" min="1" required />

        <label>📍 Address:</label>
        <input type="text" id="buyerAddress" required placeholder="Enter your address" />

        <button type="submit" class="checkout-btn">✅ Place Order</button>
      </form>

      <button class="back-btn" onclick="navigateTo('cart')">🔙 Back to Cart</button>
    </div>
  `;
}


function updateCartQuantity(index) {
  let newQuantity = parseInt(document.getElementById(`quantity-${index}`).value);
  if (newQuantity < 1) {
    alert("⚠️ Quantity must be at least 1!");
    return;
  }
  cart[index].quantity = newQuantity;
}
function confirmOrder(event) {
  event.preventDefault();

  const buyerName = document.getElementById("buyerName").value;
  const buyerPhone = document.getElementById("buyerPhone").value;
  const collegeName = document.getElementById("collegeName").value;
  const departmentYear = document.getElementById("departmentYear").value;
  const numOfQuantities = parseInt(document.getElementById("numOfQuantities").value, 10);
  const buyerAddress = document.getElementById("buyerAddress").value;

  if (!buyerName || !buyerPhone || !collegeName || !departmentYear || !numOfQuantities || !buyerAddress) {
    alert("⚠️ All fields are required!");
    return;
  }

  let insufficientStock = cart.some(item => numOfQuantities > item.stock);
  if (insufficientStock) {
    alert(`⛔ Not enough stock! Available stock: ${cart[0].stock} items.`);
    return;
  }

  cart.forEach(item => {
    const bookIndex = books.findIndex(b => b.id === item.id);
    if (bookIndex !== -1) {
      books[bookIndex].quantity -= numOfQuantities;
      if (books[bookIndex].quantity === 0) {
        books.splice(bookIndex, 1); // Remove from home if out of stock
      }
    }

    orders.push({
      bookId: item.id,
      bookDetails: { ...item },
      quantity: numOfQuantities,
      totalAmount: item.price * numOfQuantities,
      name: buyerName,
      phone: buyerPhone,
      college: collegeName,
      departmentYear: departmentYear,
      address: buyerAddress,
      status: "📦 Order Placed"
    });
  });

  cart = [];
  alert("🎉 Order placed successfully!");
  navigateTo("orders");
  loadBooks(); // Refresh stock on home page
}
function addToWishlist(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  if (!cart.some(item => item.id === bookId)) {
    cart.push({ ...book, quantity: 1 });
  }

  saveData(); // Save wishlist changes
  alert(`❤️ ${book.title} has been added to your wishlist!`);
  navigateTo('cart');
}
// Orders Page
function generateOrdersPage() {
  return `
    <h2>Your Orders</h2>
    <div id="ordersList">
      ${orders.length > 0
        ? orders.map(order => `
          <div class="order-item">
            <h3>${order.bookDetails.title} (x${order.quantity})</h3>
            <p>Total: ₹${order.totalAmount}</p>
            <p>👤 Name: ${order.name}</p>
            <p>📞 Phone: ${order.phone}</p>
            <p>🏢 College: ${order.college}</p>
            <p>📚 Department & Year: ${order.departmentYear}</p>
            <p>📦 Ordered Quantity: ${order.quantity}</p>
            <p>📍 Address: ${order.address}</p>
            <p>Status: ${order.status}</p>
          </div>
        `).join("")
        : "<p>No orders placed yet.</p>"
      }
    </div>
  `;
}
function generateAccountPage() {
  if (user) {
    const userOrders = orders.map(order => `
      <div class="order-card">
        <h3>${order.bookDetails.title} (₹${order.totalAmount})</h3>
        <p>Delivery Date: ${order.deliveryDate}</p>
        <p>Status: ${order.status}</p>
        ${
          order.status === "Active"
            ? `<button onclick="cancelOrder(${order.bookId})">Cancel Order</button>`
            : "<p>Order has been canceled.</p>"
        }
        <button onclick="giveReview(${order.bookId})">Give Review</button>
      </div>
    `).join("");

    return `
      <h2>Welcome, ${user.name}</h2>
      <p>Email: ${user.email}</p>
      <p>Phone: ${user.phoneNumber}</p>
      <p>College Register Number: ${user.collegeRegisterNumber}</p>
      <h3>Your Orders</h3>
      ${userOrders || "<p>No orders placed yet.</p>"}
    `;
  }
  return `
    <form onsubmit="sendOtp(event)">
      <label>Name</label><input type="text" id="name" required>
      <label>Email ID</label><input type="email" id="email" required>
      <label>Phone Number</label><input type="text" id="phoneNumber" required>
      <label>College Register Number</label><input type="text" id="collegeRegisterNumber" required>
      <button type="submit">Send OTP</button>
    </form>
  `;
}

// OTP Sending Logic
function sendOtp(event) {
  event.preventDefault();
  const phoneNumber = document.getElementById("phoneNumber").value;

  if (!/^\d{10}$/.test(phoneNumber)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  otpCode = Math.floor(100000 + Math.random() * 900000);
  alert(`Your OTP is: ${otpCode}`);
  verifyOtp(phoneNumber);

  }
  // OTP Verification Logic
function verifyOtp(phoneNumber) {
  const otp = prompt("Enter the OTP sent to your phone:");

  if (parseInt(otp) === otpCode) {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const collegeRegisterNumber = document.getElementById("collegeRegisterNumber").value;

    user = { name, email, phoneNumber, collegeRegisterNumber };
    navigateTo("account");
    alert("Logged in successfully!");
  } else {
    alert("Invalid OTP. Please try again.");
  }
}
// Post a New Book
function postBook(event) {
  event.preventDefault();

  const bookName = document.getElementById("bookName").value;
  const authorName = document.getElementById("authorName").value;
  const price = parseInt(document.getElementById("price").value, 10);
  const category = document.getElementById("category").value;

  const pictureFile = document.getElementById("bookPicture").files[0];
  const cover = pictureFile ? URL.createObjectURL(pictureFile) : "https://via.placeholder.com/60x60";

  books.push({
    id: books.length + 1,
    title: bookName,
    author: authorName,
    price,
    category,
    cover
  });

  alert("Book posted successfully!");
  navigateTo("home");
}
// Posting a Book
function generateOrdersPage() {
  return `
    <form onsubmit="postBook(event)">
      <label>Book Name</label><input type="text" id="bookName" required>
      <label>Author Name</label><input type="text" id="authorName" required>
      <label>Price</label><input type="text" id="price" required>
      <label>Category</label>
      <select id="category">
        <option value="Novel">Novel</option>
        <option value="Textbook">Textbook</option>
        <option value="Tamil Textbook">Tamil Textbook</option>
        <option value="Story">Story</option>
        <option value="Tamil Story">Tamil Story</option>
        <option value="Holy Books">Holy Books</option>
        <option value="Others">Others</option>
      </select>
      <label>Number of Copies</label><input type="number" id="quantity" min="1" required>
      <label>Picture (optional)</label><input type="file" id="bookPicture" accept="image/*">
      <button type="submit">Post Book</button>
    </form>
  `;
}

function postBook(event) {
  event.preventDefault();

  const bookName = document.getElementById("bookName").value;
  const authorName = document.getElementById("authorName").value;
  const price = parseInt(document.getElementById("price").value, 10);
  const category = document.getElementById("category").value;
  const quantity = parseInt(document.getElementById("quantity").value, 10);

  const pictureFile = document.getElementById("bookPicture").files[0];
  const cover = pictureFile ? URL.createObjectURL(pictureFile) : "https://via.placeholder.com/60x60";

  books.push({
    id: books.length + 1,
    title: bookName,
    author: authorName,
    price,
    category,
    quantity,
    cover,
    reviews: []
  });

  alert("Book posted successfully!");
  navigateTo("home");
}

// Load Home Page Initially
navigateTo("home");