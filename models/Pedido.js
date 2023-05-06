const { DataTypes } = require('sequelize')

const db = require('../db/conn')
const Tb001_user = require('./User')
const Tb003_status = require('./Status')

const Tb007_pedido = db.define('tb007_pedido',{

    idpedidos:{
        type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
    },
    nome_cliente: {
        type: DataTypes.STRING(200),
        allowNull: true,
        require: false,
    },
    endereco_entrega: {
        type: DataTypes.STRING(220),
        allowNull: true,
        require: false,
    },
    numero_entrega: {
        type: DataTypes.STRING(50),
        allowNull: true,
        require: false,
    },
    cep: {
        type: DataTypes.STRING(220),
        allowNull: true,
        require: false,
    },
    telefone1: {
        type: DataTypes.STRING(220),
        allowNull: true,
        require: false,
    },
    valor_pedido: {
        type: DataTypes.STRING(220),
        allowNull: true,
        require: false,
    },
    metodo_pagamento: {
        type: DataTypes.STRING(220),
        allowNull: true,
        require: false,
    },
    aceito: {
        type: DataTypes.STRING(255),
        allowNull: true,
        require: false,
    },
    data_pedido: {
        type: DataTypes.DATE,
        allowNull: true,
        require: false,
    },
   

}, {
    timestamps: false,
     freezeTableName: true})


Tb007_pedido.belongsTo(
    Tb001_user,
    {
        foreignKey: 'id_solicitante',
        constraints: true,
        foreignKeyConstraint: 'id_solicitante'
    }
)

Tb007_pedido.belongsTo(
    Tb001_user,
    {
        foreignKey: 'id_entregador',
        constraints: true,
        foreignKeyConstraint: 'id_entregador'
    }
)


Tb007_pedido.belongsTo(
    Tb003_status,
    {
        foreignKey: 'id_status',
        constraints: true,
        foreignKeyConstraint: 'id_status'
    }
)

module.exports = Tb007_pedido