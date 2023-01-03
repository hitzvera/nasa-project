const { default: axios } = require("axios");
const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("downloading launch data...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if(response.status !== 200){
    console.log('Failed download the data')
    throw new Error('Failed donwloading the data')
  }
  const launchDocs = response.data.docs;
  launchDocs.forEach(async (launchDoc) => {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      launchDate: launchDoc["date_local"], // date_local
      mission: launchDoc["name"], // name
      rocket: launchDoc["rocket"], // rocket
      success: launchDoc["success"], // success
      upcoming: launchDoc["upcoming"], // upcoming
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);
    await saveLaunch(launch);
  });
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log(`launch already exist`);
    return;
  }

  await populateLaunches();
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function existLaunchById(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}
async function getAllLaunches(skip, limit) {
  return await launchesDatabase.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  )
  .sort({ flightNumber: 1})
  .skip(skip)
  .limit(limit)
}

async function saveLaunch(launch) {
  return await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

async function scheduleLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("planets is not found");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Mujahid", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}
async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.acknowledged && aborted.modifiedCount === 1;
}

async function getLatestFlightNumber() {
  try {
    const latestFlightNumber = await launchesDatabase
      .findOne()
      .sort("-flightNumber");
    if (!latestFlightNumber) {
      return DEFAULT_FLIGHT_NUMBER;
    }
    return latestFlightNumber.flightNumber;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  loadLaunchData,
  existLaunchById,
  getAllLaunches,
  abortLaunchById,
  saveLaunch,
  scheduleLaunch,
};
