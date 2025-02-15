export const initialState = {
    sidebarshow: 'none',
    duration: 150,
    musicplayerheight: 65,
};
const screenReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SIDEBAR_SHOW":
            return {
                ...state,
                sidebarshow: action.payload
            }
        case "ANIMATION_DURATION":
            return {
                ...state,
                duration: action.payload
            }
        case "MUSICPLAYER_HEIGHT":
            return {
                ...state,
                musicplayerheight: action.payload
            }
        default:
            return state;
    }
};

export default screenReducer;