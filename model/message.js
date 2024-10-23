const Sequelize=require('sequelize')
const sequelize=require('../utility/database')


const message=sequelize.define('message',{
    id:{
      type:Sequelize.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true
    },
    message:{
      type:Sequelize.TEXT,
      allowNull:false,
    },
  })
  
  module.exports=message;