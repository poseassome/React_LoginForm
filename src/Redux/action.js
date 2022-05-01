export const changeType = (item) => { 
  return {
    type: "CHANGE_TYPE",
    payload: item
  }
}

export const changeWord = (item) => { 
  return {
    type: "CHANGE_WORD",
    payload: item
  }
}

export const changePage = (item) => { 
  return {
    type: "CHANGE_PAGE",
    payload: item
  }
}