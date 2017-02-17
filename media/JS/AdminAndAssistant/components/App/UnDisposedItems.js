import React from "react";
import axios from "axios";
import { bindActionCreators } from "redux";
import cookie from "react-cookie";
import { Map, List, fromJS } from "immutable";
import { Row, Col, Table, Button, Select, Card, Input, InputNumber, Form, DatePicker, Popconfirm, Modal, message, Tag } from "antd";
import { connect } from "react-redux";
import * as hashLocationActionCreators from "../../actions/navigationBreadcrumbReducerAction";
import Setting from "../../globalSetting";
import moment from "moment";

const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;

let baseUrl = Setting.baseUrl;
let weekListOfEmptyAssistantOnArrangementUrl = baseUrl + "api/undisposeditems/weeklistofemptyassistantonarrangement/";
let courseListHasEmptyLocationUrl = baseUrl + "api/undisposeditems/courselisthasemptylocation/";

@connect(
    (store) => { return { infrastructure: store.infrastructure, user: store.user }; },
    (dispatch) => { return { hashAction: bindActionCreators(hashLocationActionCreators, dispatch) }; }
)
export default class UnDisposedItems extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            courseListOfEmptyLocationOnArrangement:fromJS([]),weekListOfEmptyAssistantOnArrangement:fromJS([]),
            labList:fromJS([]),
            selected:fromJS({lab:"未选择"})
        }
    }
    componentDidMount() {
        this.loadInfrastructureData();
    }
    loadInfrastructureData() {
        let infrastructure=this.props.infrastructure;
        this.setState({labList:infrastructure.getIn(["labInformation","data"])})
    }
    loadCourseListOfEmptyLocationOnArrangement() {
        let selected=this.state.selected;
        if(selected.get("lab")=="未选择"){  message.info("未选择实验中心"); return }
        let csrftoken = cookie.load('csrftoken')
        let req = axios.create({ baseURL: baseUrl, headers: { 'X-CSRFToken': csrftoken } })
        let getParams = { params: this.state.selected.toJS() }
        req.get(courseListHasEmptyLocationUrl, getParams).then(function (response) {
            let responData = fromJS(response.data)
            this.setState({ courseListOfEmptyLocationOnArrangement: responData })
            message.success("获取数据成功")
        }.bind(this)).catch(function (error) {
            let rawData = error.response.data;
            message.error("获取数据失败")
        }.bind(this))
    }
    loadWeekListOfEmptyAssistantOnArrangement() {
        let selected=this.state.selected;
        if(selected.get("lab")=="未选择"){ message.info("未选择实验中心"); return }
        let csrftoken = cookie.load('csrftoken')
        let req = axios.create({ baseURL: baseUrl, headers: { 'X-CSRFToken': csrftoken } })
        let getParams = { params: this.state.selected.toJS() }
        req.get(weekListOfEmptyAssistantOnArrangementUrl, getParams).then(function (response) {
            let responData = fromJS(response.data)
            this.setState({ weekListOfEmptyAssistantOnArrangement: responData })
            message.success("获取数据成功")
        }.bind(this)).catch(function (error) {
            let rawData = error.response.data;
            message.error("获取数据失败")
        }.bind(this))
    }
    clearWeekListOfEmptyAssistantOnArrangement(){
        this.setState({ weekListOfEmptyAssistantOnArrangement: this.state.weekListOfEmptyAssistantOnArrangement.clear() })
    }
    clearCourseListOfEmptyLocationOnArrangement(){
        this.setState({ courseListOfEmptyLocationOnArrangement: this.state.courseListOfEmptyLocationOnArrangement.clear() })
    }
    courseListOfEmptyLocationOnArrangementTitle() {
        return (
            <div>
                <Button onClick={() => { this.clearCourseListOfEmptyLocationOnArrangement() }} style={{marginRight:"10px",display:"inline"}}>清除</Button>
                <Button onClick={() => { this.loadCourseListOfEmptyLocationOnArrangement() }}>检查</Button>
            </div>
        )
    }
    weekListOfEmptyAssistantOnArrangementTitle() {
        return (
            <div>
                <Button onClick={() => { this.clearWeekListOfEmptyAssistantOnArrangement() }} style={{marginRight:"10px",display:"inline"}}>清除</Button>
                <Button onClick={() => { this.loadWeekListOfEmptyAssistantOnArrangement() }}>检查</Button>
            </div>
        )
    }
    handleSelectedChange(v, field) {
        let newState = this.state.selected;
        let self = this;
        newState = newState.set(field, v);
        this.setState({ selected: newState });
    }
    render() {
        return (
            <div>
                <Row type="flex" justify="space-between" align="middle">
                    <Col md={{ span: 5 }} >
                        <h2 style={{ marginBottom: "15px", display: "inline" }}>未处理事项</h2>
                    </Col>
                    <Col md={{ span: 19 }}>
                        <Row type="flex" justify="end" align="middle">
                            <Col>
                                <span style={{ display: "inline", paddingLeft: "10px" }}>实验中心</span>
                                <Select size="small" style={{ width: "100px", marginLeft: "10px" }}
                                    onChange={(v) => { this.handleSelectedChange(v, "lab") }}
                                    value={this.state.selected.get("lab")}>
                                    {
                                        this.state.labList.map(function (obj) {
                                            return <Select.Option key={obj.get("id")} value={obj.get("name")}>{obj.get("name")}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div style={{ marginTop: "20px" }}></div>
                <Row type="flex" justify="space-around" align="middle">
                    <Col md={{ span: 23 }}>
                        <Card title="未安排课程" extra={this.courseListOfEmptyLocationOnArrangementTitle()}>
                        {
                            this.state.courseListOfEmptyLocationOnArrangement.map((item,index)=>{
                                return( <Tag color="#2db7f5" key={index}>{item.get("courseName")}</Tag> )
                            })
                        }
                        </Card>
                    </Col>
                </Row>
                <div style={{ marginTop: "20px" }}></div>
                <Row type="flex" justify="space-around" align="middle">
                    <Col md={{ span: 23 }}>
                        <Card title="未安排值班的周次" extra={this.weekListOfEmptyAssistantOnArrangementTitle()}>
                        {
                            this.state.weekListOfEmptyAssistantOnArrangement.map((item,index)=>{
                                return( <Tag color="#2db7f5" key={index}>{item.get("termWeek")}</Tag> )
                            })
                        }
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}