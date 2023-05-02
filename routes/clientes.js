const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT tb004_dados_empresa.*, tb005_segmento.*, tb001_user.* FROM tb004_dados_empresa JOIN tb001_user ON tb004_dados_empresa.id_user = tb001_user.id_users JOIN tb005_segmento ON tb004_dados_empresa.id_segmento = tb005_segmento.id_segmento;',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )

    })
});




module.exports = router;