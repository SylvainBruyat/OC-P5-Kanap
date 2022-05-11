fetch("http://localhost:3000/api/products/")
    .then(function(response) {
        if (response.ok)
            return response.json();
    })
    .then(displayAllProducts)
    .catch(function() { // Voir pour remplacer par console.error, vérifier quel message est renvoyé par l'API
        console.log("Something went wrong with the request to get all the products from the API");
    });

function displayAllProducts(products){
    for (let product of products) {
        document
            .getElementById("items")
            .innerHTML += `
                <a href="./product.html?id=${product._id}">
                    <article>
                        <img src="${product.imageUrl}" alt="${product.altTxt}">
                        <h3 class="productName">${product.name}</h3>
                        <p class="productDescription">${product.description}</p>
                    </article>
                </a>
            `;
    }
};