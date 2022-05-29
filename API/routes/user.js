const middlewareControllers = require('../controllers/middlewareControllers');
const userController = require('../controllers/userControllers');

const router = require('express').Router();

// GET ALL USER
router.get('/author',userController.getAllUsers);

// GET TOP USER
router.get('/top',userController.getTopUsers);

// GET USER
router.get('/:id',middlewareControllers.verifyToken,userController.getUser);

// DELETE USER
router.delete('/:id',middlewareControllers.verifyTokenAndAdminAuth,userController.deleteUser); 

// GET NOTIFICATION OF USER
router.get('/noti/:id',middlewareControllers.verifyToken,userController.getNofitication); 

// GET NOTIFICATION OF USER
router.post('/check/:id',middlewareControllers.verifyTokenAndAdminAuth,userController.accessNofitication); 

// UPLOAD IMAGE USER 
router.post('/upload/user/:id',middlewareControllers.verifyTokenAndAdminAuth,userController.uploadImage);

module.exports = router;