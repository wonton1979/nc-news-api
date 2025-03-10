exports.psqlErrorController = (err,req,res,next) => {
    if(err.code === "22P02"){
        res.status(400).send({msg:'Bad Request'});
    }
    next(err);
}

exports.customErrorController = (err,req,res,next) => {
    if(err.status){
        res.status(err.status).send(err);
    }
    next(err);
}

exports.serverErrorController = (err,req,res,next) => {
    res.status(500).send({msg:'Server Error'});
}

