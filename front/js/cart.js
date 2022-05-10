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
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        insertEventListeners(); //TODO Est appelé une fois par produit de la page donc crée de multiples event listeners. A corriger.
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    let submitButton = document.getElementById("order");
    
    for (let field of quantityFields) {
        field.addEventListener("change", function(event) {
            event.stopImmediatePropagation(); //TODO Vérifier si toujours utile après que le problème de création d'event listener est corrigé
            productQuantityUpdate(event.target);            
        });
    }

    for (let button of deleteButtons) {
        button.addEventListener("click", function(event) {
            event.stopImmediatePropagation(); //TODO Vérifier si toujours utile après que le problème de création d'event listener est corrigé
            removeProductFromBasket(event.target);
        })
    }

    submitButton.addEventListener("click", function(event) {
        event.stopImmediatePropagation(); //TODO Vérifier si toujours utile après que le problème de création d'event listener est corrigé
        event.preventDefault();
        sendOrder();
    });
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
        //TODO Afficher message d'information dans le DOM sur la quantité ramenée entre 1 et 100;
        let modifiedProduct = findCorrespondingProduct(modifiedQuantityField);
        let deltaQuantity = quantityUpdate(modifiedProduct, modifiedQuantityField.value);
        let productPrice = parseInt(modifiedProduct.querySelector(".cart__item__content__description p:nth-of-type(2)").textContent, 10);
        displayTotalQuantityAndPrice(deltaQuantity, productPrice);
    }
    else { //TODO Code répété avec le else if. A refactoriser
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
    //TODO Ajouter un message d'erreur dans le DOM
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

function sendOrder() {
    let isFormValid = validateOrderForm();
    if (isFormValid) {
        let requestBody = createOrderData(CART);
        postOrderRequest(requestBody);
    }
    
}

function validateOrderForm() { //TODO Fonction très longue. Voir pour la refactoriser
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let email = document.getElementById("email").value;

    let firstNameIsValid = true;
    let lastNameIsValid = true;
    let addressIsValid = true;
    let cityIsValid = true;
    let emailIsValid = true;

    if(!/^[\p{L} -]+$/u.test(firstName)) {
        document
            .getElementById("firstNameErrorMsg")
            .textContent = "Veuillez saisir un prénom uniquement composé de lettres, espaces et tirets";
        firstNameIsValid = false;
    }
    else {
        document
            .getElementById("firstNameErrorMsg")
            .textContent = "";
    }

    if(!/^[\p{L} -]+$/u.test(lastName)) {
        document
            .getElementById("lastNameErrorMsg")
            .textContent = "Veuillez saisir un nom de famille uniquement composé de lettres, espaces et tirets";
        lastNameIsValid = false;
    }
    else {
        document
            .getElementById("lastNameErrorMsg")
            .textContent = "";
    }

    if(!/^[\p{L}\d ,.-]+$/u.test(address)) {
        document
            .getElementById("addressErrorMsg")
            .textContent = "Veuillez saisir une adresse uniquement composée de chiffres, lettres, espaces, virgules, points et tirets";
        addressIsValid = false;
    }
    else {
        document
            .getElementById("addressErrorMsg")
            .textContent = "";
    }

    if(!/^[\p{L} -]+$/u.test(city)) {
        document
            .getElementById("cityErrorMsg")
            .textContent = "Veuillez saisir un nom de ville uniquement composé de lettres, espaces et tirets";
        cityIsValid = false;
    }
    else {
        document
            .getElementById("cityErrorMsg")
            .textContent = "";
    }

    if(!/^[\w.-]*@[\w]*.[a-zA-Z]{2,}$/.test(email)) {
        document
            .getElementById("emailErrorMsg")
            .textContent = "Veuillez saisir une adresse email valide sans caractères accentués (format : adresse._-@exemple.xyz)";
        emailIsValid = false;
    }
    else {
        document
            .getElementById("emailErrorMsg")
            .textContent = "";
    }
    return (firstNameIsValid && lastNameIsValid && addressIsValid && cityIsValid && emailIsValid);
}

function createOrderData(cart) {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let email = document.getElementById("email").value;
    let contact = {
        "firstName": firstName,
        "lastName": lastName,
        "address": address,
        "city": city,
        "email": email
    }

    let products = []; //Mieux d'utiliser une méthode .map() ?
    for (let product of cart) {
        products.push(product.id);
    }

    return {contact, products};
}

function postOrderRequest(requestBody) {
    fetch("http://localhost:3000/api/products/order/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(requestBody),
    })
    .then(function(response) {
        if (response.status == 201)
            return response.json();
    })
    .then(function(data) {
        window.location = `./confirmation.html?orderid=${data.orderId}`;
    })
    .catch(function() {
        console.log("The order could not be processed by the API. Please verify the content of the POST request");
    });
}