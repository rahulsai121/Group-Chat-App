const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/signup',userController.userpost)

module.exports=router;