let CART_ITEMS_SECTION = document.getElementById("cart__items");
let CART = JSON.parse(localStorage.getItem("cart")) ?? [];
let TOTAL_PRICE = 0;
let TOTAL_QUANTITY = 0;

if (CART.length === 0) {
    displayEmptyCartMessage();
}
else {
    displayProducts(CART);
}

function displayEmptyCartMessage() {
    let container = document.getElementById("cartAndFormContainer");
    let nextChild = document.querySelector(".cart");
    let emptyCartMessage = document.createElement("div");
    emptyCartMessage.innerHTML = `
        <p style="text-align: center;">Votre panier est vide.</p>
        <p style="text-align: center; margin-bottom: 40px;">
            N'hésitez pas à consulter notre 
            <a href="./index.html" style="color: white;" onMouseOver="this.style.fontWeight='bold'" onMouseOut="this.style.fontWeight='normal'">
            page d'accueil</a>
             pour voir tous nos produits.
        </p>
    `;
    container.insertBefore(emptyCartMessage, nextChild);
}

async function displayProducts(products) {
    CART_ITEMS_SECTION.innerHTML = ``;

    try {
        for (let cartProduct of products) {
            let apiProduct = await fetch(`http://localhost:3000/api/products/${cartProduct.id}`)
            .then(response => response.json());
            CART_ITEMS_SECTION.innerHTML += `
                <article class="cart__item" data-id="${cartProduct.id}" data-color="${cartProduct.color}">
                    <div class="cart__item__img">
                        <img src="${apiProduct.imageUrl}" alt="${apiProduct.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${apiProduct.name}</h2>
                            <p>${cartProduct.color}</p>
                            <p>${apiProduct.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartProduct.quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>
            `;
            displayTotalPriceAndQuantity(apiProduct.price, cartProduct.quantity);
        }

        let deleteButtons = document.getElementsByClassName("deleteItem");
        for (let button of deleteButtons) {
            button.addEventListener("click", removeProduct);
        }
        let quantityInputs = document.getElementsByClassName("itemQuantity");
        for (let input of quantityInputs) {
            input.addEventListener("change", quantityChange);
        }
    }
    catch (error) {
        console.log(error);
    }
}

function displayTotalPriceAndQuantity(price, quantity) {
    TOTAL_PRICE += (price * quantity);
    TOTAL_QUANTITY += Number.parseInt(quantity, 10);
    document.getElementById("totalPrice").textContent = TOTAL_PRICE;
    document.getElementById("totalQuantity").textContent = TOTAL_QUANTITY;
}

function removeProduct(event) {
    let targetItem = event.target.closest("article");
    CART = CART.filter(p => !((p.id == targetItem.dataset.id) && (p.color == targetItem.dataset.color)));
    localStorage.setItem("cart", JSON.stringify(CART));
    displayProducts(CART); //Remplacer par un removeChild pour éviter de tout réafficher ?
}

function quantityChange(event) {
    let targetItem = event.target.closest("article");
    for (let product of CART) {
        if (product.id == targetItem.dataset.id && product.color == targetItem.dataset.color) {
            let deltaQuantity = event.target.value - product.quantity;
            product.quantity = event.target.value;
            let productPrice = parseInt(targetItem.querySelector(".cart__item__content__description p:nth-of-type(2)").textContent, 10);
            displayTotalPriceAndQuantity(productPrice, deltaQuantity);
        }
    }
    localStorage.setItem("cart", JSON.stringify(CART));
}

document.getElementById("firstName").setAttribute("pattern", "[\\p{L}]{1}[\\p{L} -]+");
document.getElementById("firstName").setAttribute("title", "Caractères autorisés : lettres, espaces et tirets");
document.getElementById("lastName").setAttribute("pattern", "[\\p{L}]{1}[\\p{L}' -]+");
document.getElementById("lastName").setAttribute("title", "Caractères autorisés : lettres, espaces, apostrophes et tirets");
document.getElementById("address").setAttribute("pattern", "[\\p{L}\\d]{1}[\\p{L}\\d' ,.-]+");
document.getElementById("address").setAttribute("title", "Caractères autorisés : chiffres, lettres, espaces, apostrophes, virgules, points et tirets");
document.getElementById("city").setAttribute("pattern", "[\\p{L}]{1}[\\p{L}' -]+");
document.getElementById("city").setAttribute("title", "Caractères autorisés : lettres, espaces, apostrophes et tirets");
document.getElementById("email").setAttribute("pattern", "[\\w.-]*@[\\w.-]*.[a-zA-Z]{2,}");
document.getElementById("email").setAttribute("title", "Format attendu : adresse email valide sans caractères accentués (ex. : adresse_mail.2@exemple.xyz)");

let SUBMIT_BUTTON = document.getElementById("order");
SUBMIT_BUTTON.addEventListener("click", function(event) {
    event.preventDefault();
    let formIsValid = validateOrderForm();
    if (formIsValid) {
        let requestBody = assembleOrderData(CART);
        postOrderRequest(requestBody);
    }
});

function validateOrderForm() {
    let inputFields = document.querySelectorAll('.cart__order__form input[type="text"], .cart__order__form input[type="email"]');
    let formValidity = true;
    for (let field of inputFields) {
        if (!field.checkValidity()) {
            field.nextElementSibling.textContent = "Ce champ n'est pas valide";
            formValidity &= false;
        }
        else {
            field.nextElementSibling.textContent = "";
        }
    }
    return formValidity;
}

function assembleOrderData(cart) {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let email = document.getElementById("email").value;

    let contact = {firstName, lastName, address, city, email}
    let products = cart.map(p => p.id);

    return {contact, products};
}

function postOrderRequest(requestBody) {
    try {
        fetch("http://localhost:3000/api/products/order/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(requestBody),
        })
        .then(function(response) {
            if (response.status == 201)
                return response.json();
            else
                throw "The order could not be processed by the API. Please verify the content of the POST request"
        })
        .then(function(data) {
            window.location = `./confirmation.html?orderid=${data.orderId}`;
        })
    }
    catch (error) {
        console.log(error);
    }
}