const {fetchAllTopics,insertNewTopic} = require("../models/topics.model")

function getAllTopics(request, response, next) {
    fetchAllTopics().then((data) => {
        response.status(200).send({ topics: data });
    }).catch(error => {
        next(error)
    });
}

function postNewTopic (request, response, next){
    insertNewTopic(request.body).then((newTopic)=>{
        response.status(201).send({'new_topic': newTopic});
    }).catch((error)=>{
        next(error);
    });
}

module.exports = {getAllTopics,postNewTopic};