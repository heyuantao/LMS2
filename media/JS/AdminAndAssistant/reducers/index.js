/**
 * Created by hyt on 2017/1/9.
 */
import {combineReducers} from "redux";
import userReducer from "./userReducer";
import navigationBreadcrumbReducer from "./navigationBreadcrumbReducer";
import infrastructureReducer from "./infrastructureReducer";

export default combineReducers(
    {
        user:userReducer,
        navigationBreadcrumb:navigationBreadcrumbReducer,
        infrastructure:infrastructureReducer
    }
)