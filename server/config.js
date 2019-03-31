var config = {
  db_host: "mongodb://sabarishv95:Qwerty1234@ds127736.mlab.com:27736/trello-clone",
  server_port: process.env.PORT || 4000,
  createBoard: '/createBoard',
  findAllBoards: '/findAllBoards',
  findOneBoard: '/findBoard/:id',
  createList: '/createList',
  deleteList: '/deleteList/:id/:boardId',
  createCard: '/createCard',
  updateCard: '/updateCard/:id',
  moveCard: '/moveCard/:id/:fromList/:toList',
  moveAllCards: '/moveAllCards/:fromList/:toList',
  deleteCard: '/deleteCard/:id/:listId',
  createComment: '/createComment',
  updateComment: '/updateComment/:id',
  deleteComment: '/deleteComment/:id/:cardId'
};

module.exports = config;