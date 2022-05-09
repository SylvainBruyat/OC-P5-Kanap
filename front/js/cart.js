let CART = JSON.parse(localStorage.getItem("cart"));
let TOTAL_QUANTITY = 0;
let TOTAL_PRICE = 0;

for (let product of CART) {
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
    TOTAL_QUANTITY += Number.parseInt(quantity, 10);
    TOTAL_PRICE += (price * quantity);
    document
        .getElementById("totalQuantity")
        .textContent = TOTAL_QUANTITY;
    document
        .getElementById("totalPrice")
        .textContent = TOTAL_PRICE;
}

function productQuantityUpdate(modifiedQuantityField) {
    let status = validateNewQuantity(modifiedQuantityField);
    if (status.isQuantityValid === false) {
        rejectNewQuantity(modifiedQuantityField);
    }
    else if (status.isQuantityInRange === false) {
        //afficher message d'information dans le DOM sur la quantité ramenée entre 1 et 100;
        let modifiedProduct = findCorrespondingProduct(modifiedQuantityField);
        let deltaQuantity = quantityUpdate(modifiedProduct, modifiedQuantityField.value);
        let productPrice = parseInt(modifiedProduct.querySelector(".cart__item__content__description p:nth-of-type(2)").textContent, 10);
        displayTotalQuantityAndPrice(deltaQuantity, productPrice);
    }
    else { //Code répété avec le else if. A refactoriser
        let modifiedProduct = findCorrespondingProduct(modifiedQuantityField);
        let deltaQuantity = quantityUpdate(modifiedProduct, modifiedQuantityField.value);
        let productPrice = parseInt(modifiedProduct.querySelector(".cart__item__content__description p:nth-of-type(2)").textContent, 10);
        displayTotalQuantityAndPrice(deltaQuantity, productPrice);
    }
}

function validateNewQuantity(modifiedQuantityField) {
    if (!/^[0-9]+$/.test(modifiedQuantityField.value)) {
        return {
            isQuantityValid: false,
            isQuantityInRange: false
        }
    }
    else if ((modifiedQuantityField.value < 1) || (modifiedQuantityField.value > 100)) {
        modifiedQuantityField.value = Math.max(1, Math.min(100, modifiedQuantityField.value));
        return {
            isQuantityValid: true,
            isQuantityInRange: false
        }
    }
    else {
        return {
            isQuantityValid: true,
            isQuantityInRange: true
        }
    }
}

function rejectNewQuantity(modifiedQuantityField) {
    let modifiedProduct = findCorrespondingProduct(modifiedQuantityField);
    let productInCart = CART.find(p => (p.id == modifiedProduct.dataset.id) && (p.color == modifiedProduct.dataset.color));
    modifiedQuantityField.value = productInCart.quantity;
    //ajouter un message d'erreur dans le DOM
}

function findCorrespondingProduct(clickedElement) {
    return modifiedProduct = clickedElement.closest("article");
}

function quantityUpdate(modifiedProduct, newQuantity) {
    let productInCart = CART.find(p => (p.id == modifiedProduct.dataset.id) && (p.color == modifiedProduct.dataset.color));
    let deltaQuantity = newQuantity - productInCart.quantity;
    productInCart.quantity = newQuantity;
    saveCart(CART);
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
    CART = CART.filter(p => !((p.id == modifiedProduct.dataset.id) && (p.color == modifiedProduct.dataset.color)));
    saveCart(CART);
    removePageContent(modifiedProduct);
}

function removePageContent(modifiedProduct) {
    let productContainer = modifiedProduct.closest("section");
    productContainer.removeChild(modifiedProduct);
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}