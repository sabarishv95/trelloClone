const express = require("express");
const router = express.Router();
const config = require("../config");
const Board = require("../models/boards.model");
const List = require("../models/lists.model");
const Card = require("../models/cards.model");
const Comment = require("../models/comments.model");

const deleteComments = (list, boardId, next, res) => {
  Comment.deleteMany({ card: { $in: list.cards } })
    .then(comment => {
      deleteListsFromBoard(boardId, list._id, next, res);
    })
    .catch(error => {
      next(error);
    });
};

const deleteListsFromBoard = (boardId, listId, next, res) => {
  Board.findById(boardId)
    .then(board => {
      if (board.lists.indexOf(listId) >= 0)
        board.lists.splice(board.lists.indexOf(listId), 1);
      board.save();
      res.json(board);
    })
    .catch(error => {
      next(error);
    });
};

//create a list with board id and update the board with the list id
router.post(config.createList, (req, res, next) => {
  List.create(req.body)
    .then(list => {
      Board.findById(req.body.board)
        .then(board => {
          if (board.lists.indexOf(list._id) === -1) board.lists.push(list._id);
          board.save();
          res.json(list);
        })
        .catch(error => {
          next(error);
        });
    })
    .catch(error => {
      next(error);
    });
});

//delete a list with id and delete that list from board
router.delete(config.deleteList, (req, res, next) => {
  List.findOneAndDelete({ _id: req.params.id })
    .then(list => {
      if (list.cards.length !== 0) {
        Card.deleteMany({ _id: { $in: list.cards } })
          .then(card => {
            deleteComments(list, req.params.boardId, next, res);
          })
          .catch(error => {
            next(error);
          });
      } else {
        deleteListsFromBoard(req.params.boardId, req.params.id, next, res);
      }
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
