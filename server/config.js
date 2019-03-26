var config = {
    db_host: "mongodb://localhost:27017/trelloClone",
    server_port: 4000,
    createBoard: '/createBoard',
    findAllBoards: '/findAllBoards',
    createList: '/createList',
    deleteList: '/deleteList/:id/:boardId',
    createCard: '/createCard',
    createComment: '/createComment'
  };
  
  module.exports = config;