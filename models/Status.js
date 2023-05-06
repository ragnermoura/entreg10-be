const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Tb003_status = db.define('tb003_status',{

    id_status:{
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


module.exports = Tb003_status