import {server} from "../server.js";
import knex from "knex";
import Knexfile from "../db/knexfile.js";
import supertest from 'supertest';
const request = supertest(server);
const db = knex(Knexfile["test"]);

// beforeEach(() =>
//         db.migrate.rollback().then(() => db.migrate.latest().then(() => db.seed.run())),
//     10000
// );
//
// afterEach(() => db.migrate.rollback().then());

afterAll(async () => {
    await server.close();
});
// beforeAll(async () => {
//     await request
//         .get('/api/beforeAll')
//         .set('Content-Type', 'application/json')
//         .set('Accept', 'application/json')
// });

// afterAll(async () => {
//     await request
//         .get('/api/afterAll')
//         .set('Content-Type', 'application/json')
//         .set('Accept', 'application/json')
//         .then(() => server.close())
// });


describe('Lendsqr Bank System', () => {

    test('should return Welcome to the API', async function () {
        const res = await request
            .get('/')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('message');
        // expect(res.body.message).toBe('Welcome to the json patch microservice API')
        expect(res.body.message).toMatchInlineSnapshot(`"server is up and running"`);

    });

    test("should create account", async () => {
        const res =  await request
            .post('/api/account')
            .send({
                balance: 200
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(201);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('balance');

    })

    let token = 2037891297
    test("should fund user account", async () => {
        const res = await request
            .post('/api/fund')
            .send({
                account: 2037891297,
                amount: 500
            })
            .set('authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatchInlineSnapshot(`"account funded successfully"`);

    })

    test("should transfer funds", async () => {
        const res = await request
            .post("/api/transfer")
            .send({
                from: 2037891297,
                to: 2644215508,
                amount: 250
            })
            .set('authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatchInlineSnapshot(`"funds transfer successful"`);
    })

    test("should not transfer funds", async () => {
        const res = await request
            .post("/api/transfer")
            .send({
                from: 2037891297,
                to: 2644215508,
                amount: 500
            })
            .set('authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatchInlineSnapshot(`"insufficient funds for account 2037891297"`)
    })

    test("should withdraw fund", async () => {
        const res = await request
            .post("/api/withdraw")
            .send({
                account: 2644215508,
                amount: 250
            })
            .set('authorization', `Bearer 2644215508`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatchInlineSnapshot(`"250 withdraw from account 2644215508"`)
    })
})
