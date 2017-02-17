/**
 * Created by hyt on 2017/1/18.
 */
import React from "react";
import { Steps, Row, Col, Form, Select, Input, Button, Checkbox, InputNumber, Table, Popconfirm, Card, Modal, DatePicker, message } from "antd";
import { connect } from "react-redux";
import { Map, List, fromJS } from "immutable";
import axios from "axios";
import { bindActionCreators } from "redux";
import cookie from "react-cookie";
import Setting from "../../globalSetting";

let { MonthPicker, RangePicker } = DatePicker;
let FormItem = Form.Item;
let Option = Select.Option;

let baseUrl = Setting.baseUrl;
let termWeekListUrl = baseUrl + "api/termweeklist/";
let weekListUrl = baseUrl + "api/weeklist/";
let lessonListUrl = baseUrl + "api/lessonlist/";
let labListUrl = baseUrl + "api/lablist/";
let roomListUrl = baseUrl + "api/roomlist/";
let assistantListUrl = baseUrl + "api/assistantlist";
let assistantArrangementUrl = baseUrl + "api/assistantarrangement/";


@connect((store) => {
    return { infrastructure: store.infrastructure }
})
export default class AssistantArrangements extends React.Component {
    constructor(props) {
        super(props);
        let infrastructure = this.props.infrastructure;
        this.state = {
            tableData:fromJS([]),
            selected: fromJS({ termWeek: "未选择", lab: "未选择", assistant: "未选择", lesson: "未选择", name: "未选择", isbusy: "未选择" }),
            pagination: fromJS({totalItem:10,pageSize:10,pageNumber:1,needPagination:false}), 
            termWeekList: fromJS([]),
            lessonList: fromJS([]),
            labList: fromJS([]),
            editOneItem:fromJS({lab:"未选择"}), //add or edit item data
            editOneItemModal: false,
            //totalItem:10, //一共有多少条目
            //pageSize:10,   //每页有几条
            fetching:false
        };
    }
    componentDidMount() {
        this.loadInfrastructureData();
    }
    loadInfrastructureData() {
        let infrastructure=this.props.infrastructure;
        this.setState({termWeekList:infrastructure.getIn(["termWeekInformation","data"])})
        this.setState({weekList:infrastructure.getIn(["weekInformation","data"])})
        this.setState({lessonList:infrastructure.getIn(["lessonInformation","data"])})
        this.setState({labList:infrastructure.getIn(["labInformation","data"])})
    }
    loadData() {
        let selected = this.state.selected;
        if (selected.get("termWeek") != "未选择" && selected.get("lab") != "未选择") {
            let csrftoken = cookie.load('csrftoken')
            let req = axios.create({ baseURL: baseUrl, headers: { 'X-CSRFToken': csrftoken } })
            let getParams = { params: this.state.selected.merge(this.state.pagination).toJS() } //选定实验中心
            req.get(assistantArrangementUrl, getParams).then(function (response) {
                let rawData = fromJS(response.data);
                let tableData=rawData.get("data");
                let paginationData = rawData.get("pagination");
                tableData=tableData.map((item,index)=>{return item.set("key",index+1)})
                if(!this._unmounted) {
                    this.setState({ tableData:tableData,pagination:paginationData })
                }
                message.success("获取数据成功")
            }.bind(this)).catch(function (error) {
                message.error("获取数据失败")
            }.bind(this));
        }
    }
    handleSelectedChange(v, field) {
        let newState = this.state.selected;
        newState = newState.set(field, v);
        let newPagination = fromJS({totalItem:10,pageSize:10,pageNumber:1,needPagination:false});        
        newPagination=this.state.pagination.merge(newPagination);
        this.setState({ selected: newState,pagination:newPagination },()=>{this.loadData()});
    }

    tableColumnsFormats(){
        let tableFormat = [
            {
                title: "序号",
                dataIndex: "key",
                key: "key"
            },
            {
                title: "周",
                dataIndex: "week",
                key: "week"
            },{
                title: "节",
                dataIndex: "lesson",
                key:"lessonlesson"
            },{
                title: "助理",
                dataIndex: "assistant",
                key:"assistant"
            }
        ];
        return tableFormat;
    }
    tablePaginationFormat(){
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
    render() {
        return (
            <div>
                <Row type="flex" justify="space-between" align="middle">
                    <Col md={{ span: 5 }} >
                        <h2 style={{ marginBottom: "15px", display: "inline" }}>值班安排</h2>
                    </Col>
                    <Col md={{ span: 19 }}>
                        <Row type="flex" justify="end" align="middle">
                            <Col>
                                <span style={{ display: "inline", paddingLeft: "10px" }}>实验中心选择</span>
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
                            <Col>
                                <span style={{ display: "inline", paddingLeft: "10px" }}>周次选择</span>
                                <Select size="small" style={{ width: "100px", marginLeft: "10px" }}
                                    onChange={(v) => { this.handleSelectedChange(v, "termWeek") }}
                                    value={this.state.selected.get("termWeek")}>
                                    {
                                        this.state.termWeekList.map(function (obj) {
                                            return <Select.Option key={obj.get("id")} value={obj.get("name")}>{obj.get("name")}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Col>
                            
                        </Row>
                    </Col>
                </Row>

                <Row type="flex" justify="space-around" align="middle">
                    <Col span={24}  >
                        <div style={{marginBottom:"15px"}}></div>
                        <Table columns={this.tableColumnsFormats()} dataSource={this.state.tableData.toJS()}
                            pagination={this.tablePaginationFormat()}
                            loading={this.state.fetching}>
                        </Table>
                    </Col>
                </Row>

            </div>
        )
    }
}

