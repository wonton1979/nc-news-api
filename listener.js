const app = require("./app");

app.listen(8080,(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Server Listening on port 8080");
    }
});