import express from "express";
import generateUniqueId from "generate-unique-id";
import {createAccount, fundAccount, getAccount, transferFunds, withdrawFund} from "../services/account.service.js";

const router = express.Router();

// A user can create an account
router.post('/account', async (req, res, next) => {
    try {
        const db = req.app.get("db");
        let accountDetails = {
            id: generateUniqueId({length: 10, useLetters: false}),
            balance: req.body.balance
        }
        await createAccount(db, accountDetails)
        const account = await getAccount(db, accountDetails.id);
        return res.status(201).json(account);
    } catch (e) {
        console.error(e);
        return res.status(400).json({
            error: e
        })
    }
});

// A user can fund their account
router.post("/fund", async (req, res, next) => {
    try {
        const db = req.app.get("db");
        const {account, amount} = req.body;
        await fundAccount(db, account, amount);
        res.status(200).json({
            message: "account funded successfully",
        })
    } catch (e) {
        console.error(e);
        res.status(400).json({
            error: e
        })
    }
})

// A user can transfer funds to another user’s account
router.post("/transfer", async (req, res) => {
    const db = req.app.get("db");
    const transactionProvider = db.transactionProvider();
    const transaction = await transactionProvider();

    try {
        const response = await transferFunds(db, req.body, transaction);
        await transaction.commit();
        res.status(200).json({
            message: response
        });
    } catch (error) {
        if (error.code !== "40001") {
            console.error(error.message);
            res.status(400).json({
                error: error.message
            })
        } else {
            console.log(error.message);
            await transaction.rollback();
            res.status(400).json({
                message: "transfer funds failed"
            })
        }
    }

})

// A user can withdraw funds from their account.
router.post("/withdraw", async (req, res) => {
    const db = req.app.get("db");
    try {
        const response = await withdrawFund(db, req.body);
        res.status(200).json({
            message: response
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        })
    }
})
export default router;
