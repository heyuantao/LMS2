/**
 * Created by hyt on 2017/1/9.
 */
import axios from "axios";
import cookie from "react-cookie";
import {Map,List,fromJS} from "immutable";
import Setting from "../globalSetting";

let baseUrl = Setting.baseUrl

let loginUrl = "login/";
let logoutUrl = "logout/";
let registerUrl = "register/";
let userStateUrl = "userstate/";

export function clearErrorMessageAction(){
    return {type: "CLEAR_ERROR_MESSAGE",playload: {}};
}

export function userRegisterAction(username, password, email){
    return function (dispatch) {
        dispatch({type: "USER_REGISTING",playload: fromJS({})});
        let csrftoken = cookie.load('csrftoken')
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
        req.post(registerUrl, {
            username: username, password: password, email:email
        }).then(function (response) {
            let user = response.data;
            dispatch({type: "USER_REGISTED",playload: fromJS(user)});
            dispatch(hideLoginAndRegisterAction());
        }).catch(function(error){
            let response=error.response
            dispatch({type:"USER_REGISTER_ERROR",playload:fromJS(response.data)});
        });
    }
}
export function userLoginAction(username, password) {
    return function (dispatch) {
        dispatch({type: "USER_LOGINING",playload: fromJS({})});
        let csrftoken = cookie.load('csrftoken')
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
        req.post(loginUrl, {username: username,password: password}).then(function (response) {
            let user = response.data;
            dispatch({type: "USER_LOGINED",playload: fromJS(user)});
            dispatch(hideLoginAndRegisterAction());
        }).catch(function(error){
            let response=error.response
            console.log("login error ");
            console.log(response);
            dispatch({type:"USER_LOGIN_ERROR",playload:fromJS(response.data)});
            //dispatch({type:"USER_LOGIN_ERROR",playload:response.data});
        });
    }
}

export function userLogoutAction() {
    return function (dispatch) {
        let csrftoken = cookie.load('csrftoken')
        dispatch({
            type: "USER_LOGOUTED",
            playload: {}
        });
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
        req.post(logoutUrl, {}).then(function (response) {}).catch(function(error){  });
    }

}

export function showLoginAndRegisterAction() {
    return {
        type: "SHOW_LOGIN_AND_REGISTER_MODAL",
        playload: null
    }
}

export function hideLoginAndRegisterAction() {
    return {
        type: "HIDE_LOGIN_AND_REGISTER_MODAL",
        playload: null
    }
}

export function getUserStateAction(){  //this method is use in init to get user information in system
    return function (dispatch) {
        let csrftoken = cookie.load('csrftoken')
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
        req.get(userStateUrl).then(function (response) {
            //console.log("begin to dispatch")
            
            dispatch({
                type: "USER_STATE_RECEIVED",
                playload: response.data
            });
        }).catch(function(error){  });
    }
}