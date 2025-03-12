const db = require("../db/connection");

function fetchUserByUsername (username) {
    return db.query("SELECT * from users where username = $1",[username]).then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status:404,msg: "This user does not exist"})
        }
        return rows;
    })
}


function fetchAllUsers (username)  {
    return db.query("SELECT * from users").then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status:404,msg: "No user found with this id."})
        }
        return rows;
    })
}

module.exports = {fetchUserByUsername,fetchAllUsers}