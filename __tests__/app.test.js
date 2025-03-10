const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const request = require("supertest");
const app = require("../app.js");
const {expectedTopics} = require("./expectedData");
require('jest-sorted');


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
                    const expectedTopics = [{
                        description: 'The man, the Mitch, the legend',
                        slug: 'mitch',
                        img_url: ""
                    },
                        {
                            description: 'Not dogs',
                            slug: 'cats',
                            img_url: ""
                        },
                        {
                            description: 'what books are made of',
                            slug: 'paper',
                            img_url: ""
                        }
                    ];
                    expect(body.topics).toHaveLength(3);
                    expect(body.topics).toMatchObject(expectedTopics)
                });
        });
    })

    describe("Error Handling Test", () => {
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

describe("GET /api/articles/:article_id", () => {
    describe("Functionality Test", () => {
        test("200: Responds with an of object contains the article's details which relate to the article_id requested", () => {
            return request(app)
                .get("/api/articles/3")
                .expect(200)
                .then(({body:{article}}) => {
                    const expectedArticle = {
                        article_id: 3,
                        title: 'Eight pug gifs that remind me of mitch',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'some gifs',
                        created_at: '2020-11-03T09:12:00.000Z',
                        votes: 0,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                    }
                    expect(article[0]).toMatchObject(expectedArticle);
                });
        });
    })

    describe("Error Handling Test", () => {
        test("GET 404: Testing if no article found which related to the article_id",()=>{
            return request(app)
                .get("/api/articles/9999")
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('Not Found');
                })
        })
        test("GET 400: Testing if the provided article_id is not the right format",()=>{
            return request(app)
                .get("/api/articles/apple")
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })
    })
})

describe("GET /api/articles", () => {
    describe("Functionality Test", () => {
        test("200: Responds with an array of object which list of all available articles", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    expect(body).toHaveLength(5);
                    expect(body).toMatchObject(expectedTopics)
                    expect(body).toBeSorted({descending: true, key: 'created_at'})
                });
        });
    })

    describe("Error Handling Test", () => {
        test("GET 404: Testing if no topic at all",()=>{
            return db.query("DELETE * FROM articles", (res) => {

            })
            return request(app)
                .get("/api/articles")
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('Not Found');
                })
        })
    })
});

describe("GET /api/articles/:article_id/comments", () => {
    describe("Functionality Test", () => {
        test("200: Responds with an array of comments for the given article_id", () => {
            return request(app)
                .get("/api/articles/3/comments")
                .expect(200)
                .then(({body:{comments}}) => {
                    const expectedArticle =     [
                        {
                            comment_id: 11,
                            article_id: 3,
                            author: 'icellusedkars',
                            body: 'Ambidextrous marsupial',
                            created_at: "2020-09-19T23:10:00.000Z",
                        votes: 0
                        },
                        {
                            comment_id: 10,
                                article_id: 3,
                            author: 'icellusedkars',
                            body: 'git push origin master',
                            created_at: "2020-06-20T07:24:00.000Z",
                            votes: 0
                        }]
                    expect(comments).toHaveLength(2);
                    expect(comments).toMatchObject(expectedArticle);
                    expect(comments).toBeSorted({descending: true, key: 'created_at'})
                });
        });
    })
    describe("Error Handling Test", () => {
        test("GET 404: Testing if no article found which related to the article_id",()=>{
            return request(app)
                .get("/api/articles/9999/comments")
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('Not Found');
                })
        })
        test("GET 400: Testing if the provided article_id is not the right format",()=>{
            return request(app)
                .get("/api/articles/apple/comments")
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })
    })
})
