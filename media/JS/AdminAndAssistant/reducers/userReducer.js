/**
 * Created by hyt on 2017/1/9.
 */
import { Map,List,fromJS } from "immutable";

let initState = fromJS({
    id: null,
    username: "",
    showLoginAndRegisterModal: false,
    isLogin: false,
    fetching: false,
    fetched: false,
    error: false,
    errorMessage:"",
    userType: "Guest" //["Guest","Teacher","Assistant","Administrator"] four type of user
});

export default function reducer(state = initState, action) {
    if (action.type == "USER_LOGINING") {
        let changedStatus = fromJS({isLogin: false, fetching: true, fetched: false, error: false })
        changedStatus=changedStatus.merge(action.playload)
        return state.merge(changedStatus);
    } else if (action.type == "USER_LOGIN_ERROR") {
        let changedStatus = fromJS({ isLogin: false, fetching: false, fetched: true, error: true, errorMessage:action.playload.get("error") })
        changedStatus=changedStatus.merge(action.playload)
        return state.merge(changedStatus);
    }else if (action.type == "USER_LOGINED") {
        let changedStatus = fromJS({ isLogin: true, fetching: false, fetched: true, error: false, errorMessage:"" })
        changedStatus=changedStatus.merge(action.playload)
        return state.merge(changedStatus);
    } else if (action.type == "USER_LOGOUTED") {
        let changedStatus = fromJS({ isLogin: false, fetching: false, fetched: false, error: false,userType:"Guest"})
        changedStatus=changedStatus.merge(action.playload)
        return state.merge(changedStatus);
    } else if (action.type == "USER_REGISTER_ERROR") {
        let changedStatus = fromJS({ isLogin: false, fetching: false, fetched: true, error: true, errorMessage:action.playload.get("error") })
        changedStatus=changedStatus.merge(action.playload)
        return state.merge(changedStatus);
    }else if (action.type == "USER_STATE_RECEIVED") {
        let changedStatus = fromJS({ isLogin: true, fetching: false, fetched: false, error: false})
        changedStatus=changedStatus.merge(action.playload)
        return state.merge(changedStatus);
    } else if (action.type == "SHOW_LOGIN_AND_REGISTER_MODAL") {
        let changedStatus = fromJS({ showLoginAndRegisterModal: true })
        changedStatus=changedStatus.merge(action.playload)
        return state.merge(changedStatus);
    } else if (action.type == "HIDE_LOGIN_AND_REGISTER_MODAL") {
        let changedStatus = fromJS({ showLoginAndRegisterModal: false })
        changedStatus=changedStatus.merge(action.playload)
        return state.merge(changedStatus);
    }  else if (action.type == "CLEAR_ERROR_MESSAGE") {
        let changedStatus = fromJS({ errorMessage: "" })
        changedStatus=changedStatus.merge(action.playload)
        return state.merge(changedStatus);
    } else {
        return state;
    }
}