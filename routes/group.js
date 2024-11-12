const express = require('express');
const router = express.Router();
const groupController = require('../controller/groupController');

const authentication=require('../middleware/jwtAuthentication')
const isAdmin=require('../middleware/isAdmin')
const uerId=require('../middleware/userId')

router.post('/createGroup',authentication,groupController.createGroup)

router.post('/addUser',authentication,isAdmin,uerId,groupController.addUserToGroup)

router.put('/promoteUser',authentication,isAdmin,uerId,groupController.promoteUser)


router.delete('/removeUser',authentication,isAdmin,uerId,groupController.removeUser)



router.get('/allGroup',authentication,groupController.allGroup)
module.exports=router;