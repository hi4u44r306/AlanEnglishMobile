export const initialState = {
    sidebarshow: 'none',

};
const screenReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SIDEBAR_SHOW":
            return {
                ...state,
                sidebarshow: action.payload
            }
        default:
            return state;
    }
};

export default screenReducer;