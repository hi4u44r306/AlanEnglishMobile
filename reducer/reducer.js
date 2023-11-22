import { combineReducers } from "redux";
import musicReducer from "./musicReducer";
import userReducer from "./userReducer";
import screenReducer from "./screenReducer";

const reducers = combineReducers({
    musicReducer,
    userReducer,
    screenReducer,
});

export default reducers;