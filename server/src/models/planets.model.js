const {parse} = require('csv-parse');
const fs = require('fs');
const path = require('path')

const planets = require('./planets.mongo')

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}
function loadPlanetData(){
    return new Promise((resolve,reject) => {
        fs.createReadStream(path.join(__dirname,'..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
          comment: '#',
          columns: true,
        }))
        .on('data', async(data) => {
          if (isHabitablePlanet(data)) {
            savePlanet(data)
          }
        })
        .on('error', (err) => {
          console.log(err);
          reject(err)
        })
        .on('end', async() => {
          const countPlanets = (await getAllPlanets()).length
          console.log(`${countPlanets} habitable planets found!`);
          resolve()
        });
    })
}

async function getAllPlanets(){
  return await planets.find({}, {
    'keplerName': 1,
    '_id': 0
  })
}

async function savePlanet(planet){
  try {
    console.log(planet.kepler_name)
      await planets.updateOne(
        {
          keplerName: planet.kepler_name,
        },
        {
          keplerName: planet.kepler_name,
        },
        {
          upsert: true,
        }
      );
  } catch (error) {
    console.error(`message: ${error}`)
  }

}

module.exports = {
    loadPlanetData,
    getAllPlanets
}