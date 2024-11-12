const Sequelize = require('sequelize')
const sequelize = require('../utility/database')


const groupmember = sequelize.define('groupMember', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

module.exports = groupmember;