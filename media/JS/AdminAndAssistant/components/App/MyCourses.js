/**
 * Created by hyt on 2017/1/19.
 */
import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Map,List,fromJS} from "immutable";
import axios from "axios";
import cookie from "react-cookie";
import { Router, Route, Link, IndexRoute, Redirect ,hashHistory} from 'react-router';
import { Select, Table, Icon, Row, Col,Pagination, Modal, Button, Radio, Popconfirm, message} from "antd";
import * as hashLocationActionCreators from "../../actions/navigationBreadcrumbReducerAction";
import UserData from "../Services/UserData";
import Setting from "../../globalSetting";

let baseUrl = Setting.baseUrl;
let courseListUrl = "api/courselist/";
let coursedetailsUrl = "api/coursedetails/";

@connect(
    (store)=>{ return {infrastructure:store.infrastructure,user:store.user}; },
    (dispatch) => { return { hashAction:bindActionCreators(hashLocationActionCreators,dispatch) }; }
)
export default class MyCourses extends React.Component {
    constructor(props) {
        super(props);
        let {labInformation}=this.props.infrastructure;
        this.state={
            tableData:fromJS([]),
            pagination: fromJS({totalItem:10,pageSize:10,pageNumber:1,needPagination:true}), 
            selected:fromJS({lab:"未选择"}),
            fetching:false,
        };
    }
    loadData(){
        let csrftoken = cookie.load('csrftoken');
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}});
        let userId=this.props.user.get("id");
        let Params=this.state.selected.merge(this.state.pagination);
        Params=Params.set("userId",userId);
        //load the data with username
        let getParams={params:Params.toJS()}
        this.setState({fetching:true})
        req.get(courseListUrl, getParams ).then(function (response) {
            let rawData = fromJS(response.data);
            let tableData = rawData.get("data");
            let paginationData = rawData.get("pagination");
            tableData=tableData.map((item)=>{return item.set("key",item.get("id"))});        
            this.setState({tableData:tableData,pagination:paginationData})
            this.setState({fetching:false})
            message.success("获取数据成功")
        }.bind(this)).catch(function(error){
            this.setState({fetching:false})
            message.error("获取数据失败")
        }.bind(this));
    }
    componentDidMount(){
        this.loadData()
    }
    handleConfirmToDelete(obj){
        let csrftoken = cookie.load('csrftoken')
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
        
        req.delete(coursedetailsUrl+obj.id+"/", {
        }).then(function (response) {
            message.success("删除课程:"+obj.name);
            this.loadData();
        }.bind(this)).catch(function(error){
             message.success("删除课程失败:"+obj.name);
        });       
        
    }
    handleCancelToDelete(obj){
    }
    courseTableColumnsFormat(){
        const courseTableFormat = [
            {
                title: "实验名称",
                dataIndex: "name",
                key: "id"
            },
            {
                title: "学生年级",
                dataIndex: "grade",
                key:"grade"
            },
            {
                title: "学生专业",
                dataIndex: "major",
                key:"major"
            },
            {
                title: "上课老师",
                dataIndex: "teacher",
                key:"teacher"
            },
            {
                title: "课程类型",
                dataIndex: "type",
                key:"type"
            },
            {
                title: "实验室地点",
                dataIndex: "lab",
                key:"lab"
            },
            {
                title: "操作",
                key:"action",
                render: (text,record) => (
                    <div>
                         <span>
                             <a onClick={(event)=>{  this.handleShowCourseDetails(event,"coursedetails/"+record.id);}} >查看</a>
                             <span className="ant-divider"/>
                             <a onClick={(event)=>{  this.handleEditCourse(event,"courseedit/"+record.id);}} >编辑</a>
                             <span className="ant-divider"/>
                               <Popconfirm title="是否要删除?" okText="确认" cancelText="取消"
                                           onConfirm={()=>this.handleConfirmToDelete(record)}
                                           onCancel={()=>{this.handleCancelToDelete(record)}}
                                   >
                                   <a>删除</a>
                               </Popconfirm>

                         </span>

                    </div>
                )
            }
        ];
        return courseTableFormat;
    }
    courseTablePaginationFormat(){
        let pagination = {
            total: this.state.pagination.get("totalItem") ,
            pageSize:this.state.pagination.get("pageSize"),
            current:this.state.pagination.get("pageNumber"),
            onChange: (pageNumber) => {
                let newPagination=this.state.pagination.set("pageNumber",pageNumber);
                this.setState({pagination:newPagination},()=>{this.loadData()});
            }
        };
        return pagination;
    }

    handleDeleteCourse(obj){
        console.log("Delete course :"+obj.id);
    }
    handleShowCourseDetails(event,value){
        this.props.hashAction.changeHashLocationAction(fromJS(["首页","课程管理","我的课程","课程详情"]));
        hashHistory.push(value);
    }
    handleEditCourse(event,value){
        hashHistory.push(value);
    }
    handleSelectedChange(v, field) {
        let newSelected = this.state.selected;
        newSelected = newSelected.set(field, v);
        let newPagination = fromJS({totalItem:10,pageSize:10,pageNumber:1,needPagination:true});        
        newPagination=this.state.pagination.merge(newPagination);
        this.setState({ selected:newSelected,pagination:newPagination },()=>{this.loadData()});
    }
    handleAddCourse(){
        let newUrl="courseadd"
        hashHistory.push(newUrl);
    }
    render(){
        let infrastructure=this.props.infrastructure;
        let user=this.props.user;
        return(
            <div>
                <Row type="flex" justify="space-between" align="middle">
                    <Col md={{span:10}} >
                        <h2 style={{marginBottom:"15px",display:"inline"}}>我的课程</h2>
                    </Col>

                    <Col md={{span:12}}>
                        <Row type="flex" justify="end" align="middle">
                            <Col>
                                <span style={{display:"inline"}}>实验室选择</span>
                                <Select size="small" style={{width:"100px",marginLeft:"10px" }}
                                    value={this.state.selected.get("lab")}
                                    onChange={(e)=>{this.handleSelectedChange(e,"lab")}}>
                                    <Select.Option key={-1} value={"未选择"}>未选择</Select.Option>
                                    {
                                        infrastructure.getIn(["labInformation","data"]).map(function (obj) {
                                            return <Select.Option key={obj.get("id")} value={obj.get("name")}>{obj.get("name")}</Select.Option>
                                        })
                                    }
                                </Select>
                                {
                                    UserData.isLogin(user.get("userType")) &&
                                    <Button style={{marginLeft:"10px"}} type="primary" onClick={()=>{this.handleAddCourse()}}>添加</Button>
                                }

                            </Col>
                        </Row>
                    </Col>
                </Row>


                <Row type="flex" justify="between" align="middle">
                    <Col span={24}  >
                        {/*页面表格内容部分*/}
                        <div style={{marginBottom:"15px"}}></div>
                        <Table columns={this.courseTableColumnsFormat()} dataSource={this.state.tableData.toJS()} pagination={this.courseTablePaginationFormat()}
                               loading={this.state.fetching}
                            ></Table>
                    </Col>
                </Row>
            </div>
        );
    }
}