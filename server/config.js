var config = {
  db_host: "mongodb://localhost:27017/trelloClone",
  server_port: 4000,
  createBoard: '/createBoard',
  findAllBoards: '/findAllBoards',
  findOneBoard: '/findBoard/:id',
  createList: '/createList',
  deleteList: '/deleteList/:id/:boardId',
  createCard: '/createCard',
  updateCard: '/updateCard/:id',
  moveCard: '/moveCard/:id/:fromList/:toList',
  deleteCard: '/deleteCard/:id/:listId',
  createComment: '/createComment',
  updateComment: '/updateComment/:id'
};

module.exports = config;