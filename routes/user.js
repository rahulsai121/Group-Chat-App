const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

const authentication=require('../middleware/jwtAuthentication')

router.post('/signup',userController.userPost)
router.post('/login',userController.userLogin)
router.post('/message',authentication,userController.messagePost)


router.get('/message',authentication,userController.messageGet)
module.exports=router;