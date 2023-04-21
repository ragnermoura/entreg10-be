require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM tb004_projetos", (error, resultado, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      return res.status(200).send({ response: resultado });
    });
  });
});

router.get("/:id_projetos", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM tb004_projetos WHERE id_projetos = ?",
      [req.params.id_projetos],
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
    if (error) {
      return res.status(500).send({ error: error });
    }
    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
      if (errBcrypt) {
        return res.status(500).send({ error: errBcrypt });
      }
      conn.query(
        `UPDATE tb004_projetos 
            SET nome = ?,
            descricao = ?,   
            repositorio = ?, 
            data_ini = ?, 
            data_fim = ?,
            gestor = ?,
            cliente = ?
            WHERE id_projetos = ?`,
        [
          req.body.nome,
          req.body.descricao,
          req.body.repositorio,
          req.body.data_ini,
          req.body.data_fim,
          req.body.gestor,
          req.body.client,
          req.body.id_projetos,
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
    });
  });
});

router.delete("/delete", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error });
    }
    conn.query(
      "DELETE FROM tb004_projetos WHERE id_projetos = ?",
      [req.body.id_projetos],
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

router.post("/cadastro", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "INSERT INTO tb004_projetos (nome, descricao, repositorio, data_ini, data_fim, gestor, cliente) VALUES (?,?,?,?,?,?,?)",
      [
        req.body.nome,
        req.body.descricao,
        req.body.repositorio,
        req.body.data_ini,
        req.body.data_fim,
        req.body.gestor,
        req.body.client,
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
          mensagem: "Projeto cadastrado com sucesso!",
          id_projeto: resultado.insertId,
        });
      }
    );
  });
});

module.exports = router;
