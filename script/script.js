const cardPlantContainer = document.getElementById("card-plant-container");
const categoryContainer = document.getElementById("category-container");
const bookmarkContainer = document.getElementById("bookmark-container");
const balanceContainer = document.getElementById("balance-container");
const totalBalance = document.getElementById("total-balance");
const modalContainer = document.getElementById("show_my_modal");
const loading = document.getElementById("loading-spinner");

// all plants
const loadAllPlants = async () => {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await res.json();
    displayAllPlants(data.plants);
  } catch (error) {
    console.log(error.message);
  }
};
// all plants display
const displayAllPlants = (plants) => {
  cardPlantContainer.textContent = "";
  plants.forEach((plant) => {
    cardPlantContainer.innerHTML += `
     <div class="card bg-base-100 max-h-96 shadow-sm">
                <figure>
                  <img
                    class=""
                    src="${plant.image}"
                    alt="Shoes"
                  />
                </figure>
                <div class="space-y-2 p-4">
                  <h2 onclick="show_my_modal.showModal();
                  handleShowDetails(${plant.id})
                  "
                   class="text-xl font-medium">${plant.name}</h2>
                  <p title="${plant.description}" class="text-para">
                    ${
                      plant.description.length < 75
                        ? plant.description
                        : plant.description.slice(0, 75) + "... "
                    }
                  </p>
                  <div class="flex items-center justify-between">
                    <button class="bg-[#dcfce7] text-primary px-6  py-1.5 font-geist rounded-full mt-2">${
                      plant.category
                    }</button>
                    <p class="text-para text-xl">৳<span>${plant.price}</spna>
                  </p>
                  </div>
                  <div>
                    <button 
                    id="${plant.id}"
                    class="bg-primary w-full text-secondary px-4 py-1 rounded-full mt-2">Add to Cart</button>
                  </div>
                </div>
              </div>
    `;
  });
  loadingSpinner(true);
};
// tree categories
const loadTreeCategories = async () => {
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/categories"
    );
    const data = await res.json();
    displayCategories(data.categories);
  } catch (error) {
    console.log(error.message);
  }
};

// romoveCategoryBackgroundColor
const romoveCategoryBackgroundColor = () => {
  const categoryBtn = document.querySelectorAll(".category-btn");
  categoryBtn.forEach((category) => {
    category.classList.remove("bg-primary", "text-white");
  });
};
// loading spinner showing
const loadingSpinner = (spinner) => {
  if (spinner) {
    loading.classList.add("hidden");
  } else {
    loading.classList.remove("hidden");
  }
};

// display tree categories
const loadSinglePlantCategory = async (id) => {
  loadingSpinner(false);
  romoveCategoryBackgroundColor();
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/category/${id}`
    );
    const data = await res.json();
    displayAllPlants(data.plants);

    const categoryId = document.getElementById(`category-${id}`);
    categoryId.classList.add("bg-primary", "text-white");
  } catch (error) {
    console.log(error.message);
  }
};

const displayCategories = (categories) => {
  categories.forEach((c) => {
    categoryContainer.innerHTML += `
    <ul><li 
    onclick="loadSinglePlantCategory('${c.id}')"
    id="category-${c.id}" 
    class="category-btn py-1 cursor-pointer w-48 md:w-full px-3 hover:bg-primary rounded hover:font-medium hover:text-white text-para">${c.category_name}</li></ul>
    `;
  });
};

let addTocart = [];
cardPlantContainer.addEventListener("click", (e) => {
  if (e.target.innerText === "Add to Cart") {
    addToCartPlants(e);
  }
});
const addToCartPlants = (e) => {
  const id = e.target.id;
  const name = e.target.parentNode.parentNode.children[0].innerText;
  const price =
    e.target.parentNode.parentNode.children[2].children[1].children[0]
      .innerText;
  if (name && price && id) {
    addTocart.push({ name, price, id });
    alert(`${name} has been added to the cart.`);
  }
  displayBookmarkPlant(addTocart);
};

const displayBookmarkPlant = (plants) => {
  let total = 0;
  bookmarkContainer.textContent = "";
  if (plants.length === 0) {
    balanceContainer.textContent = "";
    return;
  }
  plants.forEach((plant) => {
    bookmarkContainer.innerHTML += `
      <div class="bg-[#f0fdf4] border border-[#f0fdf4] rounded">
        <div class="m-2 p-2 flex items-center justify-between">
          <div class="space-y-1">
            <h2 class="text-sm font-semibold">${plant.name}</h2>
            <p class="text-para">৳${plant.price}</p>
          </div>
          <i onclick="handlDeleteBookmark('${plant.id}')" class="fa-solid fa-xmark cursor-pointer text-para hover:text-red-600"></i>
        </div>
      </div>
    `;
    total += Number(plant.price);
  });
    balanceContainer.innerHTML = `
      <hr class="mt-2" />
      <p class="flex items-center justify-between mt-2 px-2 text-xl">
        Total: <span id="total-balance"></span>
      </p>
    `;
  document.getElementById("total-balance").innerText = `৳${total}`;
};

const handlDeleteBookmark = (id) => {
  const filterId = addTocart.filter((a) => a.id !== id);
  addTocart = filterId;
  displayBookmarkPlant(addTocart);
};

const handleShowDetails = async (id) => {
  console.log(id);
  const res = await fetch(
    `https://openapi.programming-hero.com/api/plant/${id}`
  );
  const data = await res.json();
  displayShowDetails(data.plants);
};

const displayShowDetails = (plant) => {
  console.log(plant);
  modalContainer.textContent = "";
  modalContainer.innerHTML = `
  <div class="modal-box space-y-2">
                  <h3 class="text-2xl font-medium">${plant.name}</h3>
                  <img class="h-64 w-full object-cover" src="${plant.image}" alt="">
                  <p class="text-lg font-medium">
                    Category: <span class="text-para font-normal text-base">${plant.category}</span>
                  </p>
                  <p class="text-lg font-medium">
                    Price: <span class="text-para font-normal text-base">${plant.price}</span>
                  </p>
                  <p class="text-lg font-medium">Description: <span class="text-para font-normal text-base">${plant.description}</span></p>
                  <div class="modal-action">
                    <form method="dialog">
                      <!-- if there is a button in form, it will close the modal -->
                      <button class="btn border px-3">Close</button>
                    </form>
                  </div>
                </div>
  `;
};

loadAllPlants();
loadTreeCategories();

// navbar drawer mobile responsive click menu
const drawer = document.getElementById("my-drawer");
const openBtn = document.getElementById("open-btn");
const closeBtn = document.getElementById("close-btn");

// Drawer Open
openBtn.addEventListener("click", () => {
  drawer.checked = true;
});

// Drawer Close
closeBtn.addEventListener("click", () => {
  drawer.checked = false;
});
