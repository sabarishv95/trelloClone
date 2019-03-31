const express = require("express");
const router = express.Router();
const config = require("../config");
const Board = require("../models/boards.model");

//create an empty board
router.post(config.createBoard, (req, res, next) => {
  Board.create(req.body).then(board => {
      res.json(board);
    }).catch(error => {
        next(error);
    });
});

//find all boards with their corresponding lists, cards and comments
router.get(config.findAllBoards, (req, res, next) => {
  Board.find({})
    .populate("lists")
    .populate({
      path: "lists",
      populate: {
        path: "cards",
        model: "Cards"
      }
    })
    .populate({
        path: "lists",
        populate: {
          path: "cards",
          populate: {
            path: "comments",
            model: "Comments"
          }
        }
      }).then((boards) => {
        res.json(boards)
    }).catch((error) => {
        next(error);
    })
});

//find one board with its ID
router.get(config.findOneBoard, (req, res, next) => {
  Board.findById(req.params.id)
    .populate("lists")
    .populate({
      path: "lists",
      populate: {
        path: "cards",
        model: "Cards"
      }
    })
    .populate({
        path: "lists",
        populate: {
          path: "cards",
          populate: {
            path: "comments",
            model: "Comments"
          }
        }
      }).then((board) => {
        res.json(board);
    }).catch((error) => {
        next(error);
    })
});

module.exports = router;
