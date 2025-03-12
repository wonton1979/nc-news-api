const {fetchAllUsers,fetchUserByUsername} = require("../models/users.model");

exports.getAllUsers = (request, response, next) => {
    fetchAllUsers().then((users)=>{
        response.status(200).send({users: users})
    }).catch((error)=>{
        next(error);
    })
}

exports.getUserByUsername = (request, response, next) => {
    const {username} = request.params;
    fetchUserByUsername(username).then((user)=>{
        response.status(200).send({user: user})
    }).catch((error)=>{
        next(error);
    })
}