const db = require("../connection");
const format = require('pg-format');
const {convertTimestampToDate,linkedID} = require('./utils.js');

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
      .query("DROP TABLE IF EXISTS comments;")
      .then(() => {
          return db.query("DROP TABLE IF EXISTS articles;");
      })
      .then(() => {
        return db.query("DROP TABLE IF EXISTS users;");
      })
      .then(() => {
        return db.query("DROP TABLE IF EXISTS topics;");
      })
      .then(() => {
        return createTopics(topicData);
      })
      .then(() => {
        return createUsers(userData);
      })
      .then(() => {
          return createArticles(articleData);
      })
      .then(() => {
          return createComments(commentData);
      });

};

function createTopics(topicData) {
  return db.query(`CREATE TABLE topics(slug VARCHAR(250) PRIMARY KEY,
                                       description VARCHAR(250),
                                       img_url VARCHAR(1000));`
      ).then(() => {
      const formattedData = topicData.map(
          ({ slug,description,img_url }) => {
              return [slug,description,img_url];
          })
      const SQLquery = format(`INSERT INTO topics(slug,description,img_url ) VALUES %L RETURNING *`, formattedData);
      return db.query(SQLquery);
  })
}

function createUsers(userData) {
  return db.query(
          `CREATE TABLE users(username VARCHAR(250) PRIMARY KEY,
                              name VARCHAR(250),
                              avatar_url VARCHAR(1000));`
      ).then(() => {
      const formattedData = userData.map(
          ({ username,name,avatar_url}) => {
              return [username,name,avatar_url];
          })
      const SQLquery = format(`INSERT INTO users(username,name,avatar_url) VALUES %L RETURNING *`, formattedData);
      return db.query(SQLquery);
  })
}

function createArticles(articleData) {
    return db.query(
        `CREATE TABLE articles(article_id SERIAL PRIMARY KEY,
                               title VARCHAR(1000),
                               topic VARCHAR(1000) REFERENCES topics(slug),
                               author VARCHAR(250) REFERENCES users(username),
                               body TEXT,
                               created_at TIMESTAMP DEFAULT NOW(),
                               votes INT DEFAULT 0,
                               article_img_url VARCHAR(1000) DEFAULT 'https://northcoders.com/');`
    ).then(() => {
        const formattedData = articleData.map(
            ({ title,topic,author,body,created_at,votes,article_img_url}) => {
                return [title,topic,author,body,convertTimestampToDate({created_at})['created_at'],votes,article_img_url];
            })
        const SQLquery = format(`INSERT INTO articles(title,topic,author,body,created_at,votes,article_img_url) VALUES %L RETURNING *`, formattedData);
        return db.query(SQLquery);
    })
}

function createComments(commentData) {
    return db.query(
        `CREATE TABLE comments
         (
             comment_id SERIAL PRIMARY KEY,
             article_id INT REFERENCES articles (article_id),
             author     VARCHAR(250) REFERENCES users (username),
             body       TEXT,
             created_at TIMESTAMP,
             votes      INT DEFAULT 0
         );`
    ).then(() => {
        return db.query("SELECT * FROM articles");
    }).then((res) => {
        const linkedData = linkedID(res.rows,commentData,'title','article_title','article_id');
        const formattedData = linkedData.map(
            ({article_id,author,body,created_at,votes}) => {
                return [article_id,author,body,convertTimestampToDate({created_at})['created_at'],votes];
            })
        const SQLquery = format(`INSERT INTO comments(article_id,author,body,created_at,votes) VALUES %L RETURNING *`, formattedData);
        return db.query(SQLquery);
    })
}
module.exports = seed;
