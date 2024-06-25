// document.addEventListener("DOMContentLoaded", function () {
//   const dropdownToggle = document.querySelector(".nav-item.dropdown a");
//   const dropdownMenu = document.querySelector(".dropdown-menu");

//   dropdownToggle.addEventListener("click", function (event) {
//     event.preventDefault();
//     dropdownMenu.classList.toggle("show");
//   });

//   const offcanvasElementList = [].slice.call(
//     document.querySelectorAll(".offcanvas")
//   );
//   const offcanvasList = offcanvasElementList.map(function (offcanvasEl) {
//     return new bootstrap.Offcanvas(offcanvasEl);
//   });

//   offcanvasList.forEach((offcanvas) => {
//     offcanvas._element.addEventListener("hide.bs.offcanvas", function () {
//       dropdownMenu.classList.remove("show");
//     });
//   });
// });

// function handleToggleDropdown() {
//   const dropdownMenu = document.querySelector(".dropdown-menu");
//   dropdownMenu.classList.toggle("show");
// }

// MARTILLO DE MENU

document.addEventListener("DOMContentLoaded", function () {
  const martilloToggle = document.getElementById("martilloToggle");
  const martilloIcon = document.getElementById("martilloIcon");
  const dropdownMenu = document.getElementById("dropdownMenu");

  let dropdownVisible = false;
  let martilloRotated = false;

  martilloToggle.addEventListener("click", function (event) {
    event.preventDefault();
    dropdownVisible = !dropdownVisible;
    martilloRotated = !martilloRotated;

    dropdownMenu.classList.toggle("show", dropdownVisible);
    martilloIcon.classList.toggle("rotated", martilloRotated);
  });
});
