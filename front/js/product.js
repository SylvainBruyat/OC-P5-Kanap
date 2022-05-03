let productID = new URL(document.URL).searchParams.get("id");

fetch(`http://localhost:3000/api/products/${productID}`)
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

let quantityErrorMessage = document.createElement("div");
document
        .querySelector("div.item__content__settings__quantity")
        .appendChild(quantityErrorMessage);

let quantity = document.getElementById("quantity");
quantity.addEventListener("change", function(event) {
    if (!/^-*[0-9]+$/.test(event.target.value)) {
        displayNotANumberErrorMessage();
    }
    else if ((event.target.value < 1) || (event.target.value > 100)) {
        displayValueRangeErrorMessage();
    }
    else {
        removeErrorMessage();
    }
});

function removeErrorMessage() {
    quantityErrorMessage.textContent = ""; //Action sur une variable hors scope. A améliorer ?
}

function displayNotANumberErrorMessage() {
    quantityErrorMessage.textContent = "Veuillez entrer un nombre entier"; //Action sur une variable hors scope. A améliorer ?
}

function displayValueRangeErrorMessage() {
    quantityErrorMessage.textContent = "Veuillez entrer une quantité entre 1 et 100"; //Action sur une variable hors scope. A améliorer ?
}

let addToCartButton = document.getElementById("addToCart");
addToCartButton.addEventListener("click", function(){
    let productInfo = readFormInfo();
    let formIsValid = validateProductForm(productInfo);
    if (formIsValid) {
        let cart = addProductToCart(productInfo);
        saveCart(cart);
    }
});

function validateProductForm(product) {
    if (product.color === "") {
        alert("Votre produit n'a pas pu être ajouté au panier car vous n'avez pas choisi de couleur");
        return false;
    }
    else if (product.quantity === "" || product.quantity < 1 || product.quantity > 100 || parseInt(product.quantity) != parseFloat(product.quantity)) {
        alert("Votre produit n'a pas pu être ajouté au panier. La quantité doit être un nombre entier entre 1 et 100.");
        return false;
    }
    else {
        return true;
    }
}

function readFormInfo() {
    let id = productID;
    let color = document.getElementById("colors").value;
    let quantity = document.getElementById("quantity").value;

    return {id, color, quantity};
}

function addProductToCart(product) {
    let cart = getCart();
    let productAlreadyInCart = checkIfProductAlreadyInCart(product, cart);
    if (productAlreadyInCart) {
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

function checkIfProductAlreadyInCart(product, cart) {
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
            let sum = parseInt(item.quantity) + parseInt(product.quantity);
            item.quantity = sum.toString();
            return cart;
        }
    }
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}