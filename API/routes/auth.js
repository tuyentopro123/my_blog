const router = require('express').Router();

const middlewareControllers = require('../controllers/middlewareControllers');
const authControllers = require('../controllers/authControllers')

// REGISTER
router.post('/register',authControllers.resigterUser)

// LOGIN
router.post('/login',authControllers.loginUser)

// REFRESH
router.post('/refresh',authControllers.requestRefreshToken)

// UPDATE USER
router.put('/:id',middlewareControllers.verifyTokenAndAdminAuth,authControllers.updateUser)

// LOGOUT
router.post('/logout',middlewareControllers.verifyToken,authControllers.userLogout)

// CURRENT USER
router.get('/current/:id',authControllers.getCurrentUSer)

module.exports = router;


