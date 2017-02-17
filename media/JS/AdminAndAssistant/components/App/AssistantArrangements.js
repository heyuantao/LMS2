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
                paginationData=this.state.pagination.merge(paginationData);
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
    handleConfirm(obj) {
        let csrftoken = cookie.load('csrftoken')
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
        let postParams=obj.toJS()
        console.log(obj.toJS())
        req.put(assistantArrangementUrl, postParams ).then(function (response) {
            message.success("添加成功");
            if(!this._unmounted) {  this.setState({ editOneItemModal: false }) }
            this.loadData();
        }.bind(this)).catch(function(error){
            if(!this._unmounted) {  this.setState({ editOneItemModal: false }) }
            message.error("保存失败")
        }.bind(this));       
        
    }
    handleCancel() {
        this.setState({ editOneItemModal: false })
    }
    handleEditItem(key){
        let oneItemList=this.state.tableData.filter((item,index)=>{return item.get("key")==key});
        let oneItem=oneItemList.first().set("termWeek",this.state.selected.get("termWeek"))
        oneItem=oneItem.set("lab",this.state.selected.get("lab"))
        this.setState({editOneItem:oneItem});
        this.setState({editOneItemModal:true})
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
            },{
                title: "操作",
                key:"action",
                width:"100px",
                render: (text,record) => (
                    <div>
                         <span>
                             <a onClick={(event)=>{  this.handleEditItem(record.key);}} >编辑</a>
                         </span>
                    </div>
                )
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

                <AssistantArrangementsModal visible={this.state.editOneItemModal}
                    onConfirm={(object) => { this.handleConfirm(object) }}
                    onCancel={() => { this.handleCancel() }}
                    data={this.state.editOneItem} ></AssistantArrangementsModal>

            </div>
        )
    }
}

class AssistantArrangementsModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: this.props.visible,itemData: fromJS({}),
            formVaild: false, formValidMessage: "", assistantList: fromJS([]) //internal
        }
    }
    componentWillReceiveProps(newProps) {
        this.setState({ visible: newProps.visible, itemData: newProps.data }, function () {
            let itemData = this.state.itemData;
            //when click one cell , js will set lesson and week information in itemData
            if ( (itemData.get("lab") != "未选择") ) {
                console.log("item data:"+itemData.get("lab"))
                this.loadAssistantData()
            }
            this.validateForm();
        })
    }
    componentDidMount() {
    }
    validateForm(){
        let errorCount=-1;
        if(this.state.itemData.get("assistant")=="未选择"){
            errorCount=errorCount+1;
        }
        if(errorCount<0){
            this.setState({formVaild:true})
        }else{
            this.setState({formVaild:false})
        }
    }
    loadAssistantData() {
        let csrftoken = cookie.load('csrftoken')
        let req = axios.create({ baseURL: baseUrl, headers: { 'X-CSRFToken': csrftoken } })
        let labName = "";
        if (this.state.itemData != undefined || this.state.itemData != null) {
            labName = this.state.itemData.get("lab")
            let getParams = { params: { lab: labName, needPagination:false } }
            req.get(assistantListUrl, getParams).then(function (response) {
                let assistantData = fromJS(response.data.data);
                if(!this._unmounted) { this.setState({ assistantList: assistantData }) }
            }.bind(this)).catch(function (error) {
                message.error("获取数据失败")
                let assistantData = fromJS([]);
                if(!this._unmounted) { this.setState({ assistantList: assistantData }) }
            }.bind(this));
        }

    }
    handleConfirm(obj) {
        this.props.onConfirm(obj)
    }
    handleCancel() {
        this.props.onCancel()
    }
    footerHtml() {
        return (
            <div>
                {(this.state.formVaild)&&
                    <Button type="primary" onClick={() => { this.handleConfirm(this.state.itemData) }}>确定</Button>
                }
                {(!this.state.formVaild)&&
                    <Button type="primary" disabled onClick={() => { this.handleConfirm(this.state.itemData) }}>确定</Button>
                }                
                <Button onClick={() => { this.handleCancel() }} >取消</Button>
            </div>
        )
    }
    handleFieldChange(v, field) {
        let newState = this.state.itemData;
        newState = newState.set(field, v);
        this.setState({ itemData: newState },()=>{this.validateForm()});
    }
    render() {
        let itemData = this.state.itemData;
        return (
            <Modal title="修改值班学生" visible={this.state.visible} footer={this.footerHtml()}>
                <Form>
                    <Row type="flex" justify="space-between" align="middle">
                        <FormItem label="周次" hasFeedback md={{ span: 5 }}>
                            <Input placeholder="周次" disabled value={itemData.get("termWeek")} />
                        </FormItem>
                        <FormItem label="周" hasFeedback md={{ span: 5 }}>
                            <Input placeholder="周" disabled value={itemData.get("week")} />
                        </FormItem>
                        <FormItem label="节次" hasFeedback md={{ span: 5 }}>
                            <Input placeholder="节次" disabled value={itemData.get("lesson")} />
                        </FormItem>
                    </Row>
                    <Row type="flex" justify="space-between" align="middle">
                        <FormItem label="值班学生" hasFeedback style={{ width: "100px" }}>
                            <Select value={itemData.get("assistant")} onChange={(v)=>{this.handleFieldChange(v,"assistant")}}>
                                {
                                    this.state.assistantList.map(function (obj) {
                                        return <Option value={obj.get("name")} key={obj.get("id")}>{obj.get("name")}</Option>
                                    })
                                }
                            </Select>
                        </FormItem>
                    </Row>
                </Form>
            </Modal>
        )
    }
}