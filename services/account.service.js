
export async function createAccount(db, accountDetails) {
    return db
        .insert(accountDetails)
        .into("accounts")
}

export async function getAccount(db, id) {
    return db
        .from("accounts")
        .select("*")
        .where("id", id)
        .first()
}

export async function fundAccount(db, account, amount) {
    return db
        .from("accounts")
        .update({
            balance: db.raw(`balance + ${amount}`),
        })
        .where({
            id: account,
        });
}

export async function withdrawFund(db, data) {
    const {account, amount} = data;
    const rows = await db("accounts")
        .select("balance")
        .where({
            id: account,
        })

    const acctBal = rows[0].balance;
    if (acctBal < amount) {
        return `insufficient funds for account ${account}`;
    }
    await db("accounts")
        .update({
            balance: db.raw(`balance - ${amount}`),
        })
        .where({
            id: account,
        })
    return `${amount} withdraw from account ${account}`;

}

export async function transferFunds(db, data, transaction) {
    const {from, to, amount} = data;

    const rows = await db("accounts")
        .transacting(transaction)
        .select("balance")
        .where({
            id: from,
        });

    const acctBal = rows[0].balance;
    if (acctBal < amount) {
        return `insufficient funds for account ${from}`;
    }
    await db("accounts")
        .transacting(transaction)
        .update({
            balance: db.raw(`balance - ${amount}`),
        })
        .where({
            id: from,
        });

    await db("accounts")
        .transacting(transaction)
        .update({
            balance: db.raw(`balance + ${amount}`),
        })
        .where({
            id: to,
        });

    return `funds transfer successful`;
}
