const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');

const { loadPlanetData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model')

const PORT = 8000;

// Update below to match your own MongoDB connection string.
const MONGO_URL =
  "mongodb+srv://nasa-api:nasa-api@cluster0.zfgcouc.mongodb.net/nasa?retryWrites=true&w=majority";
const server = http.createServer(app);

mongoose.connection.on('open', () => {
  console.log('MongoDB is ready')
})

mongoose.connection.on('error', (err)=>{
  console.error(err)
})
async function startServer() {
    await mongoose.connect(MONGO_URL);
    await loadPlanetData();
    await loadLaunchData();


    server.listen(PORT, () => {
        console.log(`listening to port ${PORT}`)
    })
}

startServer()


