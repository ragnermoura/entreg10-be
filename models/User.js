const { DataTypes } = require('sequelize')

const db = require('../db/conn')
const Tb002_nivel = require('./Nivel')
const Tb003_status = require('./Status')

const Tb001_user = db.define('tb001_user',{

    id_users:{
        type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
    },
    nome: {
        type: DataTypes.STRING(220),
        allowNull: false,
        require: true,
    },
    sobrenome: {
        type: DataTypes.STRING(220),
        allowNull: false,
        require: true,
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        require: true,
    },
    senha: {
        type: DataTypes.STRING(150),
        allowNull: false,
        require: true,
    },
    foto_user: {
        type: DataTypes.STRING(300),
        allowNull: false,
        require: true,
    },
   

}, {timestamps: false, freezeTableName: true})


Tb001_user.belongsTo(
    Tb002_nivel,
    {
        foreignKey: 'id_nivel',
        constraints: true,
        foreignKeyConstraint: 'id_nivel'
    }
)
Tb001_user.belongsTo(
    Tb003_status,
    {
        foreignKey: 'id_status_user',
        constraints: true,
        foreignKeyConstraint: 'id_status_user'
    }
)



module.exports = Tb001_user