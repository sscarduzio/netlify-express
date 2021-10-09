const configManager = require('../config-manager')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const {Op, QueryTypes} = require('sequelize');
const sendEmail = require('../_helpers/send-email');
const db = require('../_helpers/db');
const Joi = require("joi");
const Role = require("../_helpers/role");
const validateRequest = require("../auth/_middleware/validate-request");
const {custom} = require("joi");

module.exports = {
    getAll: getAllAffiliations,
    create,
    update,
    getById,
    delete: _delete
};

async function getAllAffiliations(email) {
    const emailWrapped = `%${email}%`
    const customerIds = await db.Customer.sequelize.query(
        `SELECT s_id, email, alt_email, billing_address
         FROM customers
         WHERE s_id in (select s_id from subscriptions where status='active')
         AND ( email ILIKE ?
             OR alt_email ILIKE ?);`,
        {
            type: QueryTypes.SELECT,
            replacements: [emailWrapped, emailWrapped],
            raw: true,
        },
    );
    console.log("For email " + email + " query found customers: " + customerIds ? customerIds.map(x => JSON.stringify(x)).join(", ") : customerIds)

    return customerIds;
}

async function getById(id) {
    const customer = await db.Customer.findByPk(id);
    return customer;
}

async function create(params) {
    // validate
    if (await db.Customer.findOne({where: {email: params.email}})) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const account = new db.Account(params);
    account.verified = Date.now();

    // hash password
    account.passwordHash = await hash(params.password);

    // save account
    await account.save();

    return basicDetails(account);
}

async function update(id, params) {
    const customer = await getById(id);
    if((customer.email  + " " + customer.alt_email).split(params.email).length -1 < 2){
        throw  "won't let you lock yourself out"
    }

    params = {
        email: params.email,
        alt_email: params.alt_email,
        billing_address: params.billing_address
    }
    // copy params to account and save
    Object.assign(customer, params);
    customer.updated = Date.now();
    await customer.save();

    return customer;
}

async function _delete(id) {
    const account = await getAccount(id);
    await account.destroy();
}

// helper functions

async function getAccount(id) {
    const account = await db.Account.findByPk(id);
    if (!account) throw 'Account not found';
    return account;
}

