require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM tb004_dados_empresa", (error, resultado, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      return res.status(200).send({ response: resultado });
    });
  });
});

router.get("/:id_empresa", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM tb004_dados_empresa WHERE id_empresa = ?",
      [req.params.id_empresa],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

router.patch("/edit", (req, res, next) => { 
  mysql.getConnection((error, conn) => {
    conn.query(
      `UPDATE tb004_dados_empresa 
            SET nome = ?,
            sobrenome = ?,   
            email = ?, 
            id_nivel = ?,
            id_status = ?
            WHERE id_empresa = ?`,
      [
        req.body.nome,
        req.body.sobrenome,
        req.body.email,
        req.body.nivel,
        req.body.status,
        req.body.id_empresa,
      ],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(201).send({
          mensagem: "Dados de usuário alterados com sucesso!",
        });
      }
    );
  })
});

router.delete("/delete", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(
      "DELETE FROM tb004_dados_empresa WHERE id_empresa = ?",
      [req.body.id_empresa],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }

        return res.status(202).send({
          mensagem: "Usuário excluido com sucesso!",
        });
      }
    );
  });
});

router.post('/empresa', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO tb004_dados_empresa (razao_social, id_user, endereco, cep, telefone1, telefone2, cnpj, id_segmento, site) VALUES (?,?,?,?,?,?,?,?,?)',
            [
                req.body.razao,
                req.body.id_user,
                req.body.endereco,
                req.body.cep,
                req.body.telefone1,
                req.body.telefone2,
                req.body.cnpj,
                req.body.id_segmento,
                req.body.site,
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
                    mensagem: 'Perfil cadastrado com sucesso!',
                    id_status: resultado.insertId
                });
            }
        )
    })

});

router.post('/entregador', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO tb006_dados_entregador (endereco, cep, telefone1, telefone2, cnh, cpf, id_user, marca_moto, modelo_moto, ano_moto) VALUES (?,?,?,?,?,?,?,?,?,?)',
            [
                req.body.endereco,
                req.body.cep,
                req.body.telefone1,
                req.body.telefone2,
                req.body.cnh,
                req.body.cpf,
                req.body.id_user,
                req.body.marca_moto,
                req.body.modelo_moto,
                req.body.ano_moto,
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
                    mensagem: 'Perfil cadastrado com sucesso!',
                    id_status: resultado.insertId
                });
            }
        )
    })

});


  
  (module.exports = router);
