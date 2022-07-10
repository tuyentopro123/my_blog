const middlewareControllers = require('../controllers/middlewareControllers');
const postControllers = require('../controllers/postControllers');
const router = require('express').Router();

// CREATE POST
router.post('/post/:id',postControllers.createPost);

// GET ALL POST (FIELD: PROGRAM)
router.get('/program',postControllers.getAllPost)

// GET ALL POST (FIELD: LIFE)
router.get('/life',postControllers.getAllPost)

// GET USER POST
router.get('/:id',postControllers.getPost)

// SEARCH POST
router.get('/path/result',postControllers.postSearch)

// UPDATE POST
router.post('/update/:id',postControllers.updatePost)

// RATE POSTS BY LIKE
router.get('/path/highlight',postControllers.postHighLight)

// NEWEST POST
router.get('/path/new',postControllers.postNew)

// RATE POSTS BY COMMENTS
router.get('/path/comment',postControllers.postComment)

// RANDOM POST
router.get('/path/random',postControllers.getRanDomPost)

// RATE POSTS BY VIEW
router.get('/path/view',postControllers.postView)

// UPLOAD IMAGE POST 
router.post('/upload/post/:id',postControllers.uploadImagePost);

// UPLOAD THUMBNAIL POST 
router.post('/upload/thumb/:id',postControllers.uploadThumbPost);

module.exports = router;