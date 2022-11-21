const launches = new Map()
let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    launchDate: new Date(),
    mission: 'Explore another plantes',
    rocket: 'Rocket spaceX',
    target: 'planet mars',
    success: true,
    upcoming: true, 
    customers: ['Mujahid', 'Nasa']
}

launches.set(launch.flightNumber, launch)
function existLaunchById(launchId) {
    return launches.has(launchId)
}
function getAllLaunches(){
    return Array.from(launches.values())
}
function addNewLaunch(launch) {
    latestFlightNumber++
    const newLaunch = Object.assign(launch, {
        flightNumber: latestFlightNumber,
        upcoming: true,
        success: true,
        customers: ["Mujahid", "NASA"]
    })
    return launches.set(latestFlightNumber, newLaunch)
}
function abortLaunchById(launchId){
    const abortedLaunch = launches.get(launchId)
    abortedLaunch.upcoming = false
    abortedLaunch.success = false
    return abortedLaunch
}


module.exports = {
    existLaunchById,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById,
}