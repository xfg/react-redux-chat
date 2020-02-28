export default (state = [], action) => {
  if (action.type === 'ADD_MESSAGE') {
    return [...state, action.payload];
  }

  return state;
}
