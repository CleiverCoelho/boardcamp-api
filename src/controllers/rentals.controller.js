import { db } from "../database/db.js";
import joi from "joi";

export async function findAllRentals(req, res) {

    const {status, startDate} = req.query;

    try {
        const customers = await db.query(`
            SELECT customers.name AS customer, customers.id AS "customerId", 
                games.name AS game, games.id AS "gameId", rentals.* 
                FROM rentals
                JOIN games 
                    ON games.id=rentals."gameId"
                JOIN customers 
                    ON customers.id=rentals."customerId"
                WHERE rentals."rentDate">$1`, [`${startDate ? startDate : "2000-01-01"}`]);
            
        const responsePattern = customers.rows.map(customer => {
            if(status === "open"){
                if(customer.returnDate === null){
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
                }else {
                    return
                }
            }
            if(status === "closed"){
                if(customer.returnDate !== null){
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
                }  else {
                    return
                }
            }

            // caso status nao receba parametro na query ele retorna tudo sempre
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
        
        // filter vai retornar apenas valores !== null que vieram do map
        const filteredResponsePattern = responsePattern.filter((obj => obj))
        res.send(filteredResponsePattern);
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

export async function closeRental(req, res) {

    const id = Number(req.params.id);
    if(isNaN(id)) return res.sendStatus(400);

    try {
        // Implemente essa função
        // requisicao para realizar a verificacao do ids de customer e game
        const verificaRental = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
        if(!verificaRental.rowCount) return res.status(404).send("aluguel nao existe")
        if(verificaRental.rows[0].returnDate) return res.status(400).send("aluguel ja foi finalizado")
        
        const rentDate = verificaRental.rows[0].rentDate;
        const returnDate = new Date();
        const timeDiff = Math.abs(returnDate.getTime() - rentDate.getTime());
        const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24)); 
        
        const daysRented = verificaRental.rows[0].daysRented;
        const originalPrice = verificaRental.rows[0].originalPrice;
        const pricePerDelay = originalPrice / daysRented;
        let delayFee = 0;
        if(diffDays > daysRented){
            delayFee = (diffDays - daysRented) * pricePerDelay;
        }

        if(delayFee <= 0) {
            delayFee = null;
        }
        // console.log(diffDays);
        // console.log(delayFee);
        const updateRental = await db.query(`UPDATE rentals SET "delayFee"=$1, "returnDate"=$2 WHERE id=$3`,
            [delayFee, returnDate, id])
        res.sendStatus(200);
    } catch (err) {
        res.status(404).send(err.message);
    }
}

export async function deleteRental(req, res) {

    const id = Number(req.params.id);
    if(isNaN(id)) return res.sendStatus(400);

    try {
        // Implemente essa função
        // requisicao para realizar a verificacao do ids de customer e game
        const verificaRental = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
        if(!verificaRental.rowCount) return res.status(404).send("aluguel nao existe")
        if(!verificaRental.rows[0].returnDate) return res.status(400).send("aluguel ainda nao foi finalizado")
        
        const deleteRental = await db.query(`DELETE FROM rentals WHERE id=$1`, [id]);
        res.sendStatus(200);
    } catch (err) {
        res.status(404).send(err.message);
    }
}


  
