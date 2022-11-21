

const requests = require('supertest')
const { request } = require('../../app')
const app = require('../../app')


describe('Test GET /launches', () => {
    test('response code should be 200 success', async() => {
        const response = await requests(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200)
    })
})

describe('Test POST /launches', () => {

    const completeLaunchDate = {
        mission: 'menguasai planet namek',
        rocket: 'capsule corps bulma',
        target: 'Planet namek',
        launchDate: 'January 4, 2030'
    }
    const completeLaunchDateWithWrongFormat = {
        mission: 'menguasai planet namek',
        rocket: 'capsule corps bulma',
        target: 'Planet namek',
        launchDate: 'hello'
    }
    const launchWihtoutDate = {
        mission: 'menguasai planet namek',
        rocket: 'capsule corps bulma',
        target: 'Planet namek',
    }

    test('response code should be 201 created', async()=>{
        const response = await requests(app)
            .post('/launches')
            .send(completeLaunchDate)
            .expect("Content-Type", /json/)
            .expect(201)
        
        const requestDate = new Date(completeLaunchDate.launchDate).valueOf()
        const responseDate = new Date(response.body.launchDate).valueOf()
        expect(requestDate).toBe(responseDate)

        expect(response.body).toMatchObject(launchWihtoutDate)
    })
    test('it should catch missing required properties', async()=>{
        const response = await requests(app)
            .post('/launches')
            .send(launchWihtoutDate)
            .expect("Content-Type", /json/)
            .expect(400)

        expect(response.body).toStrictEqual({
            error: true,
            message: "Missing required mandatory property"
        })
    })
    test('it should catch invalid date', async() => {
        const response = await requests(app)
            .post('/launches')
            .send(completeLaunchDateWithWrongFormat)
            .expect('Content-Type', /json/)
            .expect(400)
        
        expect(response.body).toStrictEqual({
            error: true,
            message: "Invalid Date format"
        })
    })
})