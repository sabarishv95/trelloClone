const express = require("express");
const router = express.Router();
const config = require("../config");
const List = require("../models/lists.model");
const Card = require("../models/cards.model");
const Comment = require("../models/comments.model");

deleteCardFromList = (listId, cardId, res, next) => {
  List.findById(listId)
    .then(list => {
      if (list.cards.indexOf(cardId) >= 0)
        list.cards.splice(list.cards.indexOf(cardId), 1);
      list.save();
      res.json(list);
    })
    .catch(error => {
      next(error);
    });
};

//create a card with list id and update the list with the card id
router.post(config.createCard, (req, res, next) => {
  Card.create(req.body)
    .then(card => {
      List.findById(req.body.list)
        .then(list => {
          if (list.cards.indexOf(card._id) === -1) list.cards.push(card._id);
          list.save();
          res.json(card);
        })
        .catch(error => {
          next(error);
        });
    })
    .catch(error => {
      next(error);
    });
});

//update a card with the provided title/description
router.put(config.updateCard, (req, res, next) => {
  Card.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        ...req.body
      }
    },
    { new: true }
  )
    .then(card => {
      res.json(card);
    })
    .catch(error => {
      next(error);
    });
});

//delete card with the matching id
router.delete(config.deleteCard, (req, res, next) => {
  Card.findOneAndDelete({ _id: req.params.id })
    .then(card => {
      if (card.comments.length !== 0) {
        Comment.deleteMany({ card: req.params.id })
          .then(comment => {
            deleteCardFromList(req.params.listId, req.params.id, res, next);
          })
          .catch(error => {
            next(error);
          });
      } else {
        deleteCardFromList(req.params.listId, req.params.id, res, next);
      }
    })
    .catch(error => {
      next(error);
    });
});

router.put(config.moveCard, (req, res, next) => {
  if (req.params.fromList === req.params.toList)
    res.send("source list and target list are the same");
  else {
    List.findById(req.params.fromList)
      .then(fromList => {
        if (fromList.cards.indexOf(req.params.id) >= 0)
          fromList.cards.splice(fromList.cards.indexOf(req.params.id), 1);
        fromList.save();
        Card.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              list: req.params.toList
            }
          },
          { new: true }
        )
          .then(card => {
            List.findById(req.params.toList)
              .then(toList => {
                if (toList.cards.indexOf(card._id) === -1)
                  toList.cards.push(card._id);
                toList.save();
                res.json(toList);
              })
              .catch(error => {
                next(error);
              });
          })
          .catch(error => {
            next(error);
          });
      })
      .catch(error => {
        next(error);
      });
  }
});

router.put(config.moveAllCards, (req, res, next) => {
  if (req.params.fromList === req.params.toList)
    res.send("source list and target list are the same");
  else {
    List.findById(req.params.fromList)
      .then(fromList => {
        List.findById(req.params.toList)
          .then(toList => {
            toList.cards = toList.cards.concat(fromList.cards);
            toList.save();
            Card.updateMany(
              { list: req.params.fromList },
              {
                $set: {
                  list: req.params.toList
                }
              }
            )
              .then(cards => {
                fromList.cards.splice(0);
                fromList.save();
                res.json(toList);
              })
              .catch(error => {
                next(error);
              });
          })
          .catch(error => {
            next(error);
          });
      })
      .catch(error => {
        next(error);
      });
  }
});

module.exports = router;
