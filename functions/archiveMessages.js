const Message = require('../model/message')
const ArchivedMessage = require('../model/archivedMessage')
const { Op } = require('sequelize');
async function archivedOldMessage() {
    try {
        const toDay = new Date()
        toDay.setDate(toDay.getDate())

        const oldMessages = await Message.findAll({
            where: {
                createdAt: {
                    [Op.lt]: toDay,
                }
            }
        })

        if (oldMessages.length > 0) {
            await ArchivedMessage.bulkCreate(oldMessages.map(message => ({
                userId: message.userId,
                groupId: message.groupId,
                message: message.message,
                createdAt: message.createdAt,
            })));

        

        await Message.destroy({
            where: {
                createdAt: {
                    [Op.lt]: oneDayAgo,
                },
            },
        });
        console.log(`Archived and deleted ${oldMessages.length} messages.`);
    }
    else{
        console.log('No messages to archive.')
    }

    } catch (error) {
        console.error('Error archiving messages:', error);
    }
}
module.exports = archivedOldMessage