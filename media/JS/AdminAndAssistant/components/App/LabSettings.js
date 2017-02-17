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
let labDetailUrl = "api/labdetail/";

@connect(
    (store)=>{ return {infrastructure:store.infrastructure,user:store.user}; },
    (dispatch) => { return { hashAction:bindActionCreators(hashLocationActionCreators,dispatch) }; }
)
export default class LabSettings extends React.Component{
    constructor(props){
        super(props)
        this.state={
            tableData:fromJS([]),
            addOrEditOneItem:fromJS({}), //add or edit item data
            addOneItemModal:false, //add or edit item dialog
            //pagination: fromJS({totalItem:10,pageSize:10,pageNumber:1,needPagination:false}), 
            //pageNumber:1, //第几页
            fetching:false
        }
    }
    componentDidMount(){
        this.loadData()
    }
    loadData(){
        let csrftoken = cookie.load('csrftoken')
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
        let getParams={params:{}}
        this.setState({fetching:true})
        req.get(labListUrl, getParams ).then(function (response) {
            let tableData = fromJS(response.data);
            tableData=tableData.map((item,index)=>{return item.set("key",index)});
            this.setState({tableData:tableData,totalItem:tableData.size})
            this.setState({fetching:false})
            message.success("获取数据成功")
        }.bind(this)).catch(function(error){
            this.setState({fetching:false})
            message.error("获取数据失败")
        }.bind(this));
    }
    handleConfirmToDeleteItem(obj){
        let csrftoken = cookie.load('csrftoken')
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
        req.delete(labDetailUrl+obj.get("id")+"/", {}).then(function (response) {
            message.success("删除成功")
            this.loadData()
        }.bind(this)).catch(function(error){
            message.error("删除失败")
        }.bind(this));
    }
    handleCancelToDeleteItem(){

    }
    tableColumnsFormats(){
        let tableFormat = [
            {
                title: "实验名称",
                dataIndex: "name",
                key: "id"
            },
            {
                title: "别名",
                dataIndex: "nickName",
                key:"nickName"
            },
             {
                title: "操作",
                key:"action",
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
    /*
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
    */
    handleAddOrEditItem(key){
        if(key==undefined||key<0){
            let oneItem=fromJS({id:-1,key:-1,name:"",nickName:""})
            this.setState({addOrEditOneItem:this.state.addOrEditOneItem.merge(oneItem)})
            this.setState({addOrEditOneItemModal:true})
        }else{
            let oneItemList=this.state.tableData.filter((item,index)=>{return item.get("key")==key});
            this.setState({addOrEditOneItem:oneItemList.first()});
            this.setState({addOrEditOneItemModal:true})
        }
    }
    handleAddOrEditItemModalConfirm(obj){
        console.log(obj.get("key"))
        if(obj.get("key")==undefined||obj.get("key")<0){
            this.setState({addOrEditOneItemModal:false})
            //axios data and loadData
            let csrftoken = cookie.load('csrftoken')
            let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
            //let postParams={params:{name:obj.get("name"),nickName:obj.get("nickName")}}
            let postParams=obj.toJS()
            req.post(labListUrl, postParams ).then(function (response) {
                message.success("添加成功");
                this.loadData();
            }.bind(this)).catch(function(error){
                message.error("添加失败");
            }.bind(this));
        }else{
            this.setState({addOrEditOneItemModal:false})        
            //axios data and loadData
            let csrftoken = cookie.load('csrftoken')
            let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
            let postParams=obj.toJS()
            req.put(labDetailUrl+obj.get("id")+"/", postParams ).then(function (response) {
                message.success("添加成功");
                this.loadData();
            }.bind(this)).catch(function(error){
                message.error("保存失败")
            }.bind(this));
        }

    }
    handleAddOrEditItemModalCancel(){
        this.setState({addOrEditOneItemModal:false})
    }
    render(){
        let user=this.props.user;
        return(
            <div>
                <Row type="flex" justify="space-between" align="middle">
                    <Col md={{span:10}} >
                        <h2 style={{marginBottom:"15px",display:"inline"}}>实验室信息</h2>
                    </Col>  
                    <Row type="flex" justify="end" align="middle">                 
                        <Col md={{span:24}}>
                        {
                                UserData.isAdministrator(user.get("userType")) &&
                                <Button style={{marginLeft:"10px"}} type="primary" onClick={()=>{this.handleAddOrEditItem()}}>添加</Button>
                        }
                        </Col>
                    </Row>
                </Row>
                <Row type="flex" justify="between" align="middle">
                    <Col span={24}  >
                        <div style={{marginBottom:"15px"}}></div>
                        <Table columns={this.tableColumnsFormats()} dataSource={this.state.tableData.toJS()}
                            //pagination={this.tablePaginationFormat()}
                            loading={this.state.fetching}
                            >
                        </Table>
                    </Col>
                </Row>
                {/*modal for add or edit */}
                <AddOrEditItemModal  visible={this.state.addOrEditOneItemModal} 
                    itemData={this.state.addOrEditOneItem}
                    onConfirm={(obj)=>{this.handleAddOrEditItemModalConfirm(obj)}}  
                    onCancel={()=>{this.handleAddOrEditItemModalCancel()}}>
                </AddOrEditItemModal>
            </div>
        )
    }
}

class AddOrEditItemModal extends React.Component{
    constructor(props){
        super(props)
        this.state={
            itemData:this.props.itemData, //外部传入的参数
            //内部逻辑生成的参数
            title:"",//根据传输的参数设置标题            
            formVaild:false,formValidMessage:""
        }
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
    validateForm(){
        let errorCount=-1;        
        if(this.state.itemData.get("nickName")==""){errorCount=errorCount+1;this.setState({formValidMessage:"别名为空"})}
        if(this.state.itemData.get("name")==""){errorCount=errorCount+1;this.setState({formValidMessage:"实验中心名字为空"})}
        if(errorCount>-1){
            this.setState({formVaild:false})
        }else{
            this.setState({formVaild:true,formValidMessage:""})
        }
    }
    componentWillReceiveProps(newProps){
        if(newProps.itemData.get("key")>0){
            this.setState({title:"编辑"})
        }else{
            this.setState({title:"添加"})
        }
        this.setState({itemData:newProps.itemData},()=>{this.validateForm()})
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
        let itemData=this.state.itemData
        return(
            <Modal title={title} visible={visible} footer={this.footerHtml()} >
                <Form>
                    <Row type="flex" justify="space-around" align="middle">
                        <Col md={{span:20}} >
                            <FormItem label="实验中心名称" hasFeedback >
                                <Input placeholder="实验中心名称" value={itemData.get("name")}
                                    onChange={(e)=>{this.handleFieldChange(e.target.value,"name")}}/>
                            </FormItem>
                            <FormItem label="实验别名" hasFeedback >
                                <InputNumber placeholder="别名" value={itemData.get("nickName")}
                                    onChange={(v)=>{this.handleFieldChange(v,"nickName")}}/>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }

}