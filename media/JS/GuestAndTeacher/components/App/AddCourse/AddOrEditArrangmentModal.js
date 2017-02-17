/**
 * Created by he_yu_000 on 2017/1/26.
 */
import React from "react";
import {connect} from "react-redux";
import { Modal, Button,Form,Row,Col,Select,Input } from 'antd';
import {fromJS,Map,List} from "immutable";
const FormItem = Form.Item;

@connect((store)=>{
    return {infrastructure:store.infrastructure}
})
export default class AddOrEditArrangmentModal extends React.Component{
    constructor(props){
        super(props);
        let infrastructure=this.props.infrastructure;
        /*
        let arrangement=fromJS({termWeek:infrastructure.getIn(["termWeekInformation","data"]).first().get("name"),
            week:infrastructure.getIn(["weekInformation","data"]).first().get("name"),
            lesson:infrastructure.getIn(["lessonInformation","data"]).first().get("name"),
            arrangementName:""});
        */
        //this.state={arrangement:arrangement,visible:props.visible,validate:false};
        this.state={course:this.props.course,arrangement:this.props.dataSource,visible:props.visible,validate:false};
    }
    componentDidMount(){
        //初始载入的时候有数据，先验证下表单负责下一步按钮会显示错误
        //this.validateFormOne();
        //console.log("validate");
        //console.log(this.state.arrangement.toJS());
    }
    handleCancel(){
        this.props.cancel();
        this.setState({visible:false})
    }
    handleConfirm(){
        //在回掉函数中把基本信息传回去
        let arrangement=fromJS({id:this.state.arrangement.get("id"),key:this.state.arrangement.get("key"),
            week:this.state.arrangement.get("week"),termWeek:this.state.arrangement.get("termWeek"),
            lesson:this.state.arrangement.get("lesson"),arrangementName:this.state.arrangement.get("arrangementName")});
        this.setState({visible:false})
        this.props.confirm(arrangement);
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
        if((this.state.arrangement.get("termWeek")=="")||(this.state.arrangement.get("week")=="")||(this.state.arrangement.get("lesson")=="")){
            errorCount=errorCount+1;
        }if((this.state.arrangement.get("termWeek")=="未选择")||(this.state.arrangement.get("week")=="未选择")||(this.state.arrangement.get("lesson")=="未选择")){
            errorCount=errorCount+1;
        }if( (this.state.course.get("courseType")=="实验")&&(this.state.arrangement.get("arrangementName")=="") ){
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
    componentWillReceiveProps(newProps){ //当点击创建一次课程时，这个函数就被激活
        let newState={course:newProps.course,arrangement:newProps.dataSource,visible:newProps.visible};
        //每当创建和编辑一个课程时，该函数就会被调用，并且在course和arrangement中翻入课程和时间安排的信息
        //如下的判断适用于该课程是实验还是课程设计时的差异，当该课程不是实验课时，每次安排的名称就是实验课的名称
        if(newState.course.get("courseType")!="实验"){
            let name=newState.course.get("experimentName");
            let newArrangement=newState.arrangement.set("arrangementName",name);
            newState={...newState,arrangement:newArrangement};
        }
        this.setState(newState,()=>{this.validateFormOne()})
        
    }
    render(){
        let infrastructure=this.props.infrastructure;
        return(
            <Modal visible={this.state.visible} title={this.props.title} footer={this.footerHtml()} width="500px">
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
            </Modal>
        )
    }
}