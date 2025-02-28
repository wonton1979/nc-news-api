const db = require("./connection")

function allUsers() {
    return db.query("SELECT * FROM users")
        .then((res) => {
            console.log(res.rows);
        })

}


function codingArticles() {
    return db.query("SELECT * FROM articles where topic = 'coding'")
        .then((res) => {
            console.log(res.rows);
        })

}

function negativeVotesComments() {
    return db.query("SELECT * FROM comments where votes < 0")
        .then((res) => {
            console.log(res.rows);
        })

}

function allTopics() {
    return db.query("SELECT * FROM topics")
        .then((res) => {
            console.log(res.rows);
        })

}

function fromSpecificUser(userId) {
    return db.query(`SELECT * FROM articles WHERE author = $1`,[userId,])
        .then((res) => {
            console.log(res.rows);
        })

}

function tenPlusVotesComments() {
    return db.query("SELECT * FROM comments where votes > 10")
        .then((res) => {
            console.log(res.rows,"<<< Query Ten Plus Votes Comments");
            db.end();
        })

}

//allUsers();
//codingArticles();
//negativeVotesComments()
//allTopics()
//fromSpecificUser('grumpy19');
tenPlusVotesComments()