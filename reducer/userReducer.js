export const initialState = {
    useruid: '',
    username: '',
    userclass: '',
    usertodaytimeplayed: 0,
    usertotaltimeplayed: 0,
    teacherschool: '',
};
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "USER_ID":
            return {
                ...state,
                useruid: action.payload
            }
        case "USER_NAME":
            return {
                ...state,
                username: action.payload
            }
        case "USER_CLASS":
            return {
                ...state,
                userclass: action.payload
            }
        case "USER_TOTAL_TIME_PLAYED":
            return {
                ...state,
                usertotaltimeplayed: action.payload
            }
        case "USER_TODAY_TIME_PLAYED":
            return {
                ...state,
                usertodaytimeplayed: action.payload
            }
        case "TEACHER_SCHOOL":
            return {
                ...state,
                teacherschool: action.payload
            };
        default:
            return state;
    }
};

export default userReducer;