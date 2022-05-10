const PRODUCT_ID = new URL(document.URL).searchParams.get("id");

fetch(`http://localhost:3000/api/products/${PRODUCT_ID}`)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(value) {
        addProductInfoToPage(value);
    })
    .catch(function() {
        console.log("Something went wrong with the request to get the product info from the API");
    });

function addProductInfoToPage(sofa) {
    addProductImageToPage(sofa.imageUrl, sofa.altTxt);
    addProductNameToPage(sofa.name);
    addProductPriceToPage(sofa.price);
    addProductDescriptionToPage(sofa.description);
    addProductColorsToPage(sofa.colors);
}

function addProductImageToPage(url, alt) {
    let picture = document.createElement("img");
    picture.setAttribute("src", url);
    picture.setAttribute("alt", alt);

    document
    .querySelector("div.item__img")
    .appendChild(picture);
}

function addProductNameToPage(name) {
    document
    .getElementById("title")
    .textContent = `${name}`;
}

function addProductPriceToPage(price) {
    document
    .getElementById("price")
    .textContent = `${price}`;
}

function addProductDescriptionToPage(description) {
    document
    .getElementById("description")
    .textContent = `${description}`;
}

function addProductColorsToPage(colors) {
    let colorList = document.getElementById("colors");
    for (let color of colors) {
        let colorOption = document.createElement("option");
        colorOption.setAttribute("value", color);
        colorOption.textContent = color;
        colorList
        .appendChild(colorOption);
    }
}

let quantityWarningMessage = document.createElement("div");
quantityWarningMessage.setAttribute("style", "color: darkorange;");
document
        .querySelector("div.item__content__settings__quantity")
        .appendChild(quantityWarningMessage);

let quantity = document.getElementById("quantity");
quantity.addEventListener("change", function(event) {
    if (!/^-?[0-9]+$/.test(event.target.value)) { //Modifier pour rejeter directement les entrées utilisateur invalides
        displayWarningMessage("Veuillez entrer un nombre entier");
    }
    else if ((event.target.value < 1) || (event.target.value > 100)) {
        displayWarningMessage("Veuillez entrer une quantité entre 1 et 100");
    }
    else {
        removeWarningMessage();
    }
});

function displayWarningMessage(messageToDisplay) {
    quantityWarningMessage.textContent = messageToDisplay;
    setTimeout(function() {
        removeWarningMessage();
    }, 5000);
}

function removeWarningMessage() {
    quantityWarningMessage.textContent = "";
}

let addToCartButton = document.getElementById("addToCart");
addToCartButton.addEventListener("click", function(){
    let productInfo = readFormInfo();
    let formIsValid = validateProductForm(productInfo);
    if (formIsValid) {
        let cart = addProductToCart(productInfo);
        saveCart(cart);
        displayConfirmationMessage(`Le canapé a été ajouté à votre panier en ${productInfo.quantity} exemplaire(s) couleur ${productInfo.color}.`);
    }
});

function readFormInfo() {
    let id = PRODUCT_ID;
    let color = document.getElementById("colors").value;
    let quantity = document.getElementById("quantity").value;

    return {id, color, quantity};
}

function validateProductForm(product) {
    if (product.color === "") {
        displayErrorMessage("Votre produit n'a pas pu être ajouté au panier car vous n'avez pas choisi de couleur");
        return false;
    }
    else if (!/^[0-9]+$/.test(product.quantity) || product.quantity < 1 || product.quantity > 100) {
        displayErrorMessage("Votre produit n'a pas pu être ajouté au panier. La quantité doit être un nombre entier entre 1 et 100.");
        return false;
    }
    else {
        return true;
    }
}

function displayErrorMessage(messageToDisplay) {
    let container = document.querySelector(".item__content");
    let errorMessage = document.createElement("div");
    errorMessage.setAttribute("style", "margin-top: 15px; text-align: center; color: rgb(150, 0, 0);");
    errorMessage.textContent = messageToDisplay;
    container.appendChild(errorMessage);
    setTimeout(function() {
        container.removeChild(errorMessage);
    },
    5000);
}

function addProductToCart(product) {
    let cart = getCart();
    let productIsAlreadyInCart = checkIfProductIsAlreadyInCart(product, cart);
    if (productIsAlreadyInCart) {
        cart = updateProductQuantity(product, cart);
    }
    else {
        cart.push(product);
    }
    
    return cart;
}

function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    }
    else {
        return JSON.parse(cart);
    }
}

function checkIfProductIsAlreadyInCart(product, cart) {
    for (let item of cart) {
        if (item.id === product.id && item.color === product.color) {
            return true;
        }
    }
    return false;
}

function updateProductQuantity(product, cart) {
    for (let item of cart) {
        if (item.id === product.id && item.color === product.color) { /*** Code répété ! A refactoriser/améliorer ***/
            let sum = Math.min(100, parseInt(item.quantity, 10) + parseInt(product.quantity, 10));
            displayWarningMessage("La quantité totale de ce produit dans le panier a été limitée à 100.")
            item.quantity = sum.toString();
            return cart;
        }
    }
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function displayConfirmationMessage(messageToDisplay) {
    let container = document.querySelector(".item__content");
    let confirmationMessage = document.createElement("div");
    confirmationMessage.setAttribute("style", "margin-top: 15px; text-align: center; color: rgb(0, 120, 0);");
    confirmationMessage.textContent = messageToDisplay;
    container.appendChild(confirmationMessage);
    setTimeout(function() {
        container.removeChild(confirmationMessage);
    },
    5000);
}