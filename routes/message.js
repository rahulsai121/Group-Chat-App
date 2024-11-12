const express = require('express');
const router = express.Router();
const messageController = require('../controller/messageController');

const authentication=require('../middleware/jwtAuthentication')


router.post('/createMessage',authentication,messageController.createMessage)


router.get('/allMessage',authentication,messageController.allMessage)


module.exports=router;