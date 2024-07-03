// MARTILLO DE MENU
document.addEventListener("DOMContentLoaded", function () {
  const martilloToggle = document.getElementById("martilloToggle");
  const martilloIcon = document.getElementById("martilloIcon");
  const dropdownMenu = document.getElementById("dropdownMenu");

  let dropdownVisible = false;

  martilloToggle.addEventListener("click", function (event) {
    event.preventDefault();
    dropdownVisible = !dropdownVisible;

    dropdownMenu.classList.toggle("show", dropdownVisible);
    martilloIcon.classList.add("rotated");

    // Remover la clase "rotated" después de 0.5 segundos (la duración de la transición)
    setTimeout(function () {
      martilloIcon.classList.remove("rotated");
    }, 500);
  });
});

// PRODUCTOS DINAMICOS
document.addEventListener("DOMContentLoaded", function () {
  const productContainer = document.querySelector(".prod-cont .row");
  const categoryToLoad = productContainer.getAttribute("data-category");

  fetch("productos.json")
    .then((response) => response.json())
    .then((products) => {
      productContainer.innerHTML = ""; // Limpia el contenedor de productos antes de agregar nuevos

      // Filtrar los productos por la categoría especificada
      const filteredProducts = products.filter(
        (product) => product.category === categoryToLoad
      );

      filteredProducts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "col-sm-12 col-md-4 mb-5";

        productCard.innerHTML = `
          <div class="card">
            <img src="${product.image}" class="card-img-top p-absolute" alt="${
          product.name
        }">
            <div class="icon-cart-contain-inCard p-relative" onclick="addToCart(${
              product.id
            }, 1)">
              <img src="assets/iconos/bolsa-de-la-compra.png" alt="carrito" title="carrito" class="cart-inCard"/>
              <img src="assets/iconos/casco-vikingo (2).png" alt="casco-vikingo" title="carrito casco vikingo" class="overlay-icon-inCard"/>
            </div>
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">Precio: $${new Intl.NumberFormat(
                "es-ES"
              ).format(product.price)}</p>
              <button class="btn btn-primary" onclick="showProductDetails(${
                product.id
              })">Detalles</button>
            </div>
          </div>
        `;

        productContainer.appendChild(productCard);
      });

      // Actualizar el carrito desde el localStorage
      updateCart();
    })
    .catch((error) => console.error("Error al cargar los productos:", error));
});

// COMPLETAR MODAL DESCRIPTIVO CON DATOS DE CARD DINAMICAS
function showProductDetails(productId) {
  fetch("productos.json")
    .then((response) => response.json())
    .then((products) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        document.getElementById("productModalLabel").innerText = product.name;
        document.getElementById("productName").innerText = product.name;
        document.getElementById(
          "productIngredients"
        ).innerText = `Ingredientes: ${product.ingredients}`;
        document.getElementById(
          "productPrice"
        ).innerText = `Precio: $${new Intl.NumberFormat("es-ES").format(
          product.price
        )}`;

        const carouselInner = document.querySelector(
          "#productCarousel .carousel-inner"
        );
        const carouselIndicators = document.querySelector(
          "#productCarousel .carousel-indicators"
        );

        // Limpiar el contenido anterior
        carouselInner.innerHTML = "";
        carouselIndicators.innerHTML = "";

        // Añadir imágenes al carrusel
        const images = [
          product.image,
          product.image2,
          product.image3,
          product.image4,
        ].filter(Boolean); // Filtrar imágenes no definidas
        images.forEach((imgSrc, index) => {
          const isActive = index === 0 ? "active" : "";
          carouselInner.innerHTML += `
            <div class="carousel-item ${isActive}">
              <img src="${imgSrc}" class="d-block w-100" alt="${product.name}">
            </div>
          `;
          carouselIndicators.innerHTML += `
            <button type="button" data-bs-target="#productCarousel" data-bs-slide-to="${index}" class="${isActive}" aria-current="true" aria-label="Slide ${
            index + 1
          }"></button>
          `;
        });

        // Restablecer la cantidad a 1
        document.getElementById("quantity").value = 1;

        document
          .querySelector("#productModal button.btn-primary")
          .setAttribute(
            "onclick",
            `addToCart(${product.id}, document.getElementById('quantity').value)`
          );

        const productModal = new bootstrap.Modal(
          document.getElementById("productModal")
        );
        productModal.show();
      }
    })
    .catch((error) =>
      console.error("Error al cargar los detalles del producto:", error)
    );
}

// AGREGAR A CARRITO
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(productId, quantity = 1) {
  fetch("productos.json")
    .then((response) => response.json())
    .then((products) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        const existingProductIndex = cart.findIndex(
          (item) => item.id === product.id
        );
        if (existingProductIndex > -1) {
          // Actualizar cantidad si el producto ya está en el carrito
          cart[existingProductIndex].quantity += parseInt(quantity);
        } else {
          // Añadir nuevo producto al carrito
          const cartItem = {
            ...product,
            cartItemId: Date.now(),
            quantity: parseInt(quantity),
          };
          cart.push(cartItem);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
      }
    })
    .catch((error) => console.error("Error al agregar al carrito:", error));
}

function updateCart() {
  const cartContainer = document.querySelector(".cart-cont .row");
  cartContainer.innerHTML = "";

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "";

    cartItem.innerHTML = `
      <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${item.image}" class="card-img-top" alt="${item.name}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">Precio unitario: $${new Intl.NumberFormat(
                "es-ES"
              ).format(item.price)}</p>
              <p class="card-text">Cantidad: ${item.quantity}</p>
              <p class="card-text">Subtotal: $${new Intl.NumberFormat(
                "es-ES"
              ).format(item.price * item.quantity)}</p>
              <div class="input-group mb-3">
                <button class="btn btn-outline-secondary" type="button" onclick="updateItemQuantity(${
                  item.cartItemId
                }, -1)">-</button>
                <input type="text" class="form-control text-center" value="${
                  item.quantity
                }" disabled />
                <button class="btn btn-outline-secondary" type="button" onclick="updateItemQuantity(${
                  item.cartItemId
                }, 1)">+</button>
              </div>
              <button onclick="removeFromCart(${
                item.cartItemId
              })" class="btn btn-danger btn-sm">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    cartContainer.appendChild(cartItem);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelector(
    ".cart-total"
  ).innerText = `Total: $${new Intl.NumberFormat("es-ES").format(total)}`;
  document.querySelector(".cart-count").innerText = totalQuantity;
}

function removeFromCart(cartItemId) {
  cart = cart.filter((item) => item.cartItemId !== cartItemId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function updateItemQuantity(cartItemId, change) {
  const itemIndex = cart.findIndex((item) => item.cartItemId === cartItemId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += change;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  }
}

// Incrementar y decrementar cantidad en el modal
document.addEventListener("click", function (event) {
  if (event.target && event.target.id === "incrementQuantity") {
    let quantityInput = document.getElementById("quantity");
    quantityInput.value = parseInt(quantityInput.value) + 1;
  }

  if (event.target && event.target.id === "decrementQuantity") {
    let quantityInput = document.getElementById("quantity");
    if (parseInt(quantityInput.value) > 1) {
      quantityInput.value = parseInt(quantityInput.value) - 1;
    }
  }
});

// BUSQUEDA DE PRODUCTOS EN NAVBAR
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchSuggestions = document
    .getElementById("searchSuggestions")
    .querySelector(".list-group");

  // Función para cargar los productos desde productos.json
  function loadProducts(callback) {
    fetch("productos.json")
      .then((response) => response.json())
      .then((data) => {
        callback(data);
      })
      .catch((error) => console.error("Error al cargar productos:", error));
  }

  // Función para mostrar las sugerencias de búsqueda
  function showSuggestions(products, searchTerm) {
    searchSuggestions.innerHTML = "";

    if (searchTerm.length === 0) {
      searchSuggestions.style.display = "none";
      return;
    }

    const matches = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );

    if (matches.length > 0) {
      matches.forEach((match) => {
        const suggestion = document.createElement("li");
        suggestion.classList.add("list-group-item");
        suggestion.innerHTML = `
          <a href="${match.url}" class="nav-link-search">
            <div class="row">
              <div class="col-auto">
                <img src="${match.image}" alt="${match.name}" class="img-fluid" style="max-width: 100px;">
              </div>
              <div class="col">
                <h6 class="card-title">${match.name}</h6>
                <p class="card-text">$${match.price}</p>
              </div>
            </div>
          </a>
        `;
        searchSuggestions.appendChild(suggestion);
      });
      searchSuggestions.style.display = "block";
    } else {
      searchSuggestions.style.display = "none";
    }
  }

  // Función para manejar la visibilidad de las sugerencias
  function handleVisibility() {
    if (searchInput.value.trim().length > 0) {
      searchSuggestions.parentElement.style.display = "block";
    } else {
      searchSuggestions.parentElement.style.display = "none";
    }
  }

  // Escuchar cambios en el campo de búsqueda
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim().toLowerCase();

    loadProducts(function (products) {
      showSuggestions(products, searchTerm);
      handleVisibility();
    });
  });

  // Mostrar sugerencias al hacer clic en el input
  searchInput.addEventListener("focus", function () {
    handleVisibility();
  });

  // Ocultar sugerencias cuando se hace clic fuera del input o las sugerencias
  document.addEventListener("click", function (event) {
    if (
      !searchInput.contains(event.target) &&
      !searchSuggestions.contains(event.target)
    ) {
      searchSuggestions.parentElement.style.display = "none";
    }
  });
});
