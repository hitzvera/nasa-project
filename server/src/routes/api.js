
const express = require('express')

const api = express.Router()
const plantesRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

api.use("/planets", plantesRouter);
api.use("/launches", launchesRouter);

module.exports = api