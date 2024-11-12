
const User = require('../model/user');
const Group=require('../model/group')
const Message=require('../model/message')

exports.createMessage=async(req,res)=>{
    try {
    
        const userId=req.userId
            const groupName=req.body.groupName
            const message=req.body.message
    
            const group=await Group.findOne({
                where:{
                    name:groupName,
                }
            })
    
            
            const groupId=group.dataValues.id
    
            const newMessage=await Message.create({
                message:message,
                userId:userId,
                groupId:groupId
            })
            newMessage.dataValues.user = { name: 'you' }
            const newMessageData=newMessage.dataValues
        res.status(201).json({message:'message created',newMessageData})
    } catch (error) {
        console.log(error)
    }

}

exports.allMessage=async(req,res)=>{

    
    try {
        const groupName=req.query.groupName;

    const group=await Group.findOne({
        where:{
            name:groupName,
        }
    })
    
    const groupId=group.dataValues.id

    const messages=await Message.findAll({
        where:{
            groupId:groupId
        },
        limit:10,
        order:[['createdAt', 'DESC']],
        include: [{
            model: User,
            attributes: ['id', 'name',]

        }]
    })
    const userId = req.userId
    const modifiedmessages = messages.map(message => {
        if (message.userId == userId) {
            message.user.name = 'you';
        }

        return message;

    });
    //console.log('message----------',messages[2])
    //console.log('modified-------------',modifiedmessages[2].user)

    res.status(200).json(modifiedmessages)
    } catch (error) {
        console.log(error)
    }
}