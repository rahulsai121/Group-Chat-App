const express = require('express');
const router = express.Router();
const messageController = require('../controller/messageController');

const authentication=require('../middleware/jwtAuthentication')

const upload=require('../middleware/upload')


router.post('/createMessage',authentication,messageController.createMessage)


router.get('/allMessage',authentication,messageController.allMessage)

router.post('/createFile',authentication,upload.single('file'),messageController.createFile)



module.exports=router;