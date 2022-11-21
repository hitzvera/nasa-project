const http = require('http')

const app = require('./app')
const PORT = 8000;

const server = http.createServer(app)
const {loadPlanetData} = require('./models/planets.model')

async function startServer(){
    await loadPlanetData()

    server.listen(PORT, () => {
        console.log(`listening to port ${PORT}`)
    })
}

startServer()


