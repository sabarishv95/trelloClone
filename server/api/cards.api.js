const express = require("express");
const router =  express.Router();
const config = require('../config');
const Board = require('../models/boards.model');
const List = require('../models/lists.model');
const Card = require('../models/cards.model');
const Comment = require('../models/comments.model')

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

router.put(config.updateCard, (req, res, next) => {
    Card.findOneAndUpdate({ _id : req.params.id }, {
        $set: {
            ...req.body
        }
    }, { new : true } ).then((card) => {
        res.json(card)
    }).catch((error) => {
        next(error)
    })
})

router.delete(config.deleteCard, (req, res, next) => {
    Card.deleteOne({ _id: req.params.id }).then((cardDeleted) => {
        Comment.deleteMany({ card : req.params.id }).then((commentDeleted) => {
            List.findById(req.params.listId).then((list) => {
                list.cards.splice(list.cards.indexOf(req.params.id), 1);
                list.save();
                res.json(list);
            }).catch((error) => {
                next(error)
            })
        }).catch((error) => {
            next(error)
        })
    }).catch((error) => {
        next(error)
    })
})

router.put(config.moveCard, (req, res, next) => {
    List.findById(req.params.fromList).then((fromList) => {
        fromList.cards.splice(fromList.cards.indexOf(req.params.id), 1);
        fromList.save();
        Card.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                list: req.params.toList
            }
        }, { new : true }).then((card) => {
            List.findById(req.params.toList).then((toList) => {
                toList.cards.push(card._id);
                toList.save();
                res.json(toList);
            }).catch((error) => {
                next(error);
            })
        }).catch((error) => {
            next(error)
        })
    }).catch((error) => {
        next(error);
    })
})

module.exports = router;