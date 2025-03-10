exports.customErrorController = (err,req,res,next) => {
    if(err.status){
        res.status(err.status).send(err);
    }
    next(err);
}

exports.serverErrorController = (err,req,res,next) => {
    res.status(500).send({msg:'Server Error'});
}

