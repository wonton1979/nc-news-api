const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const request = require("supertest");
const app = require("../app.js");


beforeEach(()=>{
    return seed(data);
})

afterAll(()=>{
    return db.end();
})


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({body:{endpoints}}) => {
          console.log(endpoints);
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
    describe("Functionality Test", () => {
        test("200: Responds with an array of object which list of all available topics", () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({body}) => {
                    console.log(body);
                    expect(body.owners.length).toBe(3);
                    body.owners.forEach(topic => {
                        expect(typeof topic.slug).toBe('string')
                        expect(typeof topic.description).toBe('string')
                        expect(typeof topic.img_url).toBe('string')
                    })
                });
        });
    })

    describe.only("Error Handling Test", () => {
        test("GET 404: Testing if no topic at all",()=>{
            return db.query("DELETE * FROM topics", (res) => {

            })
            return request(app)
                .get("/api/topics")
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('Not Found');
                })
        })
    })
});