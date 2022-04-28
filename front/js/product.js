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