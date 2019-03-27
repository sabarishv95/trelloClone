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
  updateComment: '/updateComment/:id',
  CLIENT_ORIGIN : process.env.NODE_ENV === 'production'
    ? 'http://ec2-3-82-62-132.compute-1.amazonaws.com:4000/'
    : ['http://127.0.0.1:3000', 'http://localhost:3000']
};

module.exports = config;