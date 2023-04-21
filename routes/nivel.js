const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM tb002_nivel',
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
            'INSERT INTO tb002_nivel (label, descricao) VALUES (?)',
            [
                req.body.label,
                req.body.descricao,
               
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
                    mensagem: 'Nivel cadastrado com sucesso!',
                    id_nivel: resultado.insertId
                });
            }
        )
    })

});

router.get('/:id_nivel', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM tb002_nivel WHERE id_nivel = ?',
            [req.params.id_nivel],
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
            `UPDATE tb002_nivel SET label = ?, descricao = ? WHERE id_nivel = ?`,
            [
                req.body.label,
                req.body.descricao,
                req.body.id_nivel
            ],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                    });
                }
                const response = {
                    mensagem: 'Nivel atualizado com sucesso',
                    nivelEditado: {
                        id_nivel: req.body.id_nivel,
                        nivel: req.body.nivel,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Atualiza um nivel de acesso',
                            url: 'http://localhost:3000/nivel/' + req.body.id_plano
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
            'DELETE FROM tb002_nivel WHERE id_nivel = ?',
            [
                req.body.id_nivel
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