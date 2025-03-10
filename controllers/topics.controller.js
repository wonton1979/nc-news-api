const {fetchAllTopics} = require("../models/topics.model")

function getAllTopics(request, response) {
    fetchAllTopics().then((data) => {
        if ((data).length > 0) {
            response.status(200).send({ owners: data });
        }
        else
        {
            response.status(404).send({msg:"Owners Not Found"});
        }
    });
}


module.exports = { getAllTopics};