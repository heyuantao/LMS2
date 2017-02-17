/**
 * Created by hyt on 2017/1/10.
 */
import React from "react";
import {connect} from "react-redux";
import {Map,List,fromJS} from "immutable";
import axios from "axios";
import cookie from "react-cookie";
import { Router, Route, Link, IndexRoute, Redirect ,hashHistory} from 'react-router';
import { Select, Table, Icon, Row, Col,Pagination, Modal, Button, message} from "antd";
import {changeHashLocationAction} from "../../actions/navigationBreadcrumbReducerAction";
import CourseData from "../Services/CourseData";
import Setting from "../../globalSetting";

let baseUrl = Setting.baseUrl;
let courseListUrl = "api/courselist/";

@connect((store)=>{
    return {infrastructure:store.infrastructure}
})
export default class AllCourses extends React.Component{
    constructor(props){
        super(props);

        //let courseData=CourseData.fetchAllCourse();
        //this.formState={}; //用来保存用户选择的信息
        this.state={
            courseData:fromJS([]),
            currentCourseId:1,
            selected:fromJS({lab:"未选择"}),
            pagination: fromJS({totalItem:10,pageSize:10,pageNumber:1,needPagination:true}), 
            fetching:false
        };
    }
    loadData(){
        let csrftoken = cookie.load('csrftoken')
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
        let getParams={params:this.state.selected.merge(this.state.pagination).toJS()}
        this.setState({fetching:true})
        req.get(courseListUrl, getParams).then(function (response) {
            let rawData = fromJS(response.data);
            let courseData = rawData.get("data");
            let paginationData = rawData.get("pagination");
            paginationData=this.state.pagination.merge(paginationData);
            courseData=courseData.map((item)=>{return item.set("key",item.get("id"))});
            message.success("获取数据成功");
            this.setState({fetching:false})
            this.setState({courseData:courseData,pagination:paginationData})
        }.bind(this)).catch(function(error){
            this.setState({fetching:false})
            message.error("获取数据失败");   
        });
    }
    componentDidMount(){
        this.loadData();
    }
    handleSelectedChange(v, field) {
        let newSelected = this.state.selected;
        newSelected = newSelected.set(field, v);
        let newPagination = fromJS({totalItem:10,pageSize:10,pageNumber:1,needPagination:true});        
        newPagination=this.state.pagination.merge(newPagination);
        this.setState({ selected:newSelected,pagination:newPagination },()=>{this.loadData()});
    }
    handlePaginationShowTotal(total){
    }
    handleShowCourseDetails(event,value){
        hashHistory.push(value);
        this.props.dispatch(changeHashLocationAction(["首页","课程管理","全部课程","课程详情"]));
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
                        <a type="primary" size="small"
                           onClick={
                                      (event)=>{
                                        this.handleShowCourseDetails(event,"coursedetails/"+record.id);
                                      }
                                  }>查看
                        </a >
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

    render(){
        let infrastructure=this.props.infrastructure;
        return (
            
            <div>
                <Row type="flex" justify="space-between" align="middle">
                    <Col md={{span:10}} >
                        <h2 style={{marginBottom:"15px",display:"inline"}}>实验室全部课程</h2>
                    </Col>

                    <Col md={{span:14}}>
                        <Row type="flex" justify="end" align="middle">
                            <Col>
                                <span style={{display:"inline"}}>实验室选择</span>
                                <Select size="small" style={{ width:"150px",marginLeft:"10px" }}
                                        value={this.state.selected.get("lab")}
                                        onChange={(e)=>{this.handleSelectedChange(e,"lab")}}>
                                    <Select.Option key={-1} value={"未选择"}>未选择</Select.Option>
                                    {
                                        infrastructure.getIn(["labInformation","data"]).map(function (obj) {
                                            return <Select.Option key={obj.get("id")} value={obj.get("name")}>{obj.get("name")}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Col>
                        </Row>
                    </Col>
                </Row>


                <Row type="flex" justify="between" align="middle">
                    <Col span={24}  >
                        {/*页面表格内容部分*/}
                        <div style={{marginBottom:"15px"}}></div>
                        <Table columns={this.courseTableColumnsFormat()} 
                            dataSource={this.state.courseData.toJS()}
                            pagination={this.courseTablePaginationFormat()}
                            loading={this.state.fetching}
                            ></Table>
                    </Col>
                </Row>
            </div>
        )
    }
}