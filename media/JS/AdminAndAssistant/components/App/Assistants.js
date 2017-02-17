/**
 * Created by hyt on 2017/1/18.
 */
import React from "react";
import {connect} from "react-redux";
import {List,Map,fromJS} from "immutable";
import cookie from "react-cookie";
import {Row,Col,Table,Button,Select,Card,Input,InputNumber,Form,DatePicker,Popconfirm,Modal,message} from "antd";
import axios from "axios";
import Setting from "../../globalSetting";
import moment from "moment";

let { MonthPicker, RangePicker } = DatePicker;
let FormItem = Form.Item;
let Option = Select.Option;
let baseUrl = Setting.baseUrl
let assistantListUrl=baseUrl+"api/assistantlist/";
let assistantDetailUrl=baseUrl+"api/assistantdetail/"
let labListUrl = "api/lablist/";

@connect((store)=>{
    return {infrastructure:store.infrastructure}
})
export default class Assistants extends React.Component{
    constructor(props){
        super(props);
        this.state={
            labData:fromJS([]),
            tableData:fromJS([]),
            selected: fromJS({lab: "未选择" }),
            pagination: fromJS({totalItem:10,pageSize:10,pageNumber:1,needPagination:true}), 
            fetching:false,
            addOrEditOneItem:fromJS({}), //add or edit item data
            addOrEditOneItemModal:false, //add or edit item dialog
        };
    }
    loadInfrastructureData() {
        let infrastructure=this.props.infrastructure;
        this.setState({labData:infrastructure.getIn(["labInformation","data"])})
    }
    loadData(){
        this.setState({fetching:true})
        let getParams={params:this.state.selected.merge(this.state.pagination).toJS()}
        axios.get(assistantListUrl,getParams).then(function(response){
            let rawData=fromJS(response.data);
            let assistantData=rawData.get("data");
            let paginationData = rawData.get("pagination");
            paginationData=this.state.pagination.merge(paginationData);
            assistantData=assistantData.map((item)=>{return item.set("key",item.get("id"))});
            if(!this._unmounted) { 
                this.setState({tableData:assistantData,pagination:paginationData});
                this.setState({fetching:false});
            }
            message.success("获取数据成功")
        }.bind(this)).catch(function(){                
            if(!this._unmounted) {  this.setState({fetching:false}) }
            message.success("获取数据失败")
        }.bind(this))
    }

    componentWillMount(){
        this.loadInfrastructureData();
        this.loadData();        
    }
    handleLabChange(lab){
        let newSelected=this.state.selected.set("lab",lab);
        let resetPagination=fromJS({totalItem:10,pageSize:10,pageNumber:1,needPagination:true});
        this.setState({selected:newSelected,pagination:resetPagination},()=>{this.loadData()})
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
    handleEditItem(obj){}
    handleConfirmToDeleteItem(obj){
        let csrftoken = cookie.load('csrftoken')
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
        req.delete(assistantDetailUrl+obj.get("id")+"/", {}).then(function (response) {
            message.success("删除成功")
            this.loadData()
        }.bind(this)).catch(function(error){
            message.error("删除失败")
        }.bind(this));
    }
    handleCancelToDeleteItem(){}
    tableFormat(){
        let tableFormat = 
        [
            {
                title: "姓名",
                dataIndex: "name",
                key: "id",
                width:200
            },
            {
                title: "联系方式",
                dataIndex: "phone",
                key: "name"
            },
            {
                title: "所属实验室",
                dataIndex: "lab",
                key: "lab"
            },{
                title: "操作",
                key:"action",
                width:"100px",
                render: (text,record) => (
                    <div>
                         <span>
                             <a onClick={(event)=>{  this.handleAddOrEditItem(record.key);}} >编辑</a>
                             <span className="ant-divider"/>
                               <Popconfirm title="是否要删除?" okText="确认" cancelText="取消"
                                           onConfirm={ ()=>{this.handleConfirmToDeleteItem(fromJS(record))} }
                                           onCancel={ ()=>{this.handleCancelToDeleteItem()} }
                                   >
                                   <a>删除</a>
                               </Popconfirm>

                         </span>

                    </div>
                )
            }
        ];
        return tableFormat;
    }
    handleAddOrEditItem(key){
        if(key==undefined||key<0){
            let oneItem=fromJS({id:-1,key:-1,name:"",phone:"",lab:"未选择"})
            this.setState({addOrEditOneItem:this.state.addOrEditOneItem.merge(oneItem)})
            this.setState({addOrEditOneItemModal:true})
        }else{
            let oneItemList=this.state.tableData.filter((item,index)=>{return item.get("key")==key});
            this.setState({addOrEditOneItem:oneItemList.first()});
            this.setState({addOrEditOneItemModal:true})
        }        
    }
    handleAddOrEditItemModalConfirm(obj){   
        let csrftoken = cookie.load('csrftoken')
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
        let postParams=obj.toJS()
        this.setState({addOrEditOneItemModal:false})
        if( obj.get("id")==undefined||obj.get("id")<0 ){ //add item
            req.post(assistantListUrl, postParams).then(function (response) {
                message.success("添加成功");
                this.loadData();
                this.setState({addOrEditOneItemModal:false})
            }.bind(this)).catch(function(error){
                message.error("添加失败");
                this.setState({addOrEditOneItemModal:false})
            }.bind(this));
        }else{//edit item            
            req.put(assistantDetailUrl+obj.get("id")+"/", postParams ).then(function (response) {
                message.success("添加成功");
                this.loadData();
                this.setState({editOneItemModal:false})
            }.bind(this)).catch(function(error){
                message.error("保存失败")
                this.setState({editOneItemModal:false})
            }.bind(this));
        }

    }
    handleAddOrEditItemModalCancel(){
        this.setState({addOrEditOneItemModal:false})
    }
    render(){
        let infrastructure=this.props.infrastructure;
        return(
            <div>
                <Row type="flex" justify="space-between" align="middle">
                    <Col md={{span:5}}  >
                        <h2 style={{marginBottom:"15px",display:"inline"}}>值班学生信息</h2>
                    </Col>
                    <Col md={{span:10}}>
                        <Row type="flex" justify="end" align="middle">
                            <Col>
                                <span style={{display:"inline"}}>实验室选择</span>
                            </Col>
                            <Col >
                                <Select size="small" style={{ marginLeft:"20px",width:"150px" }}
                                    value={this.state.selected.get("lab")} onChange={(v)=>{this.handleLabChange(v)}}>
                                    <Select.Option key={-1} value="未选择">未选择</Select.Option>
                                    {
                                        this.state.labData.map(function (obj) {
                                            return <Select.Option key={obj.get("id")} value={obj.get("name")}>{obj.get("name")}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Col>
                        </Row>
                    </Col>

                </Row>

                <Row type="flex" justify="end" align="middle" style={{marginTop:"20px"}}>
                    <Button type="primary" onClick={()=>{this.handleAddOrEditItem()}}>添加</Button>
                </Row>

                <Row type="flex" justify="between" align="middle">
                    <Col span={24}  >
                        {/*页面表格内容部分*/}
                        <div style={{marginBottom:"15px"}}></div>
                        <Table columns={this.tableFormat()} dataSource={this.state.tableData.toJS()}
                            pagination={this.tablePaginationFormat()} loading={this.state.fetching}></Table>
                    </Col>
                </Row>

                {/*modal for add or edit,labData is lab List */}
                <AddOrEditItemModal  visible={this.state.addOrEditOneItemModal} 
                    itemData={this.state.addOrEditOneItem}
                    onConfirm={(obj)=>{this.handleAddOrEditItemModalConfirm(obj)}}  
                    onCancel={()=>{this.handleAddOrEditItemModalCancel()}}>
                </AddOrEditItemModal>

            </div>
        )
    }
}

@connect((store)=>{
    return {infrastructure:store.infrastructure}
})
class AddOrEditItemModal extends React.Component{
    constructor(props){
        super(props)
        this.state={
            title:"",
            itemData:this.props.itemData,//外部传入的数据
            labData:fromJS([]),
            formVaild:false,formValidMessage:""
        }
    }
    loadInfrastructureData(){
        this.setState({labData:this.props.infrastructure.getIn(["labInformation","data"])})
    }
    componentDidMount(){
        this.loadInfrastructureData()
    }
    handleConfirm(obj){
        this.props.onConfirm(obj) //immutable
    }
    handleCancel(){
        this.props.onCancel()
    }
    handleFieldChange(v,field){
        let dict={};dict[field]=v;
        let change=fromJS(dict)
        this.setState({itemData:this.state.itemData.merge(change)},()=>{this.validateForm()})
    }
    componentWillReceiveProps(newProps){
        if(newProps.itemData.get("key")>0){
            this.setState({title:"编辑"})
        }else{
            this.setState({title:"添加"})
        }
        
        this.setState({itemData:newProps.itemData},()=>{this.validateForm()})
    }
    validateForm(){
        let errorCount=-1;    
        if(this.state.itemData.get("lab")==""){errorCount=errorCount+1;this.setState({formValidMessage:"实验室未选择"})}
        if(this.state.itemData.get("lab")=="未选择"){errorCount=errorCount+1;this.setState({formValidMessage:"实验室未选择"})}
        if(this.state.itemData.get("phone")==""){errorCount=errorCount+1;this.setState({formValidMessage:"房间名为空"})}
        if(this.state.itemData.get("name")==""){errorCount=errorCount+1;this.setState({formValidMessage:"用户名为空"})}
        if(errorCount>-1){
            this.setState({formVaild:false})
        }else{
            this.setState({formVaild:true,formValidMessage:""})
        }
    }
    footerHtml(){
        return(
            <div>
                <span style={{marginRight:"10px"}}>{this.state.formValidMessage}</span>
                { (this.state.formVaild)&&
                    <Button type="primary" onClick={()=>{this.handleConfirm(this.state.itemData)}}>确定</Button>
                }
                { (!this.state.formVaild)&&
                    <Button type="primary" disabled onClick={()=>{this.handleConfirm(this.state.itemData)}}>确定</Button>
                }
                <Button onClick={()=>{this.handleCancel()}} >取消</Button>
            </div>
        )
    }
    render(){
        let title=this.state.title;
        let visible=this.props.visible;
        let itemData=this.state.itemData;
        let labData=this.state.labData;
        return(
            <Modal title={title} visible={visible} footer={this.footerHtml()}> 
                <Form>
                    <Row type="flex" justify="space-around" align="middle">
                        <Col md={{span:20}} >
                            <FormItem label="学生姓名" hasFeedback >
                                <Input placeholder="学生姓名" value={itemData.get("name")}
                                    onChange={(e)=>{this.handleFieldChange(e.target.value,"name")}}/>
                            </FormItem>     
                            <FormItem label="联系电话" hasFeedback >
                                <Input placeholder="联系电话" value={itemData.get("phone")}
                                    onChange={(e)=>{this.handleFieldChange(e.target.value,"phone")}}/>
                            </FormItem>
                            <FormItem label="实验中心名称" hasFeedback > 
                                <Select defaultValue={"未选择"} value={itemData.get("lab")} 
                                    onChange={(v)=>{this.handleFieldChange(v,"lab")}}>
                                {
                                    labData.map(function (obj) {
                                        return <Option value={obj.get("name")} key={obj.get("id")}>{obj.get("name")}</Option>        
                                    })                                                                    
                                }      
                                </Select>                                                
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }

}