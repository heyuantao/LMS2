/**
 * Created by hyt on 2017/1/24.
 */
import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import cookie from "react-cookie";
import { Router, Route, Link, IndexRoute, Redirect, hashHistory } from 'react-router';
import { Steps, Row, Col, Form, Select, Input, Button, Checkbox, InputNumber, Table, Popconfirm, Card, message } from "antd";
import { Map,List,fromJS} from "immutable";
import { changeHashLocationAction } from "../../actions/navigationBreadcrumbReducerAction";
import AddOrEditArrangmentModal from "./AddCourse/AddOrEditArrangmentModal";
import Setting from "../../globalSetting";

const Step = Steps.Step;
const FormItem = Form.Item;
const Option = Select.Option;

let baseUrl = Setting.baseUrl;
let courseDetailsUrl = "api/coursedetails/";

@connect((store) => {
    return { infrastructure: store.infrastructure }
})
export default class AddCourse extends React.Component {
    constructor(props) {
        super(props);        
        
        let infrastructure = this.props.infrastructure;
        let courseTypeList = infrastructure.getIn(["courseTypeInformation", "data"]).filter((obj) => {
            return (obj.get("name") != "全部")
        });//immutable
        let labList = infrastructure.getIn(["labInformation", "data"]);//immutable
        this.courseTypeList = courseTypeList;//immutable
        this.labList = labList;//immutable
        /* fake date use in test begin*/
        let courseData = fromJS({
            id:-1,
            lab: "未选择", experimentName: "1", theoryClass: "1", teacher: "1",
            studentSubject: "1", studentGrade: 2000, studentNumber: 0,
            courseType: "未选择", experimentTotalCourePeriod: 0, experimentTotalCourseCount: 0, extra: "", needAssistang: true,
            arrangements:[]
        })//immutable
        /* fake date use in test end*/

        let addOrEditArrangementData = fromJS({ id: -1, key: -1, termWeek: "未选择", week: "未选择", lesson: "未选择", arrangementName: "" });
        this.state = {
            currentStep: 1, courseData: courseData, showAddOrEditArrangmentModal: false, showEditArrangmentModal: false,
            addOrEditArrangementData: addOrEditArrangementData, formOneValidateStatus: false
        };

    }
    loadData(){
        let courseId=this.props.params.id;
        let csrftoken = cookie.load('csrftoken');
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}});
        req.get(courseDetailsUrl+courseId+"/", {}).then(function (response) {
            let courseData = fromJS(response.data);
            console.log(courseData.toJS())
            courseData=courseData.set("key",courseData.get("id"))
            let arrangements=courseData.get("arrangements").map((item)=>{ return item.set("key",item.get("id")) });
            courseData=courseData.set("arrangements",arrangements)
            this.setState({courseData:courseData},()=>{this.validateFormOne()})
            console.log("edit course load data success !")
        }.bind(this)).catch(function(error){
            console.log("edit course load data filed !")
        });
    }
    componentDidMount() {
        //初始载入的时候有数据，先验证下表单负责下一步按钮会显示错误
        this.loadData();
    }
    /*
    handleEditArrangment(key){
        let editArrangement=this.state.courseData.get("arrangements").filter((item,index)=>{return item.get("key")==key});
        this.setState({addOrEditArrangementData:editArrangement.first()})  ;
        this.handleShowEditArrangmentModal();
    }
    */
    handleDeleteArrangment(key){
        let arrangements=this.state.courseData.get("arrangements");
        arrangements=arrangements.filter((item,index)=>{return item.get("key")!=key});
        let newCourseData=this.state.courseData.set("arrangements",arrangements);
        this.setState({courseData:newCourseData});
    }
    handleShowAddOrEditArrangmentModal(key) { //item key in list
        let addOrEditArrangementData=null;
        if((key==undefined||key<0)){
            addOrEditArrangementData=fromJS({id:-1,key:-1,termWeek:"未选择",week:"未选择",lesson:"未选择",arrangementName:"",location:"未选择",assistant:"未选择"});
        }else{
            let addOrEditArrangementDataList=this.state.courseData.get("arrangements").filter((item,index)=>{return item.get("key")==key});
            addOrEditArrangementData=addOrEditArrangementDataList.first()
        }
        this.setState({addOrEditArrangementData:addOrEditArrangementData,showAddOrEditArrangmentModal: true})
    }
    handleHideAddOrEditArrangmentModal() {
        this.setState({ showAddOrEditArrangmentModal: false });
    }
    handleAddOrEditArrangmentConfirm(arrangement){ //arg is immutable data
        this.handleHideAddOrEditArrangmentModal();
        if(arrangement.get("key")==-1){//add course
            
            let courseData=this.state.courseData;
            let newArrangement=this.state.courseData.get("arrangements");
            newArrangement=newArrangement.push(arrangement);
            newArrangement=newArrangement.map((item,index)=>{return item.set("key",index)});
            console.log(newArrangement.toJS())
            courseData=courseData.set("arrangements",newArrangement);
            this.setState({addOrEditArrangementData:arrangement});//update currend model ui
            this.setState({courseData:courseData});
        }else{//edit course
            let originArrangement=this.state.courseData.get("arrangements");
            originArrangement=originArrangement.map((item)=>{
                if(item.get("key")==arrangement.get("key")){
                    return arrangement
                }
                return item;
            })
            //re key the arrangement
            originArrangement=originArrangement.map((item,index)=>{return item.set("key",index)})
            let newCourseData=this.state.courseData.set("arrangements",originArrangement);
            console.log(originArrangement.toJS())
            this.setState({addOrEditArrangementData:arrangement});//update currend model ui
            this.setState({courseData:newCourseData});            
        }

    }
    handleAddOrEditArrangmentCancel() {
        this.handleHideAddOrEditArrangmentModal();
    }
    /*
    handleEditArrangmentConfirm(arrangement){
        this.handleHideEditArrangmentModal();
        let originArrangement=this.state.courseData.get("arrangements");
        originArrangement=originArrangement.map((item)=>{
            if(item.get("key")==arrangement.get("key")){
                return arrangement
            }
            return item;
        })
        //re key the arrangement
        originArrangement=originArrangement.map((item,index)=>{
            return item.set("key",index);
        })

        let newCourseData=this.state.courseData.set("arrangements",originArrangement);
        //console.log(newCourseData.toJS());
        this.setState({courseData:newCourseData});
        this.setState({addOrEditArrangementData:arrangement});//update currend model ui
    }
    */
    /*
    handleEditArrangmentCancel() {
        this.handleHideEditArrangmentModal();
    }
    */
    //当全部信息输入完毕，用户点击最终的提交按钮式执行
    handleEditCourseFinished(){
        //console.log("edit confirm !");
        //console.log(this.state.courseData.toJS());
        let courseId=this.props.params.id;        
        let csrftoken = cookie.load('csrftoken')
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
        req.put(courseDetailsUrl+courseId+"/", this.state.courseData.toJS()).then(function (response) {
            console.log("edit course success !");
            console.log(response.data);
            //跳转hash url
            message.success("编辑课程成功");
            let newUrl="mycourses"
            hashHistory.push(newUrl);
        }).catch(function(error){
            let response=error.response
            message.error("编辑课程失败");
            console.log("add course error !");
            console.log(response.data)
        });
    }
    handleChangeInFormOne(value,subFieldName){
        let courseData=this.state.courseData;
        courseData=courseData.set(subFieldName,value);
        this.setState({courseData:courseData},function(){
            this.validateFormOne();
        }.bind(this));
    }
    validateFormOne(){
        //Validate the value
        let courseData=this.state.courseData;
        let errorCount=-1;
        if((courseData.get("experimentName")=="")||(courseData.get("theoryClass")=="")||(courseData.get("teacher")=="")||(courseData.get("studentSubject")=="")) { errorCount=errorCount+1;}
        if( courseData.get("courseType")=="未选择" ){ errorCount=errorCount+1; }
        if( courseData.get("lab")=="未选择" ){ errorCount=errorCount+1; }
        //检查错误数量
        if(errorCount<0){
            this.setState({formOneValidateStatus:true});
        }else{
            this.setState({formOneValidateStatus:false});
        }
    }

    arrangementTableColumnFormat() {
        let tableColumn = [
            {
                title: "周次",
                dataIndex: "termWeek",
                key: "termWeek"
            }, {
                title: "周",
                dataIndex: "week",
                key: "week"
            }, {
                title: "节次",
                dataIndex: "lesson",
                key: "lesson"
            }, {
                title: "课程",
                dataIndex: "arrangementName",
                key: "arrangementName"
            },{
                title:"上课地点",
                dataIndex:"location",
                key:"location"
            }, {
                title:"值班学生",
                dataIndex:"assistant",
                key:"assistant"
            },{
                title: "操作",
                key: "action",
                render: (text, record) => (
                    <div>
                        <a type="primary" size="small"
                            onClick={(event) => { this.handleShowAddOrEditArrangmentModal(record.key); } }>编辑 </a >
                        <span className="ant-divider" />
                        <Popconfirm title="是否要删除?" okText="确认" cancelText="取消"
                            onConfirm={() => { this.handleDeleteArrangment(record.key) } }>
                            <a>删除</a>
                        </Popconfirm>
                    </div>
                )
            }
        ];
        return tableColumn;
    }
    arrangementTableColumnFormatWithoutAction() {
        let tableColumn = [
            {
                title: "周次",
                dataIndex: "termWeek",
                key: "termWeek"
            }, {
                title: "周",
                dataIndex: "week",
                key: "week"
            }, {
                title: "节次",
                dataIndex: "lesson",
                key: "lesson"
            }, {
                title: "课程",
                dataIndex: "arrangementName",
                key: "arrangementName"
            },{
                title:"上课地点",
                dataIndex:"location",
                key:"location"
            }, {
                title:"值班学生",
                dataIndex:"assistant",
                key:"assistant"
            }];
        return tableColumn;
    }
    arrangementTablePaginationFormat() {
        const pagination = {
            pageSize: 7
        };
        return pagination;
    }
    titleHtml() {
        return (
            <Row type="flex" justify="space-between" align="middle" style={{ marginTop: "20px" }}>
                <Col md={{ span: 10 }} >
                    <h2 style={{ marginBottom: "15px", display: "inline" }}>编辑课程</h2>
                </Col>
            </Row>
        )
    }
    stepHtml() {
        return (
            <Row type="flex" justify="space-between" align="begin" style={{ marginTop: "20px" }}>
                <Steps current={this.state.currentStep - 1}>
                    <Step title="第一步" description="课程基本信息" />
                    <Step title="第二步" description="上课时间安排" />
                    <Step title="确认" description="确认填写信息" />
                </Steps>
            </Row>
        )
    }
    buttonOneHtml() {
        return (
            <Row type="flex" justify="space-between" align="middle" style={{ marginTop: "50px" }}>
                <Col md={{ span: 2 }} >
                    <Button type="primary" disabled onClick={() => this.handlePrev()}>上一步</Button>
                </Col>
                {
                    (this.state.formOneValidateStatus == false) &&
                    <Col md={{ span: 2 }} >
                        <Button type="primary" disabled onClick={() => this.handleNext()}>下一步</Button>
                    </Col>
                }
                {
                    (this.state.formOneValidateStatus == true) &&
                    <Col md={{ span: 2 }} >
                        <Button type="primary" onClick={() => this.handleNext()}>下一步</Button>
                    </Col>
                }
            </Row>
        )
    }
    buttonTwoHtml() {
        return (
            <Row type="flex" justify="space-between" align="middle" style={{ marginTop: "50px" }}>
                <Col md={{ span: 2 }} >
                    <Button type="primary" onClick={() => this.handlePrev()}>上一步</Button>
                </Col>
                <Col md={{ span: 2 }} >
                    <Button type="primary" onClick={() => this.handleNext()}>下一步</Button>
                </Col>
            </Row>
        )
    }
    buttonThreeHtml() {
        return (
            <Row type="flex" justify="space-between" align="middle" style={{ marginTop: "50px" }}>
                <Col md={{ span: 2 }} >
                    <Button type="primary" onClick={() => this.handlePrev()}>上一步</Button>
                </Col>
                <Col md={{ span: 2 }} >
                    <Button type="primary" onClick={()=>this.handleEditCourseFinished()}>确定</Button>
                </Col>
            </Row>
        )
    }
    formOneHtml() {
        let courseData =this.state.courseData;
        return (
            <Form onSubmit={this.handleSubmit} style={{ marginTop: "20px" }}>
                <Row gutter={40}>
                    <Col md={{ span: 8 }}>
                        <FormItem label="课程所在实验中心" hasFeedback>
                            <Select value={courseData.get("lab")} onChange={(v) => { this.handleChangeInFormOne(v, "lab") } }
                                >
                                {
                                    this.labList.map(function (obj) {
                                        return <Select.Option key={obj.get("id")} value={obj.get("name")}>{obj.get("name")}</Select.Option>
                                    })
                                }
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={40}>
                    <Col md={{ span: 8 }}>
                        <FormItem label="实验名称" hasFeedback>
                            <Input value={courseData.get("experimentName")} onChange={(e) => { this.handleChangeInFormOne(e.target.value, "experimentName") } } />
                        </FormItem>
                    </Col>
                    <Col md={{ span: 8 }}>
                        <FormItem label="所属理论课" hasFeedback>
                            <Input value={courseData.get("theoryClass")} onChange={(e) => { this.handleChangeInFormOne(e.target.value, "theoryClass") } } />
                        </FormItem>
                    </Col>
                    <Col md={{ span: 8 }}>
                        <FormItem label="实验教师" hasFeedback>
                            <Input value={courseData.get("teacher")} onChange={(e) => { this.handleChangeInFormOne(e.target.value, "teacher") } } />
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={40}>
                    <Col md={{ span: 8 }}>
                        <FormItem label="学生专业" hasFeedback>
                            <Input value={courseData.get("studentSubject")} onChange={(e) => { this.handleChangeInFormOne(e.target.value, "studentSubject") } } />
                        </FormItem>
                    </Col>
                    <Col md={{ span: 3 }}>
                        <FormItem label="学生年级" hasFeedback>
                            <InputNumber min={2010} max={2030} defaultValue={2010}
                                value={courseData.get("studentGrade")} onChange={(v) => { this.handleChangeInFormOne(v, "studentGrade") } } />
                        </FormItem>
                    </Col>

                    <Col md={{ span: 3 }}>
                        <FormItem label="上课学生人数" hasFeedback>
                            <InputNumber min={0} max={200} defaultValue={0}
                                value={courseData.get("studentNumber")} onChange={(v) => { this.handleChangeInFormOne(v, "studentNumber") } } />
                        </FormItem>
                    </Col>
                </Row>

                <Row gutter={40}>
                    <Col md={{ span: 8 }}>
                        <FormItem label="课程类型" hasFeedback>
                            <Select value={courseData.get("courseType")} onChange={(v) => { this.handleChangeInFormOne(v, "courseType") } }
                                >
                                {
                                    this.courseTypeList.map(function (obj) {
                                        return <Select.Option key={obj.get("id")} value={obj.get("name")}>{obj.get("name")}</Select.Option>
                                    })
                                }
                            </Select>
                        </FormItem>
                    </Col>
                    {
                        (courseData.get(["courseData","courseType"])=="实验") &&
                        <div>
                            <Col md={{ span: 3 }}>
                                <FormItem label="实验总学时" hasFeedback>
                                    <InputNumber min={1} max={10} defaultValue={0} value={courseData.get("experimentTotalCourePeriod")} onChange={(v) => { this.handleChangeInFormOne(v, "experimentTotalCourePeriod") } } />
                                </FormItem>
                            </Col>
                            <Col md={{ span: 3 }}>
                                <FormItem label="实验总次数" hasFeedback>
                                    <InputNumber min={1} max={10} defaultValue={0} value={courseData.get("experimentTotalCourseCount")} onChange={(v) => { this.handleChangeInFormOne(v, "experimentTotalCourseCount") } } />
                                </FormItem>
                            </Col>
                        </div>
                    }
                </Row>
                <FormItem label="备注" hasFeedback>
                    <Input type="textarea" value={courseData.get("extra")} onChange={(e) => { this.handleChangeInFormOne(e.target.value, "extra") } } />
                </FormItem>

                <FormItem hasFeedback>
                    <Checkbox defaultChecked={true} value={courseData.get("needAssistant")} onChange={(v) => { this.handleChangeInFormOne(v, "needAssistant") } }>是否需要助理</Checkbox>
                </FormItem>
            </Form>
        )
    }
    formTwoHtml() {
        let courseData=this.state.courseData;
        return (
            <div>
                <Row type="flex" justify="end" align="middle" style={{ marginTop: "20px" }}>
                    <Button type="primary" onClick={() => { this.handleShowAddOrEditArrangmentModal() } }>添加</Button>
                </Row>
                <Row type="flex" justify="space-between" align="top" style={{ marginTop: "20px", height: "450px" }}>
                    <Col md={{ span: 24 }} >
                        <Table columns={this.arrangementTableColumnFormat()} pagination={this.arrangementTablePaginationFormat()}
                            dataSource={courseData.get("arrangements").toJS()}>
                        </Table>
                    </Col>
                </Row>
                <AddOrEditArrangmentModal course={this.state.courseData} //传入课程信息数据结构，这样可以判断是实验还是非实验课
                    visible={this.state.showAddOrEditArrangmentModal} arrangement={this.state.addOrEditArrangementData}//pass immutable datasource
                    confirm={(v) => { this.handleAddOrEditArrangmentConfirm(v) } } cancel={() => { this.handleAddOrEditArrangmentCancel() } }></AddOrEditArrangmentModal>
                {/*
                <AddOrEditArrangmentModal title="编辑课程" course={this.state.courseData} //传入课程信息数据结构，这样可以判断是实验还是非实验课
                    visible={this.state.showEditArrangmentModal} dataSource={this.state.addOrEditArrangementData}//pass immutable datasource
                    confirm={(v) => { this.handleEditArrangmentConfirm(v) } } cancel={() => { this.handleEditArrangmentCancel() } }></AddOrEditArrangmentModal>
                */}
            </div>
        )
    }
    formThreeHtml(){
        let courseData=this.state.courseData;
        return(
            <div>
                <Row type="flex" justify="space-between" align="top" style={{marginTop:"20px",height:"450px"}}>
                    <Col md={{span:8}} >
                        <Card title="课程基本信息" style={{ width:"100%" }}>
                            <p>课程所在实验中心:{courseData.get("lab")}</p>
                            <p>实践课名称:{courseData.get("experimentName")}</p>
                            <p>课程所属理论课:{courseData.get("theoryClass")}</p>
                            <p>上课教师:{courseData.get("teacher")}</p>
                            <p>课程类型:{courseData.get("courseType")}</p>
                            <p>学生年级:{courseData.get("studentGrade")}</p>
                            <p>学生专业:{courseData.get("studentSubject")}</p>
                            <p>学生人数:{courseData.get("studentNumber")}</p>
                            {(courseData.get("needAssistang"))&&<p>是否需要值班助理:是</p>}
                            {(!courseData.get("needAssistang"))&&<p>是否需要值班助理:是</p>}
                            {
                                (courseData.get("courseType")=="实验")&&
                                    <div>
                                        <p>实验总学时:{courseData.get("experimentTotalCourePeriod")}</p>
                                        <p>实验总次数:{courseData.get("experimentTotalCourseCount")}</p>
                                    </div>
                            }
                        </Card>
                    </Col>
                    <Col md={{span:14}} >
                        <Card title="上课时间安排" style={{ width:"100%" }}>
                            <Table columns={this.arrangementTableColumnFormatWithoutAction()}  size="small"
                                   pagination={this.arrangementTablePaginationFormat()}
                                   dataSource={courseData.get("arrangements").toJS()}>
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
    render() {
        let currentStep=this.state.currentStep;
        return (
            <div>
                {this.titleHtml()}
                {this.stepHtml()}

                {(currentStep == 1) && this.formOneHtml()}
                {(currentStep == 2) && this.formTwoHtml()}
                {(currentStep == 3) && this.formThreeHtml()}
                
                {(currentStep==1)&&this.buttonOneHtml()}
                {(currentStep==2)&&this.buttonTwoHtml()}
                {(currentStep==3)&&this.buttonThreeHtml()}
            </div>
        )
    }
    handlePrev(){
        let step=this.state.currentStep;
        if(step){
            step=step-1;
            this.setState({currentStep:step});
        }
    }
    handleNext(){
        let step=this.state.currentStep;
        if(step<3){
            step=step+1;
            this.setState({currentStep:step});
        }
    }
}