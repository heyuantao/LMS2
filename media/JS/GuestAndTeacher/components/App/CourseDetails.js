/**
 * Created by hyt on 2017/1/15.
 */
import React from "react";
import {connect} from "react-redux";
import axios from "axios";
import cookie from "react-cookie";
import {Map,List,fromJS} from "immutable";
import { Router, Route, Link, IndexRoute, Redirect ,hashHistory} from 'react-router';
import { Select, Table, Icon, Row, Col,Pagination, Modal, Button,Tabs} from "antd";
import {changeHashLocationAction} from "../../actions/navigationBreadcrumbReducerAction";
import Setting from "../../globalSetting";
const TabPane = Tabs.TabPane;

let baseUrl = Setting.baseUrl;
let courseDetailsUrl = "api/coursedetails/";

@connect((store)=>{
    return {
        hashLocation: store.navigationBreadcrumb.hashLocation
    }
})
export default class CourseDetails extends React.Component {
    constructor(props){
        super(props);
        {/*从hash的URL中获取id*/}
        let courseId=this.props.params.id;
        {/*空白数据，用户保证初次渲染不报错*/}
        let courseDetails={lab:"",experimentName:"",theoryClass:"",teacher:"",studentNumber:0,
            studentGrade:0,studentSubject:"",courseType:"",needAssistant:true,
            extra:"",lab:"",
            arrangements:[
                {id:1,key:1,termWeek:"",week:"",lesson:"",experimentName:"",location:"",assistantName:""},
            ]
        }
        this.state={courseDetails:fromJS(courseDetails)};
    }
    loadData(){
        let courseId=this.props.params.id;
        let csrftoken = cookie.load('csrftoken');
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}});
        req.get(courseDetailsUrl+courseId+"/", {}).then(function (response) {
            let courseDetails = fromJS(response.data);
            courseDetails=courseDetails.set("key",courseDetails.get("id"))
            let arrangements=courseDetails.get("arrangements").map((item)=>{ return item.set("key",item.get("id")) });
            courseDetails=courseDetails.set("arrangements",arrangements)
            if(courseDetails.get("needAssistant")==true){
                courseDetails=courseDetails.set("needAssistant","是")
            }else{
                courseDetails=courseDetails.set("needAssistant","否")
            }
            this.setState({courseDetails:courseDetails})
        }.bind(this)).catch(function(error){
            console.log("load course details error !")
            //this.setState({fetching:false})
        });
    }
    componentDidMount(){
        this.loadData()
    }
    handleGoBack(){
        hashHistory.goBack();
    }
    render(){
        const firstTableColumns=[
            {title:"课程名称",dataIndex:"experimentName"},{title:"所属理论课",dataIndex:"theoryClass"},
            {title:"学生专业",dataIndex:"studentSubject"},{title:"学生年级",dataIndex:"studentGrade"},
            {title:"教师",dataIndex:"teacher"},{title:"课程类型",dataIndex:"courseType"},
            {title:"学生人数",dataIndex:"studentNumber"},{title:"是否需要值班助理",dataIndex:"needAssistant"},
            {title:"实验室名称",dataIndex:"lab"},
        ];
        const secondTableColumns=[
            {title:"备注信息",dataIndex:"extra"}
        ];
        const thirdTableConlums=[
            {title:"周次",dataIndex:"termWeek"},{title:"周",dataIndex:"week"},{title:"节次",dataIndex:"lesson"},
            {title:"本次课程名称",dataIndex:"name"},{title:"上课地点",dataIndex:"location"},
            {title:"值班学生",dataIndex:"assistant"}
        ];
        return(
            <div>
                <Row type="flex" justify="space-between" align="middle">
                    <Col md={{span:22}} >
                        <h2 style={{marginBottom:"15px"}}>课程详情</h2>
                    </Col>
                    <Col>
                        <Button onClick={()=>{this.handleGoBack()}} type="primary">返回</Button>
                    </Col>
                </Row>
                <Row type="flex" justify="space-between" align="middle">
                    <Col md={{span:24}} >
                        <Tabs  type="card">
                            <TabPane tab="上课安排信息" key="1">
                                <Table columns={thirdTableConlums} dataSource={this.state.courseDetails.get("arrangements").toJS()} bordered><div style={{marginBottom:"15px"}}></div>
                                </Table>
                            </TabPane>
                            <TabPane tab="课程基本信息" key="2">
                                <Table columns={firstTableColumns} dataSource={[this.state.courseDetails.toJS()]} pagination={false} bordered><div style={{marginBottom:"15px"}}></div>
                                </Table>
                                <div style={{marginBottom:"10px"}}></div>
                                <Table columns={secondTableColumns} dataSource={[this.state.courseDetails.toJS()]} pagination={false} bordered>
                                </Table>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
            </div>
        );
    }
}