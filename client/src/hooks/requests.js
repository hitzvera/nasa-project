const API_URL = 'http://localhost:8000/v1'

async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`)
  return await response.json()
}

async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`)
  const fetchLaunches = await response.json()
  return fetchLaunches.sort((a,b) => a.flightNumber - b.flightNumber)
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(launch),
    })
  } catch(error) {
    return {
      ok: false,
      message: error,
    }
  }
 
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete"
    })
  } catch(error) {
    return {
      ok: false,
      message: error,
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};