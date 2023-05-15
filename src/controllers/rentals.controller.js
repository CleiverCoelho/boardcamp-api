import { db } from "../database/db.js";
import joi from "joi";

export async function findAllRentals(req, res) {

    try {
        const customers = await db.query(`
            SELECT customers.name AS customer, customers.id AS "customerId", 
                games.name AS game, games.id AS "gameId", rentals.* 
                FROM rentals
                JOIN games 
                    ON games.id=rentals."gameId"
                JOIN customers 
                    ON customers.id=rentals."customerId";`);

                console.log(customers.rows);
            
        const responsePattern = customers.rows.map(customer => {
            return ({
                id: customer.id,
                customerId: customer.customerId,
                gameId: customer.gameId,
                rentDate: new Date(customer.rentDate).toISOString().split('T')[0],
                daysRented: customer.daysRented,
                returnDate: customer.returnDate,
                originalPrice: customer.originalPrice,
                delayFee: customer.delayFee,
                customer: {id: customer.customerId, name: customer.customer},
                game: {id: customer.gameId, name: customer.game} 
            })
        })
        
        res.send(responsePattern);
    } catch (err) {
        res.status(400).send(err.message);
    }
}

export async function createRental(req, res) {

    const {customerId, gameId, daysRented} = req.body;
    if (isNaN(customerId) || isNaN(gameId)) return res.sendStatus(400);

    try {
        // Implemente essa função
        // requisicao para realizar a verificacao do ids de customer e game
        const verificaCustomer = await db.query(`SELECT * FROM customers WHERE id=$1`, [customerId]);
        const verificaGame = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId]);
        const verificaDisponibilidade = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1`, [gameId]);

        let openRentalsCounter = 0;
        verificaDisponibilidade.rows.forEach(rental => {
            if(rental.returnDate === null){
                openRentalsCounter++;
                if(openRentalsCounter === verificaGame.rows[0].stockTotal){
                    return
                }
            }
        })

        if(daysRented <= 0) return res.status(400).send("estoque indisponivel");
        if(openRentalsCounter >= verificaGame.rows[0].stockTotal) return res.status(400).send("estoque indisponivel");
        if(!verificaCustomer.rows[0])return res.status(400).send("customer nao encontrado");
        if(!verificaGame.rows[0]) return res.status(400).send("game nao encontrado");   

        const originalPrice = daysRented * verificaGame.rows[0].pricePerDay;
        const resp = await db.query(`INSERT INTO rentals ("customerId", "gameId", "daysRented", "originalPrice", "rentDate") 
            VALUES ($1, $2, $3, $4, $5)`, [customerId, gameId, daysRented, originalPrice, new Date()])
        res.status(201).send("inserido com sucesso");
    } catch (err) {
        res.status(404).send(err.message);
    }
}

  
