import express from "express";
import generateUniqueId from "generate-unique-id";
import {createAccount, fundAccount, getAccount, transferFunds, withdrawFund} from "../services/account.service.js";

const router = express.Router();

// Test
router.get('/beforeAll', async (req, res) => {
    try {
        const db = req.app.get("db");

        await db.migrate.rollback();
        await db.migrate.latest();
        console.log("beforeAll")

        await db.seed.run()
        console.log("beforeAll seed")
        res.status(200).json({
            message: "Database migrated and seeded"
        })
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
});


router.get('afterAll', async (req, res) => {
    console.log("afterAll")
    const db = req.app.get("db");
    try {
        await db.migrate.rollback();
        res.status(200).json({message: "Done"});
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
})


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
router.post("/fund", ensureAuthenticated, async (req, res, next) => {
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
router.post("/transfer", ensureAuthenticated, async (req, res) => {
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
// '7142028821', '450'
router.post("/withdraw", ensureAuthenticated, async (req, res) => {
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

async function ensureAuthenticated(req, res, next) {
    const db = req.app.get("db");
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                status: 'error',
                data: {message: "You have to login"}
            });
        }
        const token = req.headers.authorization.split(' ')[1];
        const user = await db
            .from("accounts")
            .select("*")
            .where("id", token)
            .first()
        console.log(user);
        // check for valid app users
        if (!user) {
            console.log("ensureAuthenticated")
            return res.status(401).json({
                status: 'error',
                data: { message: "Invalid token provided" }
            })
        }
        next()
        // return next();
    } catch (err) {
        return res.status(400).json({
            status: 'error',
            data: {message: err.message}
        })
    }
}

export default router;
