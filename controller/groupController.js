const { where } = require('sequelize')
const Group = require('../model/group')
const GroupMember = require('../model/groupMember')
const isAdmin = require('../middleware/isAdmin')


exports.createGroup = async (req, res) => {
    const groupName = req.body.groupName
    try {
        const newGroup = await Group.create({
            name: req.body.groupName
        })
        const userId = req.userId
        const groupId = newGroup.dataValues.id

        const adminGroupMember = await GroupMember.create({
            isAdmin: true,
            userId: userId,
            groupId: groupId
        })
        res.status(201).json(adminGroupMember.dataValues.groupId)

    } catch (error) {
        console.log(error)
    }

}

exports.allGroup = async (req, res) => {
    console.log(req.userId)
    const userId = req.userId

    try {
        const allGroups = await GroupMember.findAll({
            where: {
                userId: userId
            }
        })

        let allGroupsIds = []

        allGroups.forEach(allGroup => {
            allGroupsIds.push(allGroup.dataValues.groupId)
        });

        let allGroupsNames = []

        for (let i = 0; i < allGroupsIds.length; i++) {
            const id = allGroupsIds[i]
            const group = await Group.findOne({
                where: {
                    id: id
                }
            })
            const name = group.dataValues.name
            allGroupsNames.push({ name, id })
        }

        res.status(200).json(allGroupsNames)
    }
    catch (error) {
        console.log(error)
    }
}

exports.addUserToGroup = async (req, res) => {

    try {

        const userId = req.userId
        const groupId = req.groupId

        const existingGroupMember = await GroupMember.findOne({
            where: {
                userId: userId,
                groupId: groupId
            }
        })

        if (existingGroupMember) {
            return res.status(409).json({ message: 'User is already a Member' })
        }

        const newGroupMember = await GroupMember.create({
            userId: userId,
            groupId: groupId
        })


        res.status(201).json({ message: 'user added to group' })
    } catch (error) {
        console.log(error)
    }
}

exports.promoteUser = async (req, res) => {
    try {

        const userId = req.userId
        const groupId = req.groupId

        const existingGroupMember = await GroupMember.findOne({
            where: {
                userId: userId,
                groupId: groupId
            }
        })

        if (!existingGroupMember) {
            return res.status(404).json({ message: 'User is not a Group Member' })
        }

        if (existingGroupMember.dataValues.isAdmin) {
            return res.status(404).json({ message: 'User is already Admin' })
        }

        const updatedMember = await GroupMember.update({ isAdmin: true }, {
            where: {
                userId: userId,
                groupId: groupId
            }
        })
        res.status(200).json({ message: 'User Promoted To Admin' })



    } catch (error) {
        console.log(error)
    }
}


exports.removeUser = async (req, res) => {
    try {

        const userId = req.userId
        const groupId = req.groupId

        const existingGroupMember = await GroupMember.findOne({
            where: {
                userId: userId,
                groupId: groupId
            }
        })

        if (!existingGroupMember) {
            return res.status(404).json({ message: 'User is not a Group Member' })
        }

        if (existingGroupMember.dataValues.isAdmin) {
            return res.status(403).json({ message: 'Can not remove Admin' })
        }

        const deleteGroupMember = await GroupMember.destroy({
            where: {
                userId: userId,
                groupId: groupId
            }
        })
        res.status(200).json({ message: 'User is removed from group' })
    }
    catch (err) {
        console.log(err)
    }
}