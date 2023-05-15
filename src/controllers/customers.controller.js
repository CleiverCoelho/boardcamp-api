import { db } from "../database/db.js";
import joi from "joi";

export async function findAllCustomers(req, res) {

    try {
        const customers = await db.query("SELECT * FROM customers;");
        customers.rows.forEach(customer => customer.birthday = new Date(customer.birthday).toISOString().split('T')[0])
        res.send(customers.rows);
        // res.send("ok")
    } catch (err) {
        res.status(400).send(err.message);
    }
}

export async function findCustomersById(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.sendStatus(400);

  try {
    // Implemente essa função

    const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [id])
    // trata a data de aniversario para o jeito esperado pela requisicao "yyyy/mm/dd"
    customer.rows[0].birthday = new Date(customer.rows[0].birthday).toISOString().split('T')[0];
    res.status(201).send(customer.rows[0]);
  } catch (err) {
    res.status(404).send(err.message);
  }
}

export async function createCustomer(req, res) {
  const { name, phone, cpf, birthday} = req.body;

  const useSchemaCadastro = joi.object({
    name: joi.string().required(),
    phone: joi.string().required(),
    cpf: joi.string().required(),
    birthday: joi.string().pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/, {
        name: "date yyyy/mm/dd",
    }).required()
  })

  if(isNaN(cpf) || cpf.split('').length !== 11 || (phone.split('').length !== 11 && phone.split('').length !== 10)) return res.status(400).send("valores invalidos")

  const validacao = useSchemaCadastro.validate(req.body, {abortEarly: false})
  if (validacao.error) {
      const errors = validacao.error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  try {
    // Implemente essa função também

    const cpfJaCadastrado = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);
    console.log(cpfJaCadastrado)
    if(cpfJaCadastrado.rowCount) return res.status(409).send("usuario ja cadastrado")

    await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, 
        [name, phone, cpf, birthday]);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function updateCustomer(req, res) {
    const id = Number(req.params.id);
    const { name, phone, cpf, birthday} = req.body;

    if (isNaN(id)) return res.sendStatus(400);
  
    const useSchemaCadastro = joi.object({
      name: joi.string().required(),
      phone: joi.string().required(),
      cpf: joi.string().required(),
      birthday: joi.string().pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/, {
          name: "date yyyy/mm/dd",
      })
    })
  
    if(isNaN(cpf) || cpf.split('').length !== 11 || (phone.split('').length !== 11 && phone.split('').length !== 10)) return res.status(400).send("valores invalidos")
  
    const validacao = useSchemaCadastro.validate(req.body, {abortEarly: false})
    if (validacao.error) {
        const errors = validacao.error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }
    const cpfJaCadastrado = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);
    // console.log(cpfJaCadastrado.rows[0])
    if(cpfJaCadastrado.rows[0].id !== id) return res.status(409).send("id de outro usuario ja cadastrado");
    
  
    try {
      // Implemente essa função também

      await db.query(`UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5`,
          [name, phone, cpf, birthday, id]);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
  
