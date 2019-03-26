const express = require("express");
const router = express.Router();
const config = require("../config");
const Board = require("../models/boards.model");
const List = require("../models/lists.model");
const Card = require("../models/cards.model");
const Comment = require("../models/comments.model");

//create a list with board id and update the board with the list id
router.post(config.createList, (req, res, next) => {
  List.create(req.body).then(list => {
      Board.findById(req.body.board).then(board => {
          if(board.list.indexOf(list._id)  === -1) board.lists.push(list._id);
          board.save();
          res.json(list);
        }).catch(error => {
            next(error);
        });
    }).catch(error => {
        next(error);
    });
});

//delete a list with id and delete that list from board
router.delete(config.deleteList, (req, res, next) => {
  List.findById(req.params.id).then(list => {
      List.deleteOne({ _id: req.params.id }).then(response => {
          Card.deleteMany({ list: req.params.id }).then(card => {
              for (let i = 0; i < list.cards.length; i++) {
                Comment.deleteMany({ card: list.cards[i] })
                  .then(comment => {
                    if (i === list.cards.length - 1) {
                      Board.findById(req.params.boardId).then(board => {
                          board.lists.splice(board.lists.indexOf(req.params.id),1);
                          board.save();
                          res.json(board);
                        }).catch(error => {
                            next(error);
                        });
                    }
                  }).catch(error => {
                    next(error);
                  });
              }
            }).catch(error => {
                next(error);
            });
        }).catch(error => {
            next(error);
        });
    }).catch(error => {
        next(error);
    });
});

module.exports = router;
