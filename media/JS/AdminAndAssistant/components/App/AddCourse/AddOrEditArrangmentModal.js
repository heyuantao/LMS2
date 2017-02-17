/**
 * Created by he_yu_000 on 2017/1/26.
 */
import React from "react";
import {connect} from "react-redux";
import axios from "axios";
import { Modal, Button,Form,Row,Col,Select,Input,message } from 'antd';
import cookie from "react-cookie";
import {fromJS,Map,List} from "immutable";
import Setting from "../../../globalSetting";
const FormItem = Form.Item;

let baseUrl = Setting.baseUrl;
let labListUrl = "api/lablist/";
let roomListUrl = "api/roomlist/";
let roomDetailUrl = "api/roomdetail/";

@connect((store)=>{
    return {infrastructure:store.infrastructure}
})
export default class AddOrEditArrangmentModal extends React.Component{
    constructor(props){
        super(props);
        let infrastructure=this.props.infrastructure;
        this.state={
            arrangement:this.props.arrangement,//课程时间安排，这个时该组件要处理的数据，这是该组件的主要数据源
            course:this.props.course,//课程信息，该信息用于辅助该组件进行检查灯工作            
            visible:props.visible,
            //上面变量受到外部的设置影响
            modalTitle:"",//根据传入arrangement的id来决定时添加课程还是修改课程
            validate:false,
            roomData:fromJS([]) //实验室房间信息，用ajax获取，在表单中使用
        };
    }
    componentDidMount(){
        //初始载入的时候有数据，先验证下表单负责下一步按钮会显示错误
        this.loadRoomData()
        this.validateFormOne();        
    }
    loadRoomData(){
        let csrftoken = cookie.load('csrftoken')
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
        //获取选定实验中心的房间
        let getParams={params:{lab:this.state.course.get("lab")}}
        req.get(roomListUrl, getParams).then(function (response) {
            let roomData = fromJS(response.data);
            this.setState({roomData:roomData})
        }.bind(this)).catch(function(error){
            message.error("获取数据失败")
        }.bind(this));
    }
    handleCancel(){
        this.props.cancel();
        this.setState({visible:false})
    }
    handleConfirm(){
        this.setState({visible:false})
        this.props.confirm(this.state.arrangement)
        //this.props.confirm(arrangement);
    }
    handleFormOneChange(v,field){
        let origin=this.state.arrangement;
        //let newObj={...origin};
        //newObj[field]=v;
        origin=origin.set(field,v);
        this.setState({arrangement:origin},function(){
            this.validateFormOne();
        }.bind(this));
    }
    validateFormOne(){
        let errorCount=-1;
        //if((this.state.arrangement.get("termWeek")=="")||(this.state.arrangement.get("week")=="")||(this.state.arrangement.get("lesson")=="")){
        //    errorCount=errorCount+1;
        //}
        if((this.state.arrangement.get("termWeek")=="未选择")||(this.state.arrangement.get("week")=="未选择")||(this.state.arrangement.get("lesson")=="未选择")){
            errorCount=errorCount+1;
        }
        if( (this.state.course.get("courseType")=="实验")&&(this.state.arrangement.get("arrangementName")=="") ){
             errorCount=errorCount+1;
        }
        if( this.state.arrangement.get("location")=="未选择" ){
             errorCount=errorCount+1;
        }
        if(errorCount<0){
            this.setState({validate:true});
        }else{
            this.setState({validate:false});
        }
    }
    footerHtml(){
        return(
            <div style={{marginTop:"20px"}}>
                <Button onClick={()=>{this.handleCancel()}} >取消</Button>
                {
                    (this.state.validate==true)&&<Button type="primary" onClick={()=>{this.handleConfirm()}}>确定</Button>
                }
                {
                    (this.state.validate==false)&&<Button type="primary"  disabled onClick={()=>{this.handleConfirm()}}>确定</Button>
                }
            </div>
        )
    }
    componentWillReceiveProps(newProps){ 
        //当点击创建或者课程时，这个函数就被激活
        let newState={course:newProps.course,arrangement:newProps.arrangement,visible:newProps.visible};
        //每当创建和编辑一个课程时，该函数就会被调用，并且在course和arrangement中翻入课程和时间安排的信息
        //如下的判断适用于该课程是实验还是课程设计时的差异，当该课程不是实验课时，每次安排的名称就是实验课的名称
        if(newState.course.get("courseType")!="实验"){
            let name=newState.course.get("experimentName");
            let newArrangement=newState.arrangement.set("arrangementName",name);
            newState={...newState,arrangement:newArrangement};
        }
        if(newProps.arrangement.get("key")==-1){
            this.setState({modalTitle:"添加课程"})
        }else{
            this.setState({modalTitle:"修改课程"})
        }
        this.setState(newState,()=>{this.validateFormOne()})
        
    }
    render(){
        let infrastructure=this.props.infrastructure;
        return(
            <Modal visible={this.state.visible} title={this.state.modalTitle} footer={this.footerHtml()} width="500px">
                <Row gutter={40} type="flex" justify="space-around" align="middle">
                    <Col md={{span:8}}>
                        <FormItem label="课程周次" hasFeedback>
                            <Select style={{width:"100%"}} value={this.state.arrangement.get("termWeek")} 
                                    onChange={(v)=>{this.handleFormOneChange(v,"termWeek")}}>
                                {
                                    infrastructure.getIn(["termWeekInformation","data"]).map(function (obj) {
                                        return <Select.Option key={obj.get("id")} value={obj.get("name")}>{obj.get("name")}</Select.Option>
                                    })
                                }
                            </Select>
                        </FormItem>
                    </Col>
                    <Col md={{span:8}}>
                        <FormItem label="星期" hasFeedback>
                            <Select style={{width:"100%"}} value={this.state.arrangement.get("week")} 
                                onChange={(v)=>{this.handleFormOneChange(v,"week")}}>
                                {
                                    infrastructure.getIn(["weekInformation","data"]).map(function (obj) {
                                        return <Select.Option key={obj.get("id")} value={obj.get("name")}>{obj.get("name")}</Select.Option>
                                    })
                                }
                            </Select>
                        </FormItem>
                    </Col>
                    <Col md={{span:8}}>
                        <FormItem label="课程节次" hasFeedback>
                            <Select style={{width:"100%"}} value={this.state.arrangement.get("lesson")} 
                                onChange={(v)=>{this.handleFormOneChange(v,"lesson")}}>
                                {
                                    infrastructure.getIn(["lessonInformation","data"]).map(function (obj) {
                                        return <Select.Option key={obj.get("id")} value={obj.get("name")}>{obj.get("name")}</Select.Option>
                                    })
                                }
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                {/*如果是实验课*/}
                { (this.state.course.get("courseType")=="实验")&&
                    <Row gutter={10} type="flex" justify="space-between" align="middle">
                        <Col md={{span:24}}>
                            <FormItem label="实验名称" hasFeedback>
                                <Input value={this.state.arrangement.get("arrangementName")} onChange={(e)=>{this.handleFormOneChange(e.target.value,"arrangementName")}}/>
                            </FormItem>
                        </Col>
                    </Row>
                }
                {/*如果不是实验课*/}
                { (this.state.course.get("courseType")!="实验")&&
                    <Row gutter={10} type="flex" justify="space-between" align="middle">
                        <Col md={{span:24}}>
                            <FormItem label="课程设计" hasFeedback>
                                <Input value={this.state.arrangement.get("arrangementName")} disabled onChange={(e)=>{this.handleFormOneChange(e.target.value,"arrangementName")}}/>
                            </FormItem>
                        </Col>
                    </Row>
                }
                <Row gutter={40} type="flex" justify="start" align="middle">
                    <Col md={{span:10}}>
                        <FormItem label="上课地点" hasFeedback>
                            <Select style={{width:"100%"}} value={this.state.arrangement.get("location")} 
                                onChange={(v)=>{this.handleFormOneChange(v,"location")}}>
                                {
                                    this.state.roomData.map(function (obj) {
                                        return <Select.Option key={obj.get("id")} value={obj.get("name")}>{obj.get("name")}</Select.Option>
                                    })
                                }
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
            </Modal>
        )
    }
}