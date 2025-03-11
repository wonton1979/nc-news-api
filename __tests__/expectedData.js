const expectedTopics =     [
    {
        author: 'icellusedkars',
        title: 'Eight pug gifs that remind me of mitch',
        article_id: 3,
        topic: 'mitch',
        created_at: "2020-11-03T09:12:00.000Z",
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        comment_count: '2'
    },
    {
        author: 'icellusedkars',
        title: 'A',
        article_id: 6,
        topic: 'mitch',
        created_at: "2020-10-18T01:00:00.000Z",
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        comment_count: '1'
    },
    {
        author: 'rogersop',
        title: 'UNCOVERED: catspiracy to bring down democracy',
        article_id: 5,
        topic: 'cats',
        created_at: "2020-08-03T13:14:00.000Z",
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        comment_count: '2'
    },
    {
        author: 'butter_bridge',
        title: 'Living in the shadow of a great man',
        article_id: 1,
        topic: 'mitch',
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        comment_count: '11'
    },
    {
        author: 'butter_bridge',
        title: "They're not exactly dogs, are they?",
        article_id: 9,
        topic: 'mitch',
        created_at: "2020-06-06T09:10:00.000Z",
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        comment_count: '2'
    }
];


const expectedUsers = [
    {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
    },
    {
        username: "icellusedkars",
        name: "sam",
        avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
    },
    {
        username: "rogersop",
        name: "paul",
        avatar_url: "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
    },
    {
        username: "lurker",
        name: "do_nothing",
        avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
    },
];

module.exports = {expectedTopics,expectedUsers};