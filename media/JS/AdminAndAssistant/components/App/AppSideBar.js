/**
 * Created by hyt on 2017/1/10.
 */
import React from "react";
import { Router, Route, Link, IndexRoute, Redirect ,hashHistory} from 'react-router';
import { Menu, Icon,Card} from 'antd';
import { connect } from "react-redux";
import {changeHashLocationAction} from "../../actions/navigationBreadcrumbReducerAction"
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import UserData from "../Services/UserData";

@connect((store) => {
    return { user:store.user };
})
export default class AppSideBar extends React.Component{
    constructor(props){
        super(props);
        this.state={
            defaultOpenedMenu:["sub2"],
            openedMenu:["sub2"],
            hashLocation:this.props.hashLocation
        }
    }
    openChangeHandle(value){
        const topMenuKey=["sub1","sub2","sub3","sub4","sub5"];
        var menuKey=value.pop();
        if(topMenuKey.toString().indexOf(menuKey)>-1){
            this.setState({openedMenu:[menuKey]})
        }
    }
    onSelectHandle(obj){
    }
    handleHashLocationChange(event,value){
        hashHistory.push(value);
    }
    render(){
        let user=this.props.user;
        return(
            <div>
                <Menu style={{}} mode="inline" theme="gray"  style={{minHeight:"750px"}}
                      onSelect={(obj)=>{this.onSelectHandle(obj)}}
                      defaultOpenKeys={this.state.defaultOpenedMenu}
                      openKeys={this.state.openedMenu}
                      onOpenChange={(value)=>{this.openChangeHandle(value)}}>
                    <SubMenu key="sub1" title={<span><Icon type="bar-chart" /><span>数据统计</span></span>}>
                        <Menu.Item key="2"><a onClick={(event)=>{this.handleHashLocationChange(event,"/roomusage")}}>有课教室</a></Menu.Item>       
                        <Menu.Item key="3"><a onClick={(event)=>{this.handleHashLocationChange(event,"/undisposeditems")}}>未处理事项</a></Menu.Item>                   
                    </SubMenu>
                    <SubMenu key="sub2" title={<span><Icon type="calendar" /><span>课程管理</span></span>}>
                        <Menu.Item key="5"><a onClick={(event)=>{this.handleHashLocationChange(event,"/allcourses")}}>全部课程</a></Menu.Item>
                        { UserData.isAdministrator(user.get("userType"))&&
                        <Menu.Item key="7"><a onClick={(event)=>{this.handleHashLocationChange(event,"/mycourses")}}>我的课程</a></Menu.Item>
                        }
                        
                    </SubMenu>
                    { UserData.isAdministrator(user.get("userType"))&&
                    <SubMenu key="sub3" title={<span><Icon type="notification" /><span>值班信息</span></span>}>
                        <Menu.Item key="9"><a onClick={(event)=>{this.handleHashLocationChange(event,"/assistantarrangements")}}>值班安排</a></Menu.Item>
                        <Menu.Item key="10"><a onClick={(event)=>{this.handleHashLocationChange(event,"/assistant")}}>值班助理</a></Menu.Item>
                    </SubMenu>  
                    }
                    { UserData.isAdministrator(user.get("userType"))&&
                    <SubMenu key="sub5" title={<span><Icon type="setting" /><span>系统设置</span></span>}>
                        <Menu.Item key="12"><a onClick={(event)=>{this.handleHashLocationChange(event,"/systemsettings")}}>初始设置</a></Menu.Item>
                        <Menu.Item key="13"><a onClick={(event)=>{this.handleHashLocationChange(event,"/labsettings")}}>实验室设置</a></Menu.Item>
                        <Menu.Item key="14"><a onClick={(event)=>{this.handleHashLocationChange(event,"/roomsettings")}}>房间设置</a></Menu.Item>
                    </SubMenu>
                    }
                </Menu>


            </div>
        )
    }
}
