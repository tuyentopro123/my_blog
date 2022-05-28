const middlewareControllers = require('../controllers/middlewareControllers');
const commentControllers = require('../controllers/commentControllers');
const router = require('express').Router();

// CREATE COMMENT
router.post("/comment",middlewareControllers.verifyToken,commentControllers.createComment);

// DELETE COMMENT
router.post("/:id",middlewareControllers.verifyTokenAndAdminAuth,commentControllers.deleteComment);

// GET COMMENT
router.get("/comment/:id",middlewareControllers.verifyToken,commentControllers.getComment);

// INTER OF COMMENT
router.post("/inter/:id",middlewareControllers.verifyToken,commentControllers.interComment);

// GET REPLY OF COMMENT
router.get("/reply/:id",middlewareControllers.verifyToken,commentControllers.replyComment);

module.exports = router;