const wordReducer = (state = '', action) => {
  switch(action.type) { 
    case "CHANGE_WORD": 
      return action.payload; 
    default: 
      return state; 
  } 
} 

export default wordReducer;