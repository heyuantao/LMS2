/**
 * Created by hyt on 2017/1/7.
 */
import React from "react";
import {bindActionCreators} from "redux";
import moment from "moment";
import {Router,Route,IndexRoute,hashHistory,Redirect,IndexRedirect} from "react-router";
import {connect} from "react-redux";
import { Layout } from "antd";
import {Map,List,fromJS} from "immutable";
import App from "./App";
import RoomUsage from "./App/RoomUsage";
import AllCourses from "./App/AllCourses";
import RecentArrangements from "./App/RecentArrangements";
import CourseDetails from "./App/CourseDetails";
import Assistants from "./App/Assistants";
import AssistantArrangements from "./App/AssistantArrangements";
import MyCourses from "./App/MyCourses";
import AddCourse from "./App/AddCourse";
import EditCourse from "./App/EditCourse";
import SystemInformation from "./App/SystemInformation";
//import actions
import * as userActionCreators from "../actions/userActions";
import * as hashLocationActionCreators from "../actions/navigationBreadcrumbReducerAction";
import * as infrastructureActionCreators from "../actions/infrastructureActions";

@connect(
    (store)=>{ return { }},
    (dispatch)=>{ return {
        userAction:bindActionCreators(userActionCreators,dispatch),
        hashAction:bindActionCreators(hashLocationActionCreators,dispatch),
        infrastructureAction:bindActionCreators(infrastructureActionCreators,dispatch)
    }}
)
export default class AppLayout extends React.Component {
    constructor(props) {
        super(props);
        this.handleEnterIndex=this.handleEnterIndex.bind(this);
        this.handleOnEnter=this.handleOnEnter.bind(this);
    }
    handleEnterIndex(){
        this.props.infrastructureAction.fetchInfrastructureDataAction();
        this.props.userAction.getUserStateAction();
        this.props.hashAction.changeHashLocationAction(fromJS(["首页","近期课程"]));
    }
    handleOnEnter(nextState, replace, next){
        var hashLocation=nextState.location.pathname;
        var hashLocationArray=hashLocation.split("/");
        if( hashLocationArray.indexOf("roomusage")>-1 ){
            this.props.hashAction.changeHashLocationAction(fromJS(["首页","教室查询","教室使用"]));
        }else if( hashLocationArray.indexOf("allcourses")>-1 ){
            this.props.hashAction.changeHashLocationAction(fromJS(["首页","课程管理","全部课程"]));
        }else if( hashLocationArray.indexOf("recentarrangements")>-1 ){
            this.props.hashAction.changeHashLocationAction(fromJS(["首页","课程管理","近期安排"]));
        }else if( hashLocationArray.indexOf("mycourses")>-1 ){
            this.props.hashAction.changeHashLocationAction(fromJS(["首页","课程管理","我的课程"]));
        }else if( hashLocationArray.indexOf("courseadd")>-1 ){
            this.props.hashAction.changeHashLocationAction(fromJS(["首页","课程管理","我的课程","添加课程"]));
        }else if( hashLocationArray.indexOf("courseedit")>-1 ){
            this.props.hashAction.changeHashLocationAction(fromJS(["首页","课程管理","我的课程","编辑课程"]));
        }else if( hashLocationArray.indexOf("assistant")>-1 ){
            this.props.hashAction.changeHashLocationAction(fromJS(["首页","值班信息","值班助理"]));
        }else if( hashLocationArray.indexOf("assistantarrangements")>-1 ){
            this.props.hashAction.changeHashLocationAction(fromJS(["首页","值班信息","值班安排"]));
        }else if( hashLocationArray.indexOf("systeminformation")>-1 ){
            this.props.hashAction.changeHashLocationAction(fromJS(["首页","系统信息","基本信息"]));
        }

        next();
    }
    render() {
        return (
            <Router history={hashHistory} >
                <Route path="/" component={App}>
                    <IndexRoute component={AllCourses} onEnter={this.handleEnterIndex()}></IndexRoute>
                    <Route path="/roomusage" component={RoomUsage}  onEnter={this.handleOnEnter}></Route>
                    <Route path="/allcourses" component={AllCourses}  onEnter={this.handleOnEnter}></Route>
                    <Route path="/recentarrangements" component={RecentArrangements}  onEnter={this.handleOnEnter}></Route>
                    <Route path="/mycourses" component={MyCourses}  onEnter={this.handleOnEnter}></Route>
                    <Route path="/courseadd" component={AddCourse}  onEnter={this.handleOnEnter}></Route>
                    <Route path="/courseedit/:id" component={EditCourse}  onEnter={this.handleOnEnter}></Route>
                    <Route path="/coursedetails/:id" component={CourseDetails}  onEnter={this.handleOnEnter}></Route>
                    <Route path="/assistant" component={Assistants}  onEnter={this.handleOnEnter}></Route>
                    <Route path="/assistantarrangements" component={AssistantArrangements}  onEnter={this.handleOnEnter}></Route>
                    <Route path="/systeminformation" component={SystemInformation}  onEnter={this.handleOnEnter}></Route>
                </Route>
            </Router>
        );
    }
}
