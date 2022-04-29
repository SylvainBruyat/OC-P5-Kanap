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

let message = document.createElement("div");
document
        .querySelector("div.item__content__settings__quantity")
        .appendChild(message);

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
})

function removeErrorMessage() {
    message.textContent = "";
}

function displayNotANumberErrorMessage() {
    message.textContent = "Veuillez entrer un nombre entier";
}

function displayValueRangeErrorMessage() {
    message.textContent = "Veuillez entrer une quantité entre 1 et 100";
}