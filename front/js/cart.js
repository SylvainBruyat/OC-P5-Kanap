let cartItemsSection = document.getElementById("cart__items");
let cart = JSON.parse(localStorage.getItem("cart"));
let totalQuantity = 0;
let totalPrice = 0;

for (let product of cart) {
    addProductToCartPage(product);
}

function addProductToCartPage(productFromLocalStorage) {
    fetch(`http://localhost:3000/api/products/${productFromLocalStorage.id}`)
    .then(function(response) {
        if (response.ok)
            return response.json();
    })
    .then(function(productFromAPI) {
        addProductInfoToCartPage(productFromLocalStorage, productFromAPI);
        displayTotalQuantityAndPrice(productFromLocalStorage.quantity, productFromAPI.price);
    })
    .catch(function() {
        console.log("Something went wrong with the request to get the product info from the API");
    });
    
}

function addProductInfoToCartPage(productFromLocalStorage, productFromAPI) {
    let cartItems = document.getElementById("cart__items");
    cartItems.innerHTML += `
        <article class="cart__item" data-id="${productFromLocalStorage.id}" data-color="${productFromLocalStorage.color}">
            <div class="cart__item__img">
                <img src="${productFromAPI.imageUrl}" alt="${productFromAPI.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                <h2>${productFromAPI.name}</h2>
                <p>${productFromLocalStorage.color}</p>
                <p>${productFromAPI.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productFromLocalStorage.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                </div>
                </div>
            </div>
        </article>
    `;
}

function displayTotalQuantityAndPrice(quantity, price) {
    totalQuantity += Number.parseInt(quantity);
    totalPrice += (price * quantity);
    document
        .getElementById("totalQuantity")
        .textContent = totalQuantity;
    document
        .getElementById("totalPrice")
        .textContent = totalPrice;
}