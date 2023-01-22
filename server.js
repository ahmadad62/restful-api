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