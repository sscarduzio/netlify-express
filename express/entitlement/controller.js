const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('../auth/_middleware/authorize')
const Role = require('../_helpers/role');
const affiliationService = require('./affiliation.service');
const accountService = require('../auth/accounts/account.service')
// routes
router.get('/affiliations', authorize(), getAffiliations);
router.get('affiliation/:id', authorize(), getAffiliationByID);

module.exports = router;

async function getAffiliations(req, res, next) {
    console.log("req.  user : ", req.user)
    const user = await accountService.getById(req.user.id)

    return affiliationService.getAll(user.email)
        .then(customers => res.json(customers))
        .catch(next);
}

function getAffiliationByID(req, res, next) {
    affiliationService.getById(req.params.id)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next);
}
