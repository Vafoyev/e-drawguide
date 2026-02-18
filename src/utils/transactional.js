const { sequelize } = require('../database');
const { Transaction } = require('sequelize');

module.exports = (fn) => {
    return async (...args) => {
        let transaction = null;
        let transactionIndex = -1;

        for (let i = 0; i < args.length; i++) {
            if (args[i] instanceof Transaction) {
                transaction = args[i];
                transactionIndex = i;
                break;
            }
        }

        if (transaction) {
            return await fn(...args);
        }

        const newTransaction = await sequelize.transaction();
        try {
            const result = await fn(...args, newTransaction);
            await newTransaction.commit();
            return result;
        } catch (error) {
            await newTransaction.rollback();
            throw error;
        }
    };
};