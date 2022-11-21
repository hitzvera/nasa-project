const {
    getAllLaunches,
    addNewLaunch,
    existLaunchById,
    abortLaunchById
} = require("../../models/launches.model")

function httpGetAllLaunches(req, res){
    return res.status(200).json(getAllLaunches())
}
function httpAddNewLaunch(req,res){
    const launch = req.body

    if(!launch.mission || !launch.rocket || !launch.launchDate 
        || !launch.target) return res.status(400).json({
            error: true,
            message: "Missing required mandatory property"
        })

    launch.launchDate = new Date(launch.launchDate)
    // check if launcDate a valid date
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error: true,
            message: "Invalid Date format"
        })
    }

    addNewLaunch(launch)
    return res.status(201).json(launch)
}
function httpAbortLaunch(req,res){
    // one + is to make string to number
    const launchId = +req.params.id

    if(!existLaunchById(launchId)){
        return res.status(404).json({
            error: true,
            message: "Launch is not found"
        })
    }

    return res.status(200).json({
        error: false,
        message: "succesfully aborted",
        itemsAborted: abortLaunchById(launchId) 
    })
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}