const {
    getAllLaunches,
    saveLaunch,
    existLaunchById,
    abortLaunchById,
    scheduleLaunch
} = require("../../models/launches.model")

const {
    getPagination
} = require('../../services/query')

async function httpGetAllLaunches(req, res){
    console.log(req.query)
    const {skip,limit} = getPagination(req.query)
    return res.status(200).json(await getAllLaunches(skip,limit))
}
async function httpAddNewLaunch(req,res){
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

    try {
        await scheduleLaunch(launch);
        return res.json({success: true, launch})
    } catch (error) {
        return res.json({success: false, message: error})
    }
}

async function httpAbortLaunch(req,res){
    // one + is to make string to number
    const launchId = +req.params.id

    const isLaunchExist = await existLaunchById(launchId)
    if(!isLaunchExist){
        return res.status(404).json({
            error: true,
            message: "Launch is not found"
        })
    }

    const aborted = await abortLaunchById(launchId)
    if(!aborted){
        return res.status(400).json({success: false, message: "launch not aborted"})
    }
    return res.json({success: true, message: "launch has been aborted"})
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}