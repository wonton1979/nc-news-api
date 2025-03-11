const db = require("../db/connection");

exports.fetchUserByUsername = (username) => {

    return db.query("SELECT * from users where username = $1",[username]).then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status:404,msg: "This user does not exist"})
        }
        return rows;
    })
}