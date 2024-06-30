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
  const categoryToLoad = "A"; 

  fetch("productos.json")
    .then((response) => response.json())
    .then((products) => {
      const productContainer = document.querySelector(".prod-cont .row");
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
              })">
                     <img src="assets/iconos/bolsa-de-la-compra.png"
                      alt="carrito"title="carrito" class="cart-inCard"/>
                    <img
                      src="assets/iconos/casco-vikingo (2).png"
                      alt="casco-vikingo"
                      title="carrito casco vikingo"
                      class="overlay-icon-inCard"
                    />
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
        carouselInner.innerHTML = `
          <div class="carousel-item active">
            <img src="${product.image}" class="d-block w-100 " alt="${product.name}">
          </div>
          <div class="carousel-item">
            <img src="${product.image2}" class="d-block w-100 " alt="${product.name}">
          </div>
          <div class="carousel-item">
            <img src="${product.image3}" class="d-block w-100 " alt="${product.name}">
          </div>
          <div class="carousel-item">
            <img src="${product.image4}" class="d-block w-100 " alt="${product.name}">
          </div>
        `;

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

function addToCart(productId) {
  fetch("productos.json")
    .then((response) => response.json())
    .then((products) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        const cartItem = { ...product, cartItemId: Date.now() };
        cart.push(cartItem);
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
              <p class="card-text">$${new Intl.NumberFormat("es-ES").format(
                item.price
              )}</p>
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

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.querySelector(
    ".cart-total"
  ).innerText = `Total: $${new Intl.NumberFormat("es-ES").format(total)}`;
  document.querySelector(".cart-count").innerText = cart.length;
}

function removeFromCart(cartItemId) {
  cart = cart.filter((item) => item.cartItemId !== cartItemId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}
