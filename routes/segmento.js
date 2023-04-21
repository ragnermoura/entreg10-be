const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM tb005_segmento',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )

    })
});

router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO tb005_segmento (label) VALUES (?)',
            [
                req.body.label,
               
            ],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: 'Status cadastrado com sucesso!',
                    id_segmento: resultado.insertId
                });
            }
        )
    })

});

router.get('/:id_segmento', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM tb005_segmento WHERE id_segmento = ?',
            [req.params.id_segmento],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )

    })
});

router.patch('/edit', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE tb005_segmento SET label = ? WHERE id_segmento = ?`,
            [
                req.body.label,
                req.body.id_segmento
            ],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                    });
                }
                const response = {
                    mensagem: 'Status atualizado com sucesso',
                    statusEditado: {
                        id_segmento: req.body.id_segmento,
                        status: req.body.status,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Atualiza um status de acesso',
                            url: 'http://localhost:3000/status/' + req.body.id_segmento
                        }
                    }
                }
                res.status(201).send(response);
            }
        )
    })
});

router.delete('/delete', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error }) }
        conn.query(
            'DELETE FROM tb005_segmento WHERE id_segmento = ?',
            [
                req.body.id_segmento
            ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                return res.status(202).send({
                    mensagem: 'Dados excluido com sucesso!'
                });
            }
        )
    })
});

module.exports = router;