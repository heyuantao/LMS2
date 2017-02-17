import React from "react";
import axios from "axios";
import cookie from "react-cookie";
import {Map,List,fromJS} from "immutable";
import {Row,Col,Table,Button,Select,Card,Input,Form,DatePicker,message} from "antd";
import {connect} from "react-redux";
import Setting from "../../globalSetting";
import moment from "moment";
let { MonthPicker, RangePicker } = DatePicker;
let FormItem = Form.Item;

let baseUrl = Setting.baseUrl;
let systemSettingsUrl = "api/systemsettings/";


export default class SystemSettings extends React.Component{
  constructor(props){
    super(props);
    let componentData=fromJS({term:"",termBeginDate:"2015-01-01",notification:""}) //immutable
    this.state={data:componentData,errorMessage:""}
  }
  loadData(){
    let csrftoken = cookie.load('csrftoken')
    let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
    let postParams={
        term:this.state.data.get("term"),termBeginDate:this.state.data.get("termBeginDate")
    }
    req.get(systemSettingsUrl,postParams).then(function(response){
        let responData=fromJS(response.data)
        this.setState({data:this.state.data.merge(responData)})
        message.success("获取数据成功")
    }.bind(this)).catch(function(error){
        let rawData=error.response.data;
        message.error("获取数据失败")
    }.bind(this))
  }
  saveData(){
    let csrftoken = cookie.load('csrftoken')
    let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
    let postParams={
        term:this.state.data.get("term"),termBeginDate:this.state.data.get("termBeginDate"),
        notification:this.state.data.get("notification")
    }
    req.post(systemSettingsUrl,postParams).then(function(response){
        //console.log(response.data)
        let responData=fromJS(response.data)
        this.setState({data:this.state.data.merge(responData)})
        message.success("保存成功")
    }.bind(this)).catch(function(error){
        let rawData=error.response.data;
        message.error("出现错误")
    }.bind(this))
  }
  handleOnClick(){
      this.saveData()
  }
  componentDidMount(){
    this.loadData()
  }
  handleFieldChange(v,field){
      if( (field=="term")||(field=="notification") ){
        let dict={};dict[field]=v;
        let newField=fromJS(dict)
        this.setState({data:this.state.data.merge(newField)})
      }else if( (field=="termBeginDate")&&(v.length!=0) ){
        let dict={};dict[field]=v;
        let newField=fromJS(dict)
        this.setState({data:this.state.data.merge(newField)})
      }

  }
  handleDateChange(date,dateString){
      if(date!=null){
          let dict={};dict["termBeginDate"]=date;
          let newField=fromJS(dict)
          this.setState({data:this.state.data.merge(newField)})
      }
  }
  render(){
    let formItemLayout = {labelCol: { span: 6 },wrapperCol: { span: 14 },};
    let tailFormItemLayout = {wrapperCol: {span: 14,offset: 6,},};
    let dateFormat = 'YYYY-MM-DD';
    return(
      <div>
          <Row type="flex" justify="space-between" align="middle">
              <Col md={{span:10}} >
                  <h2 style={{marginBottom:"15px",display:"inline"}}>系统初始设置</h2>
              </Col>

              <Col md={{span:10}}>
              </Col>
          </Row>


          <Row type="flex" justify="space-around" align="middle" style={{marginTop:"30px"}}>
              <Col md={{span:22}}>
                  <Card title="学期信息">
                      <Form>
                        <FormItem label="学期信息" hasFeedback {...formItemLayout}>
                            <Input value={this.state.data.get("term")} onChange={(e)=>{this.handleFieldChange(e.target.value,"term")}}/>
                        </FormItem>
                        <FormItem label="学期开始日期" hasFeedback {...formItemLayout}>
                            <DatePicker format={dateFormat} 
                                value={moment(this.state.data.get("termBeginDate"), 'YYYY-MM-DD')}
                                onChange={(date,dateString)=>{this.handleFieldChange(dateString,"termBeginDate")}}/>
                        </FormItem>
                        <FormItem label="通知公告" hasFeedback {...formItemLayout}>
                            <Input value={this.state.data.get("notification")}  onChange={(e)=>{this.handleFieldChange(e.target.value,"notification")}}
                                type="textarea" rows={4}/>   
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" onClick={()=>{this.handleOnClick()}}>保存</Button>
                        </FormItem>
                      </Form>
                  </Card>
              </Col>
          </Row>

        </div>
    )
  }
}
