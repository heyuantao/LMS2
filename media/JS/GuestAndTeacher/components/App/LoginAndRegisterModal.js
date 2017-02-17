/**
 * Created by hyt on 2017/1/18.
 */
import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Modal, Button, Form, Input, Icon, Row, Col } from "antd";
import {Map,List,fromJS} from "immutable";
const FormItem = Form.Item;
import * as userActionsCreators from "../../actions/userActions";

@connect(
    (store) => { return { user: store.user }; },
    (dispatch) => { return { userAction: bindActionCreators(userActionsCreators, dispatch) }; }
)
export default class LoginAndRegisterModal extends React.Component {
    constructor(props) {
        super(props);
        {/*该字段用来表示是显示注册还是登录*/ }
        this.state = {
            isLogin: this.props.isLogin,
            visible: this.props.visible,
            userLogin:fromJS({username:"",password:""}),
            userRegister:fromJS({username:"",password1:"",password2:"",email:""}),
            userRegisterValideMessage:""
        };
    }
    handleUserLoginFieldChange(v,field){
        let userLogin=this.state.userLogin.set(field,v);
        this.setState({userLogin:userLogin});
    }
    handleUserRegisterFieldChange(v,field){
        let userRegister=this.state.userRegister.set(field,v);
        this.setState({userRegister:userRegister},()=>{this.validateRegisterCallback()});
    }
    validateRegisterCallback(){
        let userRegister=this.state.userRegister;
        let errorCount=-1;
        if( userRegister.get("username")=="" ){
            errorCount=errorCount+1;
            this.setState({userRegisterValideMessage:"用户名不能为空"})
        }
        if( userRegister.get("email")=="" ){
            errorCount=errorCount+1;
            this.setState({userRegisterValideMessage:"邮箱不能为空"})
        }
        if( userRegister.get("password1")=="" ){
            errorCount=errorCount+1;
            this.setState({userRegisterValideMessage:"密码不能为空"})
        }
        if( userRegister.get("password2")=="" ){
            errorCount=errorCount+1;
            this.setState({userRegisterValideMessage:"密码不能为空"})
        }
        if( userRegister.get("password1")!=userRegister.get("password2") ){
            errorCount=errorCount+1;
            this.setState({userRegisterValideMessage:"密码不相同"})
        }
        if( (userRegister.get("email").indexOf("@"))==-1 ){
            errorCount=errorCount+1;
            this.setState({userRegisterValideMessage:"邮箱地址不正确"})
        }
        if(errorCount<0){
            this.setState({userRegisterValideMessage:""})
        }
    }
    handleCancleLogin() {
        this.props.userAction.hideLoginAndRegisterAction();
    }
    handleOkLogin() {
        this.props.userAction.userLoginAction(this.state.userLogin.get("username"),this.state.userLogin.get("password"));
    }
    handleCancleRegister() {
        this.props.userAction.hideLoginAndRegisterAction();
    }
    handleOkRegister() {
        this.props.userAction.userRegisterAction(this.state.userRegister.get("username"),this.state.userRegister.get("password1"),this.state.userRegister.get("email"));
    }
    handleSwitchLoginAndRegister() {
        this.setState({ isLogin: !this.state.isLogin })
        this.props.userAction.clearErrorMessageAction();
    }
    componentWillReceiveProps(newProps) {
        this.setState(
            {
                visible: newProps.visible
            }
        )
    }
    render() {
        var loginModalFooterWithoutLoading =
            <div>
                <span style={{marginRight:"10px"}}>{this.props.user.get("errorMessage")}</span>
                <Button onClick={() => { this.handleCancleLogin() } } >取消</Button>
                <Button type="primary" onClick={() => { this.handleOkLogin() } }>登录</Button>
            </div>
        var loginModalFooterWithLoading =
            <div>
                <Icon type="loading" style={{ marginRight: "20px" }} />
                <Button onClick={() => { this.handleCancleLogin() } } disabled>取消</Button>
                <Button type="primary" onClick={() => { this.handleOkLogin() } } disabled>登录</Button>
            </div>
        {/*生成footer内容*/ }
        var loginModalFooter = null;
        if (this.props.user.get("fetching")) {
            loginModalFooter = loginModalFooterWithLoading;
        } else {
            loginModalFooter = loginModalFooterWithoutLoading;
        }
        var loginModal =
            <Modal footer={loginModalFooter}
                style={{ height: "100%", verticalAlign: "middle" }} title="用户登录" visible={this.props.visible} width="500px">
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={20}>
                        <Form >
                            <div style={{ marginTop: "20px" }}></div>
                            <FormItem>
                                <Input size="large" addonBefore={<Icon type="user" />} placeholder="Username" 
                                    value={this.state.userLogin.get("username")} 
                                    onChange={(e)=>{this.handleUserLoginFieldChange(e.target.value,"username")}}/>
                            </FormItem>
                            <div style={{ marginTop: "30px" }}></div>
                            <FormItem>
                                <Input size="large" addonBefore={<Icon type="lock" />} type="password" placeholder="Password" 
                                    value={this.state.userLogin.get("password")} 
                                    onChange={(e)=>{this.handleUserLoginFieldChange(e.target.value,"password")}} />
                            </FormItem> 
                            <a onClick={() => { this.handleSwitchLoginAndRegister() } }>注册</a>
                        </Form>
                    </Col>
                </Row>
            </Modal>
        let registerModalFooterWithLoading =
            <div>
                <Icon type="loading" style={{ marginRight: "20px" }} />
                <Button onClick={() => { this.handleCancleLogin() } } disabled>取消</Button>
                <Button type="primary" onClick={() => { this.handleOkRegister() } } disabled>注册</Button>
            </div>
        let registerModalFooterWithoutLoading =
            <div>
                <span style={{marginRight:"10px"}}>{this.props.user.get("errorMessage")}</span>
                <span style={{marginRight:"10px"}}>{this.state.userRegisterValideMessage}</span>
                <Button onClick={() => { this.handleCancleLogin() } } >取消</Button>
                {(this.state.userRegisterValideMessage.length==0)&&
                    <Button type="primary"  onClick={() => { this.handleOkRegister() } } >注册</Button>
                }
                {(this.state.userRegisterValideMessage.length>0)&&
                    <Button type="primary" disabled onClick={() => { this.handleOkRegister() } } >注册</Button>
                }
            </div>

        let registerModalFooter = null;
        if (this.props.user.get("fetching")) {
            registerModalFooter = registerModalFooterWithLoading;
        } else {
            registerModalFooter = registerModalFooterWithoutLoading;
        }

        let registerModal =
            <Modal footer={registerModalFooter}
                style={{ height: "100%", verticalAlign: "middle" }} title="用户注册" visible={this.props.visible}>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={20}>
                        <Form >
                            <div style={{ marginTop: "20px" }}></div>
                            <FormItem>
                                <Input size="large" addonBefore={<Icon type="user" />} placeholder="Username" 
                                    value={this.state.userRegister.get("username")} onChange={(e)=>{ this.handleUserRegisterFieldChange(e.target.value,"username") }}/>
                            </FormItem>
                            <div style={{ marginTop: "30px" }}></div>
                            <FormItem>
                                <Input size="large" addonBefore={<Icon type="mail" />} type="email" placeholder="Email" 
                                    value={this.state.userRegister.get("email")} onChange={(e)=>{ this.handleUserRegisterFieldChange(e.target.value,"email") }}/>
                            </FormItem>
                            <div style={{ marginTop: "30px" }}></div>
                            <FormItem>
                                <Input size="large" addonBefore={<Icon type="lock" />} type="password" placeholder="Password"
                                    value={this.state.userRegister.get("password1")} 
                                    onChange={(e)=>{  this.handleUserRegisterFieldChange(e.target.value,"password1");}} />
                            </FormItem>
                            <div style={{ marginTop: "30px" }}></div>
                            <FormItem>
                                <Input size="large" addonBefore={<Icon type="lock" />} type="password" placeholder="Password"
                                    value={this.state.userRegister.get("password2")} 
                                    onChange={(e)=>{ this.handleUserRegisterFieldChange(e.target.value,"password2") }} />
                            </FormItem>
                            <a onClick={() => { this.handleSwitchLoginAndRegister() } }>登录</a>
                        </Form>
                    </Col>
                </Row>
            </Modal>
        let modalToShow = null;
        if (this.state.isLogin) {
            modalToShow = loginModal;
        } else {
            modalToShow = registerModal;
        }
        return (
            <div>
                {modalToShow}
            </div>

        )
    }

}