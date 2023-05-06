const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Tb002_nivel = db.define('tb002_nivel',{

    id_nivel:{
        type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
    },
    label: {
        type: DataTypes.STRING(220),
        allowNull: false,
        require: true,
    },
   
   

}, {timestamps: false, freezeTableName: true})


module.exports = Tb002_nivel