export default (state = [], action) => {
  if (action.type === 'FETCH_USERS') {
    return action.payload;
  } else if (action.type === 'ADD_USER') {
    return [...state, action.payload];
  } else if (action.type === 'REMOVE_USER') {
    return state.filter(user => user.id !== action.payload.id);
  }

  return state;
}
