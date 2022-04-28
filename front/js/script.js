fetch("http://localhost:3000/api/products/")
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(value) {
        displayAllProducts(value);
    })
    .catch(function() {
        console.log("Something went wrong with the request to get all the products from the API");
    });

function displayAllProducts(products){
    for (let product of products) {
        displayOneProduct(product);
    }
};

function displayOneProduct(sofa) {
    let productCardElements = createProductCardElements(sofa);
    let productCard = createProductCard(productCardElements);
    addproductCardToPage(productCard);
};

function createProductCardElements(sofa) {
    let urlParam = sofa._id;

    let content = document.createElement("article");
    
    let picture = document.createElement("img");
    picture.setAttribute("src", sofa.imageUrl);
    picture.setAttribute("alt", sofa.altTxt);

    let name = document.createElement("h3");
    name.classList.add("productName");
    name.textContent = sofa.name;
    
    let description = document.createElement("p");
    description.classList.add("productDescription");
    description.textContent = sofa.description;
    
    return {
        urlParam,
        content,
        picture,
        name,
        description
    };
}

function createProductCard(productCardElements) {
    let productCard = document.createElement("a");
    productCard.setAttribute('href', `./product.html?id=${productCardElements.urlParam}`);

    productCardElements.content.appendChild(productCardElements.picture);
    productCardElements.content.appendChild(productCardElements.name);
    productCardElements.content.appendChild(productCardElements.description);

    productCard.appendChild(productCardElements.content);

    return productCard;
}

function addproductCardToPage(productCard) {
    document
        .getElementById("items")
        .appendChild(productCard);
}