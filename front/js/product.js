let productID = new URL(document.URL).searchParams.get("id");

fetch(`http://localhost:3000/api/products/${productID}`)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(value) {
        addProductInfoToPage(value);
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

let quantity = document.getElementById("quantity");
quantity.addEventListener("change", function(event) {
    if (!/^-*[0-9]+$/.test(event.target.value)) {
        removePreviousMessage();
        displayNotANumberErrorMessage();
    }
    else if ((event.target.value < 1) || (event.target.value > 100)) {
        removePreviousMessage();
        displayValueRangeErrorMessage();
    }
    else {
        removePreviousMessage();
    }
})

function removePreviousMessage() {
    let container = document.querySelector("div.item__content__settings__quantity");
    let message = document.querySelector("div.item__content__settings__quantity div");
    if (message != null) {
        container.removeChild(message);
    }
}

function displayValueRangeErrorMessage() {
    let message = document.createElement("div");
    message.textContent = "Veuillez entrer une quantité entre 1 et 100";

    document
        .querySelector("div.item__content__settings__quantity")
        .appendChild(message);
}

function displayNotANumberErrorMessage() {
    let message = document.createElement("div");
    message.textContent = "Veuillez entrer un nombre entier";

    document
        .querySelector("div.item__content__settings__quantity")
        .appendChild(message);
}