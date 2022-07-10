const router = require('express').Router();

const middlewareControllers = require('../controllers/middlewareControllers');
const authControllers = require('../controllers/authControllers')

// REGISTER
router.post('/register',authControllers.resigterUser)

// LOGIN
router.get('/login',authControllers.loginUser)

// UPDATE USER
router.put('/:id',middlewareControllers.verifyTokenAndAdminAuth,authControllers.updateUser)

// LOGOUT
router.get('/logout',authControllers.userLogout)


module.exports = router;


