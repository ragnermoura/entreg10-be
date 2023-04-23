const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const nodemailer = require("nodemailer");

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM tb005_atividade',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )

    })
});

router.get('/calculate/:id_user', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT SUM(tempo) as total_tempo FROM tb005_atividade WHERE id_user = ? AND date_send = CURDATE();',
            [req.params.id_user],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )
    })
});

router.post('/envio', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO tb008_envio (estado, nome) VALUES (?,?)',
            [
                req.body.estado,
                req.body.nome,
               
            ],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }else{
                    async function main() {
                               
                        let testAccount = await nodemailer.createTestAccount(); 
                        let transporter = nodemailer.createTransport({
                            host: "smtp.office365.com",
                            port: 587,
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'team.kbz@knowledgebiz.pt', // generated ethereal user
                                pass: '', // generated ethereal password
                            },
                            tls: {
                                ciphers: 'SSLv3',
                                rejectUnauthorized: false
                              },
                        });
    
                        let info = await transporter.sendMail({
                            from: '"Time Knowledge Biz 🚀" <team.kbz@knowledgebiz.pt>', // sender address
                            to:  'willian.moura@knowledgebiz.pt', // list of receivers
                            subject: "Acabou de chegar o relatório de "+req.body.nome+ " ✔", // Subject line
                            // text: "Hello world?", // plain text body
                            html: "<div style='background-color: #04193a; width: 100%; height: 80px; text-align: center;'></div><div><h1 style='color: #04193a; text-align: center;'>Vá até o seu Ambiente e veja como está a ser o dia de sua equipa</h1><h5 style='color: #767675; text-align: center;'>KNOWLEDGEBIZ © 2023 ALL RIGHTS RESERVED</h5><h5 style='color: #767675; text-align: center;'><b>Group</b> Rua Marcos Assunção, nº4 | Almada</h5>", // html body
                            
                        });
    
                        console.log("Message sent: %s", info.messageId);
                        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
                       
                        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                    }
    
                    main().catch(console.error);

                }
                res.status(201).send({
                    mensagem: 'Atividade cadastrado com sucesso!',
                    id_envio: resultado.insertId

                  
                });

               
            }
        )
    })

});

router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO tb005_atividade (projeto, tempo, brief, deadline, blocking, observation, nome_user, id_user) VALUES (?,?,?,?,?,?,?,?)',
            [
                req.body.projeto,
                req.body.tempo,
                req.body.brief,
                req.body.deadline,
                req.body.blocking,
                req.body.observation,
                req.body.nome_user,
                req.body.id_user,
               
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
                    mensagem: 'Atividade cadastrado com sucesso!',
                    id_atividade: resultado.insertId
                });
            }
        )
    })

});

router.get('/:id_user', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM tb005_atividade WHERE id_user = ? AND date_send = CURDATE();',
            [req.params.id_user],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: resultado })
            }
        )

    })
});

router.get('/:id_atividade', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM tb005_atividade WHERE id_atividade = ?',
            [req.params.id_atividade],
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
            `UPDATE tb005_atividade SET projeto = ?, tempo = ?, brief = ?, deadline = ?, blocking = ?, observation = ?, nome_user = ?, id_user = ?  WHERE id_atividade = ?`,
            [
                req.body.projeto,
                req.body.tempo,
                req.body.biref,
                req.body.deadline,
                req.body.blocking,
                req.body.observation,
                req.body.nome_user,
                req.body.id_user,
            ],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                    });
                }
                const response = {
                    mensagem: 'Atividade atualizado com sucesso',
                    nivelEditado: {
                        id_atividade: req.body.id_atividade,
                        nivel: req.body.nivel,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Atualiza um nivel de acesso',
                            url: 'https://entreg10.com.br:21038/nivel/' + req.body.id_plano
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
            'DELETE FROM tb005_atividade WHERE id_atividade = ?',
            [
                req.body.id_atividade
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