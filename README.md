
# RESTful API

A RESTful API is an architectural style for an application program interface (API) that uses HTTP requests to access and use data. That data can be used to GET, PUT, POST and DELETE data types, which refers to the reading, updating, creating and deleting of operations concerning resources.

## Goles:
Express is a popular framework for building web applications and APIs in Node.js, and it provides a lot of additional functionality and convenience compared to using the built-in 'http' module. Express makes it easy to handle routing, middleware, and other common functionality, which can save a lot of development time.

Using the built-in 'http' module as in your example is a great way to understand how the underlying mechanics of a web server work, but it is not always the most efficient or maintainable approach.

I wrote this code for learning purposes, and it can be improved further. It's always good to know the underlying principles before using a framework like Express, which abstracts away some of the complexity.

Hope you enjoy and keep learning!

## server.js
- This is a Node.js script that creates an HTTP server using the 'http' module. The server listens for incoming requests and routes them to different functions based on the URL path and request method. The functions that handle the different routes are imported from the './controllers/productController' module. The script also sets a PORT variable to use for the server to listen on, which defaults to 5000 if the PORT environment variable is not set. When the server starts, it logs a message to the console indicating the port it is listening on.

```javascript
const http = require('http');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('./controllers/productController')

const server = http.createServer((req, res) => {
    if (req.url === '/api/products' && req.method === 'GET') {
        getProducts(req, res)

    } else if (req.url.match(/\/api\/products\/([0-9]+)/) && req.method === 'GET') {
        const id = req.url.split("/")[3]  //api/products/1 --> it is extracting the 4th segment of the URL path as the variable id
        getProduct(req, res, id)

    } else if (req.url === '/api/products' && req.method === 'POST') {

        createProduct(req, res)

    } else if (req.url.match(/\/api\/products\/([0-9]+)/) && req.method === 'PUT') {
        const id = req.url.split("/")[3]  //api/products/1 --> it is extracting the 4th segment of the URL path as the variable id
        updateProduct(req, res, id)

    } else if (req.url.match(/\/api\/products\/([0-9]+)/) && req.method === 'DELETE') {
        const id = req.url.split("/")[3]  //api/products/1 --> it is extracting the 4th segment of the URL path as the variable id
        deleteProduct(req, res, id)

    } else {

        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Rout Not Found' }))

    }
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`server running on port ${PORT}`))
```

## ProductController
This is a set of functions for handling CRUD operations for a product resource using the 'Product' model. Each function is designed to handle a specific route and HTTP method, such as getting all products, getting a single product, creating a product, updating a product, and deleting a product.
It also uses `getPostData` utility function to parse the request body.

The `getProducts` function retrieves all products using the `findAll` method of the 'Product' model and returns them in a JSON object to the client.

The `getProduct` function retrieves a single product by id using the `findById` method of the 'Product' model and returns it in a JSON object to the client. If the product is not found, it returns a 404 status code and a JSON object with a message 'Product Not Found'

The `createProduct` function creates a new product by parsing the request body for the required properties, such as title, price, quantity, total, discountPercentage, and discountedPrice, and passing them to the `create` method of the 'Product' model. It returns a 201 status code and the newly created product in a JSON object to the client.

The `updateProduct` function updates an existing product by parsing the request body for the properties to update, such as title, price, quantity, total, discountPercentage, and discountedPrice, and passing them to the `update` method of the 'Product' model. It returns a 200 status code and the updated product in a JSON object to the client.

The `deleteProduct` function deletes a product by id using the `remove` method of the 'Product' model and returns a 200 status code and a JSON object with a message 'Product [id] removed' to the client.

Overall, this code defines a set of functions that handle CRUD operations for a Product resource using an ORM model, and they are ready to be used by the main server file to handle incoming requests.

- *Object-role modeling (ORM) is used to model the semantics of a universe of discourse. ORM is often used for data modeling and software engineering.

```javascript 
const Product = require('../models/productModel');

const { getPostData } = require('../utils')

//@desc  Gets All Products
//@route GET /api/products

async function getProducts(req, res) {
    try {
        const products = await Product.findAll()

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(products))

    } catch (error) {
        console.log(error)
    }
}


//@desc  Gets Single Product
//@route GET /api/product/:id

async function getProduct(req, res, id) {
    try {
        const product = await Product.findById(id)

        if (!product) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Product Not Found' }))
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(product))
        }



    } catch (error) {
        console.log(error)
    }
}



//@desc  Create a Products
//@route POST /api/products

async function createProduct(req, res) {
    try {
        const body = await getPostData(req)

        const { title, price, quantity, total, discountPercentage, discountedPrice } = JSON.parse(body)
        const product = {
            title,//: "Wholesale cargo lashing Belt",
            price,//: 930,
            quantity,//: 1,
            total,//: 930,
            discountPercentage,//: 17.67,
            discountedPrice//: 766
        }

        const newProduct = await Product.create(product)
        res.writeHead(201, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify(newProduct))


    } catch (error) {
        console.log(error)
    }
}


//@desc  Update a Products
//@route PUT /api/products/:id

async function updateProduct(req, res, id) {
    try {

        const product = await Product.findById(id)

        if (!product) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Product Not Found' }))
        } else {


            const body = await getPostData(req)

            const { title, price, quantity, total, discountPercentage, discountedPrice } = JSON.parse(body)
            const productData = {
                title: title || product.title,//: "Wholesale cargo lashing Belt",
                price: price || product.price,//: 930,
                quantity: quantity || product.quantity,//: 1,
                total: total || product.total,//: 930,
                discountPercentage: discountPercentage || product.discountPercentage,//: 17.67,
                discountedPrice: discountedPrice || product.discountedPrice//: 766
            }

            const updProduct = await Product.update(id, productData)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify(updProduct))
        }


    } catch (error) {
        console.log(error)
    }
}



//@desc  Delete Product
//@route DELETE /api/product/:id

async function deleteProduct(req, res, id) {
    try {
        const product = await Product.findById(id)

        if (!product) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Product Not Found' }))
        } else {
            await Product.remove(id)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: `Product ${id} removed` }))
        }



    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}

```

## productModel
This is a module that exports a set of functions to handle CRUD operations for a product resource. The functions are designed to interact with a "products" data stored in a JSON file.

The `findAll` function retrieves all products from the JSON file and returns them in a promise object.

The `findById` function retrieves a single product by id from the JSON file and returns it in a promise object. If the product is not found, it will return `undefined`.

The `create` function creates a new product by taking in a product object, adding an id property to it using the uuidv4 function, and then appending it to the products array. After that it writes this new data to the products.json file and returns the new product in a promise object.

The `update` function updates an existing product by taking in an id of the product and the updated product object. It finds the index of the product in the products array by comparing the ids, and update the product data at that index with the new data. It also writes this new data to the products.json file and returns the updated product in a promise object.

The `remove` function removes a product by id by filtering out the product from the products array by comparing the ids. It also writes this new data to the products.json file and returns an empty promise object.

This module uses the `writeDataToFile` utility function to write the new data to the products.json file after each CRUD operation.
```javascript
const fs = require('fs')

function writeDataToFile(filename, content) {
    fs.writeFileSync(filename, JSON.stringify(content), 'utf8', (err) => {
        if (err) {
            console.log(err)
        }
    })
}


function getPostData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = ''

            req.on('data', (chunk) => {
                body += chunk.toString()
            })

            req.on('end', () => {
                resolve(body)
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    writeDataToFile,
    getPostData
}
```
It also checks if the environment is not 'test' to avoid writing to the file during tests.

Overall, this module defines a set of functions that handle CRUD operations for a Product resource using data stored in a JSON file, and they are ready to be used by other modules to handle the product resource.

### Resources

[Explanation](https://dev.to/shadid12/how-to-architect-a-node-js-project-from-ground-up-1n22)