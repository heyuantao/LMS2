/**
 * Created by hyt on 2017/1/10.
 */
import React from "react";
import {connect} from "react-redux";
import axios from "axios";
import {Map,List,fromJS} from "immutable";
import cookie from "react-cookie";
import { Router, Route, Link, IndexRoute, Redirect ,hashHistory} from 'react-router';
import { Select, Table, Icon, Row, Col,Pagination, Modal, Button} from "antd";
import {changeHashLocationAction} from "../../actions/navigationBreadcrumbReducerAction"
//import CourseData from "../Services/CourseData";
import Setting from "../../globalSetting";

let baseUrl = Setting.baseUrl;
let recentArrangementsListUrl = "api/arrangementlist/";

@connect((store)=>{
    return {infrastructure:store.infrastructure}
})
export default class RecentArrangements extends React.Component{
    constructor(props){
        super(props);
        //let courseData=CourseData.fetchAllCourse();
        let infrastructure=this.props.infrastructure;
        //let {labInformation,courseTypeInformation}=this.props.infrastructure;
        this.state={
            arrangements:fromJS([]),
            lab:"未选择",
            totalItem:10,
            pageSize:10,
            pageNumber:1,
            fetching:false
        };
    }
    loadData(){
        let csrftoken = cookie.load('csrftoken')
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
        let getParams={params:{pageSize:this.state.pageSize,pageNumber:this.state.pageNumber,lab:this.state.lab}}
        this.setState({fetching:true})
        req.get(recentArrangementsListUrl, getParams).then(function (response) {
            let rawData=fromJS(response.data);
            let arrangementsData = rawData.get("data");
            arrangementsData=arrangementsData.map((item)=>{return item.set("key",item.get("id"))});
            console.log("load arrangements success !")
            this.setState({arrangements:arrangementsData,totalItem:rawData.get("totalItem"),pageNumber:rawData.get("pageNumber")})
            this.setState({fetching:false})
        }.bind(this)).catch(function(error){
            console.log("load arrangements error !")
            this.setState({fetching:false})
        }.bind(this));
    }
    componentDidMount(){
        this.loadData()
    }
    componentWillReceiveProps(newProps){
    }
    handleLabSelectedChange(lab){
        //reset the pagination information,and set lab
        this.setState({lab:lab,totalItem:10,pageSize:10,pageNumber:1},()=>{this.loadData()})
    }
    handlePaginationShowTotal(total){
    }
    handleShowCourseDetails(event,value,navList){
        hashHistory.push(value);
        this.props.dispatch(changeHashLocationAction(["首页","课程管理","近期课程","课程详情"]));
    }
    courseTableColumsFormat(){
      const courseTableFormat = [
          {
              title: "实验课名称",
              dataIndex: "course",
              key: "id"
          },
          {
              title: "实验名称",
              dataIndex: "name",
              key: "name"
          }, {
              title: "周次",
              dataIndex: "termWeek",
              key:"termWeek"
          }, {
              title: "周",
              dataIndex: "week",
              key:"week"
          }, {
              title: "节次",
              dataIndex: "lesson",
              key:"lesson"
          }, {
              title: "上课地点",
              dataIndex: "location",
              key:"location"
          },  {
              title: "学生助理",
              dataIndex: "assistant",
              key:"assistant"
          }
      ];
      return courseTableFormat;
    }
    courseTablePaginationFormat(){
      var pagination = {
          total: this.state.totalItem ,pageSize:this.state.pageSize,
          onChange: (current) => {
              console.log("All Course at page:"+current);
              this.setState({pageNumber:current},()=>{this.loadData()})
          }
      };
      return pagination;
    }

    render(){
        let infrastructure=this.props.infrastructure;
        return (
            <div>                
                <Row type="flex" justify="space-between" align="middle">
                    <Col md={{span:8}} >
                        <h2 style={{marginBottom:"15px",display:"inline"}}>近期课程</h2>
                    </Col>

                    <Col md={{span:12}}>
                        <Row type="flex" justify="end" align="middle">
                            <Col>
                                <span style={{display:"inline"}}>实验室选择</span>
                                <Select size="small" style={{ width:"150px",marginLeft:"10px" }} value={this.state.lab}
                                        onChange={(v)=>{this.handleLabSelectedChange(v)}}>
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
                <Row type="flex" justify="start" align="top">
                    <Col md={{span:24}}>
                        {/*页面表格内容部分*/}
                        <div style={{marginBottom:"15px"}}></div>
                        <Table columns={this.courseTableColumsFormat()} pagination={this.courseTablePaginationFormat()} loading={this.state.fetching}
                            dataSource={this.state.arrangements.toJS()} ></Table>
                    </Col>
                </Row>
                
            </div>
        )
    }
}
