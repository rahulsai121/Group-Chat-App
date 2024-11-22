const Sequelize=require('sequelize')
const sequelize=require('../utility/database')


const archivedMessage=sequelize.define('archivedmessage',{
    id:{
      type:Sequelize.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true
    },
    message:{
      type:Sequelize.TEXT,
      allowNull:true,
    },
    url:{
      type:Sequelize.TEXT,
      allowNull:true
    }
  })
  
  module.exports=archivedMessage;