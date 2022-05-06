let cartItemsSection = document.getElementById("cart__items"); //Non-utilisé - A supprimer une fois le code terminé si toujours non-utilisé
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
        insertEventListeners();
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

function insertEventListeners() {
    let quantityFields = document.getElementsByClassName("itemQuantity");
    let deleteButtons = document.getElementsByClassName("deleteItem");
    for (let field of quantityFields) {
        field.addEventListener("change", function(event) {
            productQuantityUpdate(event.target);
        });
    }
    for (let button of deleteButtons) {
        button.addEventListener("click", function(event) {
            removeProductFromBasket(event.target);
        })
    }
}

function displayTotalQuantityAndPrice(quantity, price) {
    totalQuantity += Number.parseInt(quantity, 10);
    totalPrice += (price * quantity);
    document
        .getElementById("totalQuantity")
        .textContent = totalQuantity;
    document
        .getElementById("totalPrice")
        .textContent = totalPrice;
}

function productQuantityUpdate(modifiedQuantityField) {
    let modifiedProduct = findCorrespondingProduct(modifiedQuantityField);
    let deltaQuantity = quantityUpdate(modifiedProduct, modifiedQuantityField.value);
    let productPrice = parseInt(modifiedProduct.querySelector(".cart__item__content__description p:nth-of-type(2)").textContent, 10);
    displayTotalQuantityAndPrice(deltaQuantity, productPrice);
}

function findCorrespondingProduct(clickedElement) {
    return modifiedProduct = clickedElement.closest("article");
}

function quantityUpdate(modifiedProduct, newQuantity) {
    let productInCart = cart.find(p => (p.id == modifiedProduct.dataset.id) && (p.color == modifiedProduct.dataset.color));
    let deltaQuantity = newQuantity - productInCart.quantity;
    productInCart.quantity = newQuantity;
    saveCart(cart);
    return deltaQuantity;
}

function removeProductFromBasket(clickedButton) {
    let modifiedProduct = findCorrespondingProduct(clickedButton);
    let removedQuantityAndPrice = findRemovedQuantityAndPrice(modifiedProduct);
    deleteProduct(modifiedProduct);
    displayTotalQuantityAndPrice(removedQuantityAndPrice.quantity, removedQuantityAndPrice.price);
}

function findRemovedQuantityAndPrice(modifiedProduct) {
    let quantity = -(modifiedProduct.querySelector(".itemQuantity").value);
    let price = parseInt(modifiedProduct.querySelector(".cart__item__content__description p:nth-of-type(2)").textContent, 10);
    return {
        quantity,
        price
    }
}

function deleteProduct(modifiedProduct) {
    cart = cart.filter(p => !((p.id == modifiedProduct.dataset.id) && (p.color == modifiedProduct.dataset.color)));
    saveCart(cart);
    removePageContent(modifiedProduct);
}

function removePageContent(modifiedProduct) {
    let productContainer = modifiedProduct.closest("section");
    productContainer.removeChild(modifiedProduct);
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}