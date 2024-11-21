
const User = require('../model/user');
const Group = require('../model/group')
const Message = require('../model/message');
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
require('dotenv').config();

const { where } = require('sequelize');

exports.createMessage = async (req, res) => {
    try {

        const userId = req.userId
        const groupName = req.body.groupName
        const message = req.body.message

        const group = await Group.findOne({
            where: {
                name: groupName,
            }
        })


        const groupId = group.dataValues.id

        const createMessage = await Message.create({
            message: message,
            userId: userId,
            groupId: groupId
        }
        )
        
        const newMessage=await Message.findOne({
            where:{
                id:createMessage.id
            },
            include:[{
                model:User
            }]
        })


        res.status(201).json({ message: 'message created', newMessage })
    } catch (error) {
        console.log(error)
    }

}

exports.allMessage = async (req, res) => {


    try {
        const groupName = req.query.groupName;

        const group = await Group.findOne({
            where: {
                name: groupName,
            }
        })

        const groupId = group.dataValues.id

        const messages = await Message.findAll({
            where: {
                groupId: groupId
            },
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                attributes: ['id', 'name',]

            }]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log(error)
    }
}


exports.createFile = async (req, res) => {
    try {

        const userId = req.userId
        const groupName = req.body.groupName


        const group = await Group.findOne({
            where: {
                name: groupName,
            }
        })


        const groupId = group.dataValues.id

        console.log(groupId,userId)

        
        const fileUrl = req.file.location; // S3 URL of the uploaded file

        console.log(fileUrl)
        const createMessage = await Message.create({
            url: fileUrl,
            userId: userId,
            groupId: groupId
        }
        )
        
        const newMessage=await Message.findOne({
            where:{
                id:createMessage.id
            },
            include:[{
                model:User
            }]
        })


        res.status(201).json({ message: 'message created', newMessage })
    } catch (error) {
        console.log(error)
    }

}
