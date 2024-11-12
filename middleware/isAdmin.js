const { where } = require('sequelize')
const Group=require('../model/group')
const GroupMember=require('../model/groupMember')
const isAdmin = async(req, res, next) => {
    
    try {

        const userId=req.userId
        const groupName=req.body.group

        const group=await Group.findOne({
            where:{
                name:groupName,
            }
        })

        if(!group){
            return res.status(404).json({message:'Group is not found'})
        }

        const groupId=group.dataValues.id
        const groupAdmin=await GroupMember.findOne({
            where:{
                userId:userId,
                groupId:groupId
            }
        })
        if(!groupAdmin){
            return res.status(404).json({message:'Your not in that Group'})
        }

        if(!groupAdmin.dataValues.isAdmin){
            return res.status(403).json({message:'Your not the admin'})

        }

        req.groupId=groupId
        next();
        
    } 
    catch (err) {
        console.log(err)
    }
}

module.exports=isAdmin