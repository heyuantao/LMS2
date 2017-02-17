import React from "react";
import axios from "axios";
import {bindActionCreators} from "redux";
import cookie from "react-cookie";
import {Map,List,fromJS} from "immutable";
import {Row,Col,Table,Button,Select,Card,Input,InputNumber,Form,DatePicker,Popconfirm,Modal,message} from "antd";
import {connect} from "react-redux";
import * as hashLocationActionCreators from "../../actions/navigationBreadcrumbReducerAction";
import Setting from "../../globalSetting";
import UserData from "../Services/UserData";
import moment from "moment";

const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;

let baseUrl = Setting.baseUrl;
let labListUrl = "api/lablist/";
let roomUsageListUrl = "api/roomusage/";

@connect(
    (store)=>{ return {infrastructure:store.infrastructure,user:store.user}; },
    (dispatch) => { return { hashAction:bindActionCreators(hashLocationActionCreators,dispatch) }; }
)
export default class RoomUsage extends React.Component{
    constructor(props){
        super(props)
        this.state={
            tableData:fromJS([]),
            selected: fromJS({ termWeek: "未选择", week: "未选择", lesson: "未选择", lab: "未选择" }),
            pagination: fromJS({totalItem:10,pageSize:10,pageNumber:1,needPagination:false}), 
            fetching:false,
            termWeekList: fromJS([]),
            weekList: fromJS([]),
            lessonList: fromJS([]),
            labList: fromJS([])
        }
    }
    componentDidMount() {
        this.loadInfrastructureData();
    }
    loadData(){
        let selected = this.state.selected;
        if(selected.get("lab")=="未选择"){
            return;
        }
        if(selected.get("termWeek")=="未选择"&&selected.get("week")=="未选择"&&selected.get("lesson")=="未选择"){
            return;
        }
        let csrftoken = cookie.load('csrftoken')
        let req = axios.create({ baseURL: baseUrl, headers: { 'X-CSRFToken': csrftoken } })
        let getParams = { params: this.state.selected.merge(this.state.pagination).toJS() } 
        req.get(roomUsageListUrl, getParams).then(function (response) { //get all data,not handle pagination
            let rawData = fromJS(response.data);
            let listData = rawData.get("data");
            let paginationData = rawData.get("pagination");
            paginationData=this.state.pagination.merge(paginationData);
            listData=listData.map((item,index)=>{return item.set("key",index+1)})
            if(!this._unmounted) {
                this.setState({ tableData:listData,pagination:paginationData});
            }
            message.success("获取数据成功")
        }.bind(this)).catch(function (error) {
            message.error("获取数据失败")
        }.bind(this));
    }
    loadInfrastructureData() {
        let infrastructure=this.props.infrastructure;
        this.setState({termWeekList:infrastructure.getIn(["termWeekInformation","data"])})
        this.setState({weekList:infrastructure.getIn(["weekInformation","data"])})
        this.setState({lessonList:infrastructure.getIn(["lessonInformation","data"])})
        this.setState({labList:infrastructure.getIn(["labInformation","data"])})
    }
    handleSelectedChange(v, field) {
        let newState = this.state.selected;
        let self = this;
        newState = newState.set(field, v);
        this.setState({ selected: newState },()=>{
                this.loadData()
        });
    }
    tableColumnsFormats(){
        let tableFormat = [
            {
                title: "序号",
                dataIndex: "key",
                key: "key"
            },{
                title: "周次",
                dataIndex: "termWeek",
                key: "termWeek"
            },{
                title: "周",
                dataIndex: "week",
                key:"week"
            },{
                title: "节",
                dataIndex: "lesson",
                key:"lesson"
            },{
                title: "教室",
                dataIndex: "location",
                key:"location"
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
                this.setState({pagination:newPagination});
            }
        };
        return pagination;
    }
    render(){
        return(
            <div>
                <Row type="flex" justify="space-between" align="middle">
                    <Col md={{ span: 5 }} >
                        <h2 style={{ marginBottom: "15px", display: "inline" }}>有课教室</h2>
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
                            <Col>
                                <span style={{ display: "inline", paddingLeft: "10px" }}>周次</span>
                                <Select size="small" style={{ width: "90px", marginLeft: "10px" }}
                                    onChange={(v) => { this.handleSelectedChange(v, "termWeek") }}                                    
                                    value={this.state.selected.get("termWeek")}>
                                    <Select.Option key={-1} value={"未选择"}>未选择</Select.Option>
                                    {
                                        this.state.termWeekList.map(function (obj) {
                                            return <Select.Option key={obj.get("id")} value={obj.get("name")}>{obj.get("name")}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Col>
                            <Col>
                                <span style={{ display: "inline", paddingLeft: "10px" }}>周</span>
                                <Select size="small" style={{ width: "90px", marginLeft: "10px" }}
                                    onChange={(v) => { this.handleSelectedChange(v, "week") }}
                                    value={this.state.selected.get("week")}>
                                    <Select.Option key={-1} value={"未选择"}>未选择</Select.Option>
                                    {
                                        this.state.weekList.map(function (obj) {
                                            return <Select.Option key={obj.get("id")} value={obj.get("name")}>{obj.get("name")}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Col>
                            <Col>
                                <span style={{ display: "inline", paddingLeft: "10px" }}>节次</span>
                                <Select size="small" style={{ width: "90px", marginLeft: "10px" }}
                                    onChange={(v) => { this.handleSelectedChange(v, "lesson") }}
                                    value={this.state.selected.get("lesson")}>
                                    <Select.Option key={-1} value={"未选择"}>未选择</Select.Option>
                                    {
                                        this.state.lessonList.map(function (obj) {
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
                            loading={this.state.fetching}
                            >
                        </Table>
                    </Col>
                </Row>
            </div>
        )
    }
}