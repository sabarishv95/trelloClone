import React from 'react'

export default React.createContext({
    currentBoard: null,
    manageBoard:(board) => {},
});