/**
 * Created by hyt on 2017/1/10.
 */
import React from "react";
import { bindActionCreators } from "redux";
import {connect} from "react-redux";
import { hashHistory} from 'react-router';
import { Row, Col,Button,Icon, Modal } from "antd";
import * as userActionsCreators from "../../actions/userActions";
import LoginAndRegisterModal from "./LoginAndRegisterModal";

@connect(
    (store) => { return { user: store.user }; },
    (dispatch) => { return { userAction: bindActionCreators(userActionsCreators, dispatch) }; }
)
export default class AppHeader extends React.Component{
    constructor(props){
        super(props);
    }
    handleLogout(){
        this.props.userAction.userLogoutAction();
        //用户退出系统后，返回到首页面
        let homePage="";
        hashHistory.push(homePage);
    }
    handleLogin(){
        this.props.userAction.showLoginAndRegisterAction();
    }
    render(){
        const user=this.props.user;
        var loginAndRegister=null;
        //user.get("isLogin")
        if( user.get("isLogin")){
            loginAndRegister=
                <div>
                    <h4 style={{display:"inline",marginRight:"10px"}}>当前用户:{user.get("username")}</h4>
                    <Button type="primary" onClick={()=>{this.handleLogout()}}>注销</Button>
                </div>
        }
        //!user.get("isLogin")
        if( !user.get("isLogin") ){
            loginAndRegister=
                <div>
                    <Button type="primary" onClick={()=>{this.handleLogin()}}>登录</Button>
                </div>
        }
        return(
            <div>
                <Row type="flex"  align="middle" justify="space-between">
                    <Col span={3}>
                        <h1 style={{margin:"10px 0px",height:"60px",lineHeight:"60px"}}>CSALMS</h1>
                    </Col>
                    <Col span={10}>
                        <Row type="flex" justify="end" align="top" >
                            <Col>
                                {loginAndRegister}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <LoginAndRegisterModal visible={this.props.user.get("showLoginAndRegisterModal")} isLogin={true} ></LoginAndRegisterModal>
            </div>
        )
    }
}
