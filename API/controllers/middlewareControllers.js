const middlewareControllers = {
    verifyTokenAndAdminAuth: (req, res, next) => {
            if(req.user._id === req.params.id  || req.user.admin ) {
                next();
            }else {
                return res.status(401).json("you are not allowed to delete other")
            }
    }
}


module.exports = middlewareControllers;