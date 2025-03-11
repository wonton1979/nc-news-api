const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const request = require("supertest");
const app = require("../app.js");
const {expectedTopics,expectedUsers} = require("./expectedData");
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
                    expect(body.msg).toBe('No articles found with this id.');
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
                    const expectedComments =     [
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
                    expect(comments).toMatchObject(expectedComments);
                    expect(comments).toBeSorted({descending: true, key: 'created_at'})
                });
        });

        test("200: Responds with an empty array if article is exist but no comment found related to this article", () => {
            return request(app)
                .get("/api/articles/2/comments")
                .expect(200)
                .then(({body:{comments}}) => {
                    expect(comments).toHaveLength(0);
                    expect(comments).toMatchObject([]);
                });
        });
    })
    describe("Error Handling Test", () => {
        test("GET 404: Testing if no article found which related to the article_id",()=>{
            return request(app)
                .get("/api/articles/9999/comments")
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('No articles found with this id.');
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

describe("POST /api/articles/:article_id/comments", () => {
    describe("Functionality Test", () => {
        test("201 : Post new comment to the specific article_id",()=>{
            return request(app)
                .post("/api/articles/2/comments")
                .send({username: 'rogersop',body: 'It is cold outside!'})
                .expect(201)
                .then(({body:{new_comment}})=>{
                    expect(new_comment.comment_id).toBe(19);
                    expect(new_comment.author).toBe('rogersop');
                    expect(new_comment.body).toBe('It is cold outside!');
                    expect(new_comment.article_id).toBe(2);
                    expect(new_comment.votes).toBe(0);
                    expect(typeof new_comment.created_at).toBe("string");
                    });
                })
        })

    describe("Error Handling Test", () => {
        test("GET 404: Testing if no article found which related to the article_id",()=>{
            return request(app)
                .post("/api/articles/9999/comments")
                .send({username: 'rogersop',body: 'It is so cold outside!'})
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('No articles found with this id.');
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
        test("GET 404: Testing if username is not exist",()=>{
            return request(app)
                .post("/api/articles/2/comments")
                .send({username: 'wonton79',body: 'It is so cold outside!'})
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('This user does not exist');
                })
        })
        test("GET 400: Testing if wrong data type in object",()=>{
            return request(app)
                .post("/api/articles/2/comments")
                .send({username: 79,body: 99})
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })
    })
})


describe("PATCH /api/articles/:article_id/      | Update article votes if article exist |", () => {
    describe("Functionality Test", () => {
        test("201 : Post new comment to the specific article_id",()=>{
            return request(app)
                .patch("/api/articles/2")
                .send({inc_votes: -100})
                .expect(200)
                .then(({body:{article}})=> {
                    const updatedArticle = {
                        article_id: 2,
                        title: 'Sony Vaio; or, The Laptop',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'Call me Mitchell. Some years ago..',
                        created_at: "2020-10-16T05:03:00.000Z",
                        votes: -100,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                    }
                    expect(article[0]).toMatchObject(updatedArticle);
                })
        });
    })

    describe("Error Handling Test", () => {
        test("GET 404: Testing if no article found which related to the article_id",()=>{
            return request(app)
                .patch("/api/articles/9999/")
                .send({inc_votes: -100})
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('No articles found with this id.');
                })
        })
        test("GET 400: Testing if the provided article_id is not the right format",()=>{
            return request(app)
                .patch("/api/articles/apple")
                .send({inc_votes: -100})
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })
        test("GET 404: Testing if votes number is not a number",()=>{
            return request(app)
                .patch("/api/articles/2")
                .send({inc_votes: "apple"})
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })
        test("GET 404: Testing if votes number is a float number",()=>{
            return request(app)
                .patch("/api/articles/2")
                .send({inc_votes: 8.88})
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })
    })
})

describe("DELETE /api/comments/:comment_id", () => {
    describe("Functionality Test", () => {
        test("204 : Delete comment by using comment id",()=>{
            return request(app)
                .delete("/api/comments/2")
                .expect(204)
                .then(({body})=> {
                    expect(body).toMatchObject({});
                })
        })
    })
    describe("Error Handling Test", () => {
        test("DELETE 404: Testing if no comment found which related to the comment_id", () => {
            return request(app)
                .delete("/api/comments/9999")
                .expect(404)
                .then(({body}) => {
                    console.log(body);
                    expect(body.msg).toBe('No comment found with this id.');
                })
        })
        test("DELETE 404: Testing if data type of comment_id passed in is wrong", () => {
            return request(app)
                .delete("/api/comments/apple")
                .expect(400)
                .then(({body}) => {
                    console.log(body);
                    expect(body.msg).toBe('Bad Request');
                })
        })
    })
})


describe("GET /api/users", () => {
    describe("Functionality Test", () => {
        test("200: Responds with an array of object which list of all users", () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({body}) => {
                    expect(body.users).toHaveLength(4);
                    expect(body.users).toMatchObject(expectedUsers);
                });
        });
    })

    describe("Error Handling Test", () => {
        test("GET 404: Testing if no topic at all",()=>{
            return db.query("DELETE * FROM users", () => {
            })
            return request(app)
                .get("/api/users")
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('Not Found');
                })
        })
    })
});