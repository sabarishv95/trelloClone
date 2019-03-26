const express = require("express");
const router =  express.Router();
const config = require('../config');
const Board = require('../models/boards.model');
const List = require('../models/lists.model');
const Card = require('../models/cards.model');

//create a card with list id and update the list with the card id
router.post(config.createCard, (req, res, next) => {
    Card.create(req.body).then((card) => {
        List.findById(req.body.list).then((list) => {
            list.cards.push(card._id);
            list.save();
            res.json(card);
        }).catch((error) => {
            next(error);
        })
    }).catch((error) => {
        next(error);
    })
})

module.exports = router;