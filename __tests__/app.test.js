const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const request = require("supertest");
const app = require("../app.js");
const {expectedTopics,expectedUsers,articlesOrderByAuthorDesc,
    articlesSortByAuthorNoOrder,articlesQueryWithOnlyOrderGiven,articleQueryWithAuthor,articleQueryWithMultipleProperties} = require("./expectedData");
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
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                        comment_count: '2'
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
                .then(({body:{articles,total_count}}) => {
                    expect(articles).toHaveLength(13);
                    expect(articles).toMatchObject(expectedTopics)
                    expect(articles).toBeSorted({descending: true, key: 'created_at'})
                    expect(total_count).toBe(13);
                });
        });
        test("200: Responds with an array of object which list of all available articles with single query", () => {
            return request(app)
                .get("/api/articles?author=butter_bridge")
                .expect(200)
                .then(({body:{articles,total_count}}) => {
                    expect(articles).toHaveLength(4);
                    expect(articles).toMatchObject(articleQueryWithAuthor)
                    expect(articles).toBeSorted({descending: true, key: 'created_at'})
                    expect(total_count).toBe(4);
                });
        });

        test("200: Responds with an array of object which list of all available articles with multiple queries", () => {
            return request(app)
                .get("/api/articles?author=butter_bridge&votes=0")
                .expect(200)
                .then(({body:{articles,total_count}}) => {
                    expect(articles).toHaveLength(3);
                    expect(articles).toMatchObject(articleQueryWithMultipleProperties)
                    expect(articles).toBeSorted({descending: true, key: 'created_at'})
                    expect(total_count).toBe(3);
                });
        });

        test("200: Testing to add limit and page to query", () => {
            return request(app)
                .get("/api/articles?author=butter_bridge&votes=0&limit=2&p=2")
                .expect(200)
                .then(({body:{articles}}) => {
                    const expectedArticle = [
                        {
                            article_id: 9,
                            title: "They're not exactly dogs, are they?",
                            topic: 'mitch',
                            author: 'butter_bridge',
                            body: 'Well? Think about it.',
                            created_at: '2020-06-06T09:10:00.000Z',
                            votes: 0,
                            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                        }
                    ]
                    expect(articles).toHaveLength(1);
                    expect(articles).toMatchObject(expectedArticle)
                    expect(articles).toBeSorted({descending: true, key: 'created_at'})
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

        test("GET 400: Testing if type of votes are wrong",()=>{
            return request(app)
                .get("/api/articles?votes=apple")
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })

        test("GET 400: Testing if votes is negative number",()=>{
            return request(app)
                .get("/api/articles?votes=-10")
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })

        test("GET 200: Testing if page number is lager then the page available,empty array should return",()=>{
            return request(app)
                .get("/api/articles?limit=2&p=9")
                .expect(200)
                .then(({body:{articles}})=>{
                    expect(articles).toEqual([]);
                })
        })

        test("GET 400: Testing if limit property is negative number",()=>{
            return request(app)
                .get("/api/articles?limit=-9")
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })

        test("GET 400: Testing if page property is negative number",()=>{
            return request(app)
                .get("/api/articles?limit=2&p=-9")
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })

        test("GET 400: Testing if only page number provided without limit property",()=>{
            return request(app)
                .get("/api/articles?p=9")
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
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

        test("200: Responds with limit property", () => {
            return request(app)
                .get("/api/articles/1/comments?limit=2")
                .expect(200)
                .then(({body:{comments}}) => {
                    const expectedComments = [
                        {
                            comment_id: 5,
                            article_id: 1,
                            author: 'icellusedkars',
                            body: 'I hate streaming noses',
                            created_at: '2020-11-03T21:00:00.000Z',
                            votes: 0
                        },
                        {
                            comment_id: 2,
                            article_id: 1,
                            author: 'butter_bridge',
                            body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
                            created_at: '2020-10-31T03:03:00.000Z',
                            votes: 14
                        }
                    ]

                    expect(comments).toHaveLength(2);
                    expect(comments).toMatchObject(expectedComments);
                });
        });

        test("200: Responds with limit and page property", () => {
            return request(app)
                .get("/api/articles/1/comments?limit=2&p=6")
                .expect(200)
                .then(({body:{comments}}) => {
                    const expectedComments =      [
                        {
                            comment_id: 9,
                            article_id: 1,
                            author: 'icellusedkars',
                            body: 'Superficially charming',
                            created_at: '2020-01-01T03:08:00.000Z',
                            votes: 0
                        }
                    ]
                    expect(comments).toHaveLength(1);
                    expect(comments).toMatchObject(expectedComments);
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

        test("GET 200: Testing if page number is lager then the page available,empty array should return",()=>{
            return request(app)
                .get("/api/articles/1/comments?limit=2&p=9")
                .expect(200)
                .then(({body:{comments}})=>{
                    expect(comments).toEqual([]);
                })
        })

        test("GET 400: Testing if limit property is negative number",()=>{
            return request(app)
                .get("/api/articles/1/comments?limit=-9")
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })

        test("GET 400: Testing if page property is negative number",()=>{
            return request(app)
                .get("/api/articles/1/comments?limit=2&p=-9")
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })

        test("GET 400: Testing if only page number provided without limit property",()=>{
            return request(app)
                .get("/api/articles/1/comments?p=9")
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
        test("GET 404: Testing if inc_votes is missing",()=>{
            return request(app)
                .patch("/api/articles/2")
                .send({})
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
                    expect(body.msg).toBe('No comment found with this id.');
                })
        })
        test("DELETE 404: Testing if data type of comment_id passed in is wrong", () => {
            return request(app)
                .delete("/api/comments/apple")
                .expect(400)
                .then(({body}) => {
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
        test("GET 404: Testing if no user at all",()=>{
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


describe("GET /api/articles  query with sort_by and order", () => {
    describe("Functionality Test", () => {
        test("200: Responds with an array of object which sorted by given column and given order", () => {
            return request(app)
                .get("/api/articles?sort_by=author&order=desc")
                .expect(200)
                .then(({body:{articles}}) => {
                    expect(articles).toHaveLength(13);
                    expect(articles).toMatchObject(articlesOrderByAuthorDesc)
                    expect(articles).toBeSorted({descending: true, key: 'author'})
                });
        });

        test("200: Responds with an array of object which only sorted by given column without given order", () => {
            return request(app)
                .get("/api/articles?sort_by=author")
                .expect(200)
                .then(({body:{articles}}) => {
                    expect(articles).toHaveLength(13);
                    expect(articles).toMatchObject(articlesSortByAuthorNoOrder)
                    expect(articles).toBeSorted({descending: false, key: 'author'})
                });
        });

        test("200: Responds with an array of object which default sort by created_at with only order be given", () => {
            return request(app)
                .get("/api/articles?order=desc")
                .expect(200)
                .then(({body:{articles}}) => {
                    expect(articles).toHaveLength(13);
                    expect(articles).toMatchObject(articlesQueryWithOnlyOrderGiven)
                    expect(articles).toBeSorted({descending: true, key: 'created_at'})
                });
        });
    })

    describe("Error Handling Test", () => {
        test("GET 404: Testing if no articles at all",()=>{
            async () =>{
                await db.query("DELETE * FROM articles");
                return request(app)
                    .get("/api/articles")
                    .expect(404)
                    .then(({body})=>{
                        expect(body.msg).toBe('Not Found');
                    })
            }

        })

        test("GET 400: Testing if order by column is not exist",()=>{
            return request(app)
                .get("/api/articles?sort_by=apple&order=desc")
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })

        test("GET 400: Testing if  order is not valid",()=>{
            return request(app)
                .get("/api/articles?sort_by=author&order=apple")
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })
    })
});

describe("GET /api/articles(topic)  ", () => {
    describe("Functionality Test", () => {
        test("200: Responds with an array of object which relate to the topic", () => {
            async () =>{
                await request(app)
                    .get("/api/articles")
                    .query({topic: 'cats'})
                    .expect(200)
                    .then(({body}) => {
                        const expectedArticle =  {
                            article_id: 5,
                            title: 'UNCOVERED: catspiracy to bring down democracy',
                            topic: 'cats',
                            author: 'rogersop',
                            body: 'Bastet walks amongst us, and the cats are taking arms!',
                            created_at: "2020-08-03T13:14:00.000Z",
                            votes: 0,
                            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                        };
                        expect(body).toHaveLength(1);
                        expect(body[0]).toMatchObject(expectedArticle)
                    });
            }
        });
    })

    describe("Error Handling Test", () => {
        test("GET 200: Testing if no articles under the provided topic", () => {
            async () => {
                 await request(app)
                     .get("/api/articles")
                     .query({topic: 'apple'})
                     .expect(200)
                     .then(({body}) => {
                        expect(body).toEqual([]);
                })
            }
        })
        test("GET 400: Testing if given topic in wrong data type", () => {
            return request(app)
                .get("/api/articles")
                .query({topic: 888})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Bad Request");
                })
        })
    })
})

describe("GET /api/users/:username", () => {
    describe("Functionality Test", () => {
        test("200: Responds with an of object contains the user's details which relate to the username requested", () => {
            return request(app)
                .get("/api/users/rogersop")
                .expect(200)
                .then(({body:{user}}) => {
                    const expectedUser = {
                        username: "rogersop",
                        name: "paul",
                        avatar_url: "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
                    }
                    expect(user[0]).toMatchObject(expectedUser);
                });
        });
    })

    describe("Error Handling Test", () => {
        test("GET 404: Testing if no user found which related to the username",()=>{
            return request(app)
                .get("/api/users/9999")
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('This user does not exist');
                })
        })
    })
})

describe("PATCH /api/comments/:comment_id", () => {
    describe("Functionality Test", () => {
        test("200: Update comment's votes if the comment is exist and in_votes is a positive integer",()=>{
            return request(app)
                .patch("/api/comments/2")
                .send({inc_votes: 6})
                .expect(200)
                .then(({body:{comment}})=> {
                    const updatedComment = {
                            comment_id: 2,
                            article_id: 1,
                            body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
                            votes: 20,
                            author: "butter_bridge",
                            created_at: "2020-10-31T03:03:00.000Z",
                        };
                    expect(comment[0]).toMatchObject(updatedComment);
                })
        });

        test("200: Update comment's votes if the comment is exist and in_votes is a negative integer",()=>{
            return request(app)
                .patch("/api/comments/2")
                .send({inc_votes: -10})
                .expect(200)
                .then(({body:{comment}})=> {
                    const updatedComment = {
                        comment_id: 2,
                        article_id: 1,
                        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
                        votes: 4,
                        author: "butter_bridge",
                        created_at: "2020-10-31T03:03:00.000Z",
                    };
                    expect(comment[0]).toMatchObject(updatedComment);
                })
        });
    })

    describe("Error Handling Test", () => {
        test("GET 404: Testing if no comment found which related to the comment_id",()=>{
            return request(app)
                .patch("/api/comments/9999/")
                .send({inc_votes: -100})
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('No comment found with this id.');
                })
        })
        test("GET 400: Testing if the provided comment_id is not the right format",()=>{
            return request(app)
                .patch("/api/comments/apple")
                .send({inc_votes: -100})
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })
        test("GET 404: Testing if votes for the comment is not a number",()=>{
            return request(app)
                .patch("/api/comments/2")
                .send({inc_votes: "apple"})
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })
        test("GET 404: Testing if votes is a float number",()=>{
            return request(app)
                .patch("/api/comments/2")
                .send({inc_votes: 8.88})
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })
        test("GET 404: Testing if inc_votes is missing",()=>{
            return request(app)
                .patch("/api/comments/2")
                .send({})
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })
    })
})

describe("POST /api/articles/", () => {
    describe("Functionality Test", () => {
        test("201 : Post a new article",()=>{
            return request(app)
                .post("/api/articles")
                .send({author: 'rogersop',title:"UK's Spring",body: 'It is cold outside!',topic:'cats'})
                .expect(201)
                .then(({body:{new_article}})=>{
                    expect(new_article[0].article_id).toBe(14);
                    expect(new_article[0].author).toBe('rogersop');
                    expect(new_article[0].body).toBe('It is cold outside!');
                    expect(new_article[0].article_img_url).toBe("https://northcoders.com/");
                    expect(new_article[0].votes).toBe(0);
                    expect(new_article[0].topic).toBe('cats');
                    expect(typeof new_article[0].created_at).toBe("string");
                    expect(new_article[0].title).toBe("UK's Spring");
                    expect(new_article[0].comment_count).toBe("0");
                });
        })
    })

    describe("Error Handling Test", () => {
        test("POST 404: Testing if author of new article is not in users table",()=>{
            return request(app)
                .post("/api/articles")
                .send({author: 'wonton79',title:"UK's Spring",body: 'It is cold outside!',topic:'cats'})
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('This user does not exist');
                })
        })
        test("POST 404: Testing if topic of new article is not in topics users table",()=>{
            return request(app)
                .post("/api/articles")
                .send({author: 'rogersop',title:"UK's Spring",body: 'It is cold outside!',topic:'dogs'})
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('The topic(slug) does not exist.');
                })
        })
        test("GET 400: Testing if query contains properties which are not in this list [author,title,body,topic,article_img_url]",()=>{
            return request(app)
                .post("/api/articles")
                .send({author: 'rogersop',title:"UK's Spring",body: 'It is cold outside!',topic:'cats',weather: "Raining"})
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })
        test("GET 400: Testing if wrong data type in object",()=>{
            return request(app)
                .post("/api/articles")
                .send({author: 'rogersop',title:8888,body: 8888,topic:'cats',weather: "Raining"})
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })
    })
})

describe("POST /api/topics/", () => {
    describe("Functionality Test", () => {
        test("201 : Post a new topic",()=>{
            return request(app)
                .post("/api/topics")
                .send({slug: 'UK Weather',description:'Raining and Cold in Winter'})
                .expect(201)
                .then(({body:{new_topic}})=>{
                    expect(new_topic[0].slug).toBe('UK Weather');
                    expect(new_topic[0].description).toBe('Raining and Cold in Winter');
                    expect(new_topic[0].img_url).toBe("");
                });
        })
    })

    describe("Error Handling Test", () => {
        test("POST 400: Testing if slug already exist",()=>{
            return request(app)
                .post("/api/topics")
                .send({slug: 'mitch',description:'Raining and Cold in Winter'})
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('This topic already exist');
                })
        })
        test("GET 400: Testing if wrong data type in object",()=>{
            return request(app)
                .post("/api/articles")
                .send({slug:8888,description:'Raining and Cold in Winter'})
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request');
                })
        })
    })
})

describe("DELETE /api/articles/:article_id", () => {
    describe("Functionality Test", () => {
        test("204 : Delete article by using article id",()=>{
            return request(app)
                .delete("/api/articles/2")
                .expect(204)
                .then(({body})=> {
                    expect(body).toMatchObject({});
                })
        })
    })
    describe("Error Handling Test", () => {
        test("DELETE 404: Testing if no article found which related to the article_id", () => {
            return request(app)
                .delete("/api/articles/9999")
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe('No articles found with this id.');
                })
        })
        test("DELETE 400: Testing if data type of article_id passed in is wrong", () => {
            return request(app)
                .delete("/api/articles/apple")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Bad Request');
                })
        })
    })
})
