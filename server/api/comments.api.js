const express = require("express");
const router =  express.Router();
const config = require('../config');
const Board = require('../models/boards.model');
const List = require('../models/lists.model');
const Card = require('../models/cards.model');
const Comment = require('../models/comments.model');

//create a comment with card id and update the card with the comment id
router.post(config.createComment, (req, res, next) => {
    Comment.create(req.body).then((comment) => {
        Card.findById(req.body.card).then((card) => {
            if(card.comments.indexOf(comment._id) === -1) card.comments.push(comment._id);
            card.save();
            res.json(comment);
        }).catch((error) => {
            next(error);
        })
    }).catch((error) => {
        next(error);
    })
})

router.put(config.updateComment, (req, res, next) => {
    Comment.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            ...req.body
        }
    }, { new : true }).then((comment) => {
        res.json(comment)
    }).catch((error) => {
        next(error);
    })
})

module.exports = router;