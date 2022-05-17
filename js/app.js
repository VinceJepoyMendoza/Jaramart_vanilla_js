// Variables
const page = document.getElementsByTagName('body')[0]
// Main nav
const mainNav = document.querySelector('.main-nav')
// Secondary Nav
const secNav = document.querySelector('.secondary-nav')
// Footer
const mainFooter = document.getElementById('main-footer')
// Secondary nav button
const secNavBtn = document.getElementById('nav-button')
// Toggle between light/dark mode
const modeBtn = document.getElementById('mode')
// Swiper container
const swiperContainer = document.getElementById('feature-swiper')
const modal = document.getElementById('product-Modal')
const modalContent = document.querySelector('.product-modal-content')
// Close modal button
const closeModalBtn = document.querySelector('.btn-close-modal')
const scrollTopBtn = document.getElementById('scrollToTop')
const likesContent = document.querySelector('.main-likes')
const closeLikes = document.getElementById('close-likes')
const openLikes = document.getElementById('likes-open-button')
const toggleCartBtn = document.getElementById('cart-open-button')
const cartContent = document.getElementById('main-cart')
const messageContainer = document.getElementById('messageContainer')
const messageContent = document.getElementById('notification')
const cartItemsContent = document.querySelector('.main-cart-content-items')
const cartItemsTotal = document.getElementById('cart-Total')
const cartCheckoutBtn = document.getElementById('checkout')
const aboutBtn = document.getElementById('about-order-btn')

aboutBtn.addEventListener('click', () => {
  window.scrollTo({
    top: document.getElementById('order').offsetTop - 82,
    behavior: 'smooth',
  })
})

// Scroll to top
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
})

// Toggle navigation secondary screen
secNavBtn.addEventListener('click', () => {
  secNav.classList.toggle('nav-toggle')
})

mainNav.addEventListener('click', (e) => {
  const target = e.target
  // Toggle mode button
  toggleMode(target)
  toggleCart(target)
  toggleLikes(target)
  smoothScrollingNav()
})

// Smooth scrolling
function smoothScrollingNav() {
  const navLinks = document.querySelectorAll('.navLinks')
  navLinks.forEach((currLink) => {
    currLink.addEventListener('click', (event) => {
      event.preventDefault()
      const targetId = currLink.getAttribute('href')
      window.scrollTo({
        top: document.querySelector(targetId).offsetTop - 82,
        behavior: 'smooth',
      })
    })
  })
}

function toggleMode(target) {
  if (target.id === 'mode' || target.parentElement.id === 'mode') {
    document.body.classList.toggle('dark-mode')
  }
}

// Toggle cart
function toggleLikes(target) {
  if (
    target.id === 'likes-open-button' ||
    target.parentElement.id === 'likes-open-button'
  ) {
    if (!likesContent.classList.contains('cart-active')) {
      // Adding active class
      likesContent.classList.add('cart-active')
      // Adding overlay
      likesOverlay.style.display = 'block'
      // Checking if overlay is clicked
      overlayFunc()
      // Remoning cart if active
      if (cartContent.classList.contains('cart-active-right')) {
        cartContent.classList.remove('cart-active-right')
      }
      // Disabling body scroll
      page.classList.add('bodyScrollRemove')
    } else {
      likesContainerRemove()
    }
  }
}

function toggleCart(target) {
  if (
    target.id === 'cart-open-button' ||
    target.parentElement.id === 'cart-open-button'
  ) {
    if (!cartContent.classList.contains('cart-active-right')) {
      // Adding active class
      cartContent.classList.add('cart-active-right')
      likesContainerRemove()
      // Disable body scrolling
      page.classList.add('bodyScrollRemove')
    } else {
      // Removing active class
      cartContent.classList.remove('cart-active-right')
      page.classList.remove('bodyScrollRemove')
    }
  }
}

// Closing cart
closeLikes.addEventListener('click', () => {
  likesContainerRemove()
})

const likesOverlay = document.querySelector('.main-likes-dark-bg')

// Toggle message notification
function notification(message) {
  // Summoning message container
  messageContainer.style.left = '20px'
  // Setting message
  messageContent.textContent = message
  // Disapear after 2s
  setTimeout(() => {
    messageContainer.style.left = `-${messageContainer.clientWidth}px`
  }, 3000)
}

// Removing likes cart
function likesContainerRemove() {
  // Removing active class
  likesContent.classList.remove('cart-active')
  // Removing Overlay
  likesOverlay.style.display = 'none'
  page.classList.remove('bodyScrollRemove')
}

// Overlay Listener
function overlayFunc() {
  likesOverlay.addEventListener('click', () => {
    likesContainerRemove()
  })
}

// API Related
const baseUrl = 'https://fakestoreapi.com/products'
const products = document.querySelector('.products-content')
const dataFeatures = `${baseUrl}?limit=3`

// Get all products from api
async function getProductsApi(source) {
  const response = await fetch(source)
  const data = await response.json()
  return data
}

// Generate featured products
getProductsApi(dataFeatures)
  .then((features) => {
    features.forEach((currProd) => {
      // Create slide
      const slide = document.createElement('div')
      slide.classList = 'swiper-slide feature-slide'
      slide.innerHTML = `
        <div class="swiper-slide-info">
          <h4 class="title-category">Hot Deals:</h4>
          <p class="title-name">${currProd.title}</p>
          <p class="lead">${currProd.description}</p>
          <button type="button" title="Order Now" class="btn">Order Now</button>
        </div>
        <img src="${currProd.image}" alt="product 1">
      `

      swiperContainer.insertAdjacentElement('beforeend', slide)
    })
  })
  .catch((err) => err)

// Getting all products from api
const getAllProducts = getProductsApi(baseUrl)

getAllProducts.then((productsApi) => {
  // Displaying all products to UI
  productsApi.forEach((currProd) => {
    displayAllProducts(currProd)
  })

  const allProdUI = document.querySelectorAll('.products-content-card')

  // Validating for displaying modals for every products
  allProdUI.forEach((currProd) => {
    // Adding event listeners for all of products
    currProd.addEventListener('click', (e) => {
      const currTarget = e.target
      // Checking if the image is clicked
      if (currTarget.classList.contains('prodImg')) {
        // Image's parent element id
        const currTargetId = currTarget.parentElement.id
        // Looping through the api
        productsApi.forEach((currApiProd) => {
          if (currApiProd.id === parseInt(currTargetId)) {
            // Displaying modals for every products
            displayModal(currApiProd)
          }
        })
      }
    })
  })

  // Liked datas
  let likedData = []

  // Like Button
  const likeBtn = document.querySelectorAll('.liked')
  // Liked product container
  const likesContainer = document.querySelector('.main-likes_prod')

  // Looping through all like buttons
  likeBtn.forEach((currBtn) => {
    likingProcess(currBtn)
  })

  // Modal for liked items
  likesContent.addEventListener('click', (event) => {
    const target = event.target.parentElement
    // Checking if item is clicked
    if (target.classList.contains('main-likes_prod_item')) {
      productsApi.forEach((currData) => {
        // Validating item from api
        if (currData.id === parseInt(target.id)) {
          // Displaying modal
          displayModal(currData)
        }
      })
    }
  })

  // Modal like btn
  modalContent.addEventListener('click', (event) => {
    const target = event.target
    if (target.classList.contains('modalLikeBtn')) {
      likingProcess(target)
    }
  })

  // _____________________________ Cart related

  // Cart data
  const cartedItems = []

  // Collecting all carted items
  allProdUI.forEach((currProd) => {
    currProd.addEventListener('click', (event) => {
      const target = event.target
      // id of clicked item
      const currId = parseInt(target.parentElement.parentElement.id)
      // Checking if add to cart btn is clicked
      if (target.classList.contains('addToCart')) {
        // Checking if the item is duplicated
        if (cartedItems.indexOf(currId) === -1) {
          // Adding data to cartedData
          cartedItems.push(currId)
          // Inserting items to cart container
          displayCartedItem(cartedItems)
          // Displaying cart overall total
          getCartTotal()
          // Displaying Message
          notification('Item added to cart')
        } else {
          console.log('already in cart')
        }
      }
    })
  })

  // Removing item from carts
  cartItemsContent.addEventListener('click', (e) => {
    const target = e.target.parentElement
    if (target.classList.contains('cart-item-btn-remove')) {
      // Current id of the item
      const targetId = parseInt(target.parentElement.parentElement.id)
      // Removing item from carted items
      cartedItems.splice(cartedItems.indexOf(targetId), 1)
      // Displaying updated carted item
      displayCartedItem(cartedItems)
      // Displaying cart overall total
      getCartTotal()
    }
  })

  // ****************************************************

  // Display all products to UI
  function displayAllProducts(dataPass) {
    // Creating product card
    const card = document.createElement('div')
    card.classList = `products-content-card prod-${dataPass.id}`
    card.id = dataPass.id
    card.innerHTML += `
        <button class="product-like btn liked" type="button" title="Like it?"><i class="fas fa-heart"></i></button>
        <img src="${dataPass.image}" alt="product" class="prodImg">
        <div class="products-content-card-desc">
          <h3>${dataPass.title}</h3>
          <div id="products-card-rating">
            <p>${dataPass.rating.rate}</p>
            <div id="prodcuts-card-star">${createStars(
              dataPass.rating.rate
            )}</div>
          </div>
          <h4>$${dataPass.price}</h4>
          <button type="button" title="Add to cart now" class="addToCart btn btn-primary">Add To Cart</button>
        </div>
      `

    // Adding products to UI
    products.insertAdjacentElement('beforeend', card)
  }

  // Displaying to liked Container
  function printLiked(likesId) {
    likesId.forEach((currLiked) => {
      // Looping through API
      productsApi.forEach((prod) => {
        if (currLiked === prod.id) {
          const carted = document.createElement('div')
          carted.classList = 'main-likes_prod_item'
          carted.id = currLiked
          carted.innerHTML = `
            <img src="${prod.image}" alt="liked item">
            <p>$${prod.title}<br>${prod.price}</p>
          `
          likesContainer.insertAdjacentElement('beforeend', carted)
        }
      })
    })
  }

  // Displaying modals
  function displayModal(data) {
    // Create the modal
    modalContent.innerHTML = `
        <small class="category">${data.category}</small>
        <img src="${data.image}" class="modal-img" alt="buy me">
        <h2>${data.title}</h2>
        <div class="product-modal-content-desc">
          <p>$${data.price}</p>
          <span>
            <p>${data.rating.rate} ${createStars(data.rating.rate)} (${
      data.rating.count
    })</p>
          </span>
        </div>
        <div class="product-modal-content-btn modal-${data.id}">
          <button type="button" title="Add to Cart?" class="modalCartBtn"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
          <button type="button" title="Add to Likes?" class="modalLikeBtn"><i class="fas fa-heart"></i> Add to likes</button>
        </div>
        <small class="modal-description">Description:<br>${
          data.description
        }.</small>
    `

    // Make modal visible
    modal.style.visibility = 'visible'

    // Close modal
    closeModalBtn.addEventListener('click', () => {
      modal.style.visibility = 'hidden'
      // Enable body scrolling
      page.style.overflow = ''
    })

    // Disable body scrolling
    page.style.overflow = 'hidden'
  }

  // Liking process
  function likingProcess(currBtn) {
    const id = currBtn.parentElement.classList[1].split('-')
    const currId = parseInt(id[1])
    currBtn.addEventListener('click', () => {
      // Toggling like button validation
      if (!currBtn.classList.contains('liked-active')) {
        // Filtering unique value
        if (likedData.indexOf(currId) === -1) {
          // Adding new liked to likedData
          likedData.push(currId)
          // Reseting likes container
          likesContainer.innerHTML = ''
          // Displaying to liked container
          printLiked(likedData)
          // Displaying notification
          notification('Item added to likes')
        }
        // Add active to like btn
        currBtn.classList.add('liked-active')
      } else {
        // Removing from the likedData
        likedData.splice(likedData.indexOf(currId), 1)
        // Reseting likes container
        likesContainer.innerHTML = ''
        // Displaying all liked to like container
        printLiked(likedData)
        // Displaying notification
        notification('Item removed from likes')
        // Remove active to like btn
        currBtn.classList.remove('liked-active')
      }
    })
  }

  // Displaying carted items to UI
  function displayCartedItem(items) {
    // Clearing cart content
    cartItemsContent.innerHTML = ''
    items.forEach((currItem) => {
      productsApi.forEach((apiItem) => {
        if (currItem === apiItem.id) {
          // Creating parent item
          const item = document.createElement('div')
          item.classList = 'main-cart-content-items-item'
          item.id = currItem
          item.innerHTML = `
            <img src="${apiItem.image}" alt="cart item img">
          `
          // Creating description
          const itemDesc = document.createElement('div')
          itemDesc.classList = 'item-desc'
          itemDesc.innerHTML = `
            <button type="button" title="Remove item from cart?" class="btn cart-item-btn-remove"><i class="fas fa-times"></i></button>
            <p class="item-desc-title">${apiItem.title}</p>
            <p>$${apiItem.price}</p>
          `
          // Creating for pricing
          const pricing = document.createElement('div')
          pricing.classList = 'item-desc-pricing'
          pricing.innerHTML = `
            <label for="item-desc-quantity">Quantity:</label>
          `
          // Creating pricing input
          const quantity = document.createElement('input')
          quantity.classList = 'item-desc-quantity'
          quantity.type = 'number'
          quantity.min = '1'
          quantity.value = '1'

          // Creating total after quantity
          const total = document.createElement('p')
          total.classList = 'cart-item-total'
          total.innerHTML = `Total: <b>$${getItemTotalPrice()}</b>`

          // Listener for quantity
          quantity.addEventListener('click', () => {
            total.innerHTML = `Total: <b>$${getItemTotalPrice()}</b>`
          })

          // Calculating item total
          function getItemTotalPrice() {
            const fixedTotal = parseFloat(apiItem.price * quantity.value)

            item.dataset.price = fixedTotal.toFixed(2)
            return fixedTotal.toFixed(2)
          }

          // Appeding item description to item
          item.append(itemDesc)
          // Appending pricing for item description
          itemDesc.append(pricing)
          // Appending quantity and total to pricing
          pricing.append(quantity)
          pricing.append(total)

          cartItemsContent.insertAdjacentElement('beforeend', item)
        }
      })
    })
  }

  // Calculating cart overall total
  function getCartTotal() {
    let alltotal = document.querySelectorAll('.main-cart-content-items-item')
    // let cartTotal = [];
    let newTotal = 0
    alltotal.forEach((currItem) => {
      // Adding new item total to overall total
      newTotal += parseFloat(currItem.dataset.price)
    })
    // Setting new cart total
    cartItemsTotal.textContent = newTotal.toFixed(2)
  }

  // Creating stars
  function createStars(stars) {
    let totalStars = ''
    for (let star = 0; star < Math.round(stars); star++) {
      totalStars += `<i class="fas fa-star"></i>`
    }
    return totalStars
  }
})

// Load nav and footer every time page reload
mainNav.innerHTML = `
    <h3 class="logo">JaraMart</h3>
    <ul class="main-nav-link">
      <li><a href="#feature" class="navLinks">Features</a></li>
      <li><a href="#about" class="navLinks">About</a></li>
      <li><a href="#products" class="navLinks">Products</a></li>
      <li><a href="#testimonials" class="navLinks">Testimonials</a></li>
      <li><a href="#order" class="navLinks">Order</a></li>
    </ul>
    <div class="main-nav-widgets">
      <button type="button" class="btn" title="Search Dish"><i class="fas fa-search"></i></button>
      <button type="button" class="btn" title="Liked" id="likes-open-button"><i class="fas fa-heart"></i></button>
      <button type="button" class="btn" title="See Cart" id="cart-open-button"><i class="fas fa-shopping-cart"></i></button>
      <button type="button" class="btn" title="Toggle Mode" id="mode">Mode</button>
    </div>
`

mainFooter.innerHTML = `
  <div class="footer-contact">
    <div class="footer-contact-box">
      <i class="fas fa-phone-alt"></i>
      <span>
        <h3>(555) 555-5555</h3>
        <p>Mon-Fri 8am-10pm</p>
      </span>
    </div>
    <div class="footer-contact-box">
      <i class="fas fa-envelope"></i>
      <span>
        <h3>jaramart@gmail.com</h3>
        <p>Online support</p>
      </span>
    </div>
    <div class="footer-contact-box">
      <i class="fas fa-map-marked-alt"></i>
      <span>
        <h3>Laguna Philippines</h3>
        <p>Binan City Laguna, PH</p>
      </span>
    </div>
  </div>
  <div class="footer-socials">
    <p>Connect with us on Social Medias</p>
    <div class="footer-socials-icons">
      <a href="https://facebook.com" target="_blank"><i class="fab fa-facebook"></i></a>
      <a href="https://instagram.com" target="_blank"><i class="fab fa-instagram"></i></a>
      <a href="https://twitter.com" target="_blank"><i class="fab fa-twitter"></i></a>
    </div>
  </div>
  <div class="container">
    <div class="footer-links">
      <div>
        <h3>Company Name</h3>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati odio quos eius ratione maiores pariatur voluptas deleniti ducimus quod eum.</p>
      </div>
      <div>
        <h3>Products</h3>
        <ul>
          <li><a href="#">Lorem ipsum</a></li>
          <li><a href="#">Lorem ipsum</a></li>
          <li><a href="#">Lorem ipsum</a></li>
          <li><a href="#">Lorem ipsum</a></li>
        </ul>
      </div>
      <div>
        <h3>Useful Links</h3>
        <ul>
          <li><a href="#">Your Account</a></li>
          <li><a href="#">Create an Account</a></li>
          <li><a href="#">Become Affiliate</a></li>
          <li><a href="#">Help</a></li>
        </ul>
      </div>
      <div>
        <h3>Contact</h3>
        <ul>
          <li><a href="#">Lorem ipsum</a></li>
          <li><a href="#">Lorem ipsum</a></li>
          <li><a href="#">Lorem ipsum</a></li>
          <li><a href="#">Lorem ipsum</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="footer-copyright">
    <p>© Copyright 2021 <a href="#">Multi-purpose Company</a> | Created by <a href="https://facebook.com">Jaramiah</a></p>
  </div>
`

// Swiper JS
var swiper = new Swiper('.mySwiper', {
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
})
