/**
 * Created by hyt on 2017/1/10.
 */
import React from "react";
import { Modal,Table,Button,Pagination} from "antd";
export default class CourseArrangementsModal extends React.Component{
    constructor(props) {
        super(props);
        const originCourseArrangementData = [
            {id: 1, termWeek: "第三周", week: "周二", lesson: "1-2节", room: "08A502", assistant: "张三",name:"TCP/IP实验1"},
            {id: 2, termWeek: "第二周", week: "周一", lesson: "1-2节", room: "08A503", assistant: "张三",name:"TCP/IP网络故障测试"},
            {id: 3, termWeek: "第二周", week: "周一", lesson: "1-2节", room: "08A503", assistant: "张三",name:"TCP/IP"},
            {id: 4, termWeek: "第二周", week: "周一", lesson: "1-2节", room: "08A503", assistant: "张三",name:"TCP/IP"},
            {id: 5, termWeek: "第二周", week: "周一", lesson: "1-2节", room: "08A503", assistant: "张三",name:"TCP/IP"},
            {id: 6, termWeek: "第二周", week: "周一", lesson: "1-2节", room: "08A503", assistant: "张三",name:"TCP/IP"},
            {id: 7, termWeek: "第二周", week: "周一", lesson: "1-2节", room: "08A503", assistant: "张三",name:"TCP/IP"},
            {id: 8, termWeek: "第二周", week: "周一", lesson: "1-2节", room: "08A503", assistant: "张三",name:"TCP/IP"},
            {id: 9, termWeek: "第二周", week: "周一", lesson: "1-2节", room: "08A503", assistant: "张三",name:"TCP/IP"},
            {id: 10, termWeek: "第二周", week: "周一", lesson: "1-2节", room: "08A503", assistant: "张三",name:"TCP/IP"},
            {id: 11, termWeek: "第二周", week: "周一", lesson: "1-2节", room: "08A503", assistant: "张三",name:"TCP/IP"},
            {id: 12, termWeek: "第二周", week: "周一", lesson: "1-2节", room: "08A503", assistant: "张三",name:"TCP/IP"},
            {id: 13, termWeek: "第二周", week: "周一", lesson: "1-2节", room: "08A503", assistant: "张三",name:"TCP/IP"},
        ];
        const extraCourseInformation={
            requireAsstant:true,remarks:"注意安装Vmware"
        }
        var courseArrangementData=[];
        originCourseArrangementData.forEach(function(obj,index,array){
            var newObj={...obj,key:obj.id.toString()};
            courseArrangementData.push(newObj);
        });
        this.state={
            courseArrangementData:courseArrangementData,courseId:this.props.courseId,loading:true,
            extraCourseInformation:extraCourseInformation
        };

    }
    componentWillReceiveProps(props) {
        var oldState=Object.assign({},this.state);
        if(this.state.courseId!=this.props.courseId){
            console.log("prop change !");
            this.setState({courseId:props.courseId,loading:true});
        }else{
            setTimeout(function(){
                this.setState({loading:false});
            }.bind(this),1000)
        }

    }
    render(){
        const courseArrangementTableFormat = [
            {title: "周次", dataIndex: "termWeek", key: "termWeek"},
            {title: "周", dataIndex: "week", key: "week"},
            {title: "节次", dataIndex: "lesson", key: "lesson"},
            {title: "教室", dataIndex: "room", key: "room"},
            {title: "课程名称", dataIndex: "name", key: "name"},
            {title: "助理", dataIndex: "assistant", key: "assistant"}
        ];name
        const paginationSettings = {
            defaultPageSize:6
        };
        return(
            <Modal title="课程信息" visible={this.props.visible}
                   onOk={()=>{this.handleCloseCourseInformationModal()}}
                   footer={[
                            <Button key="submit" type="primary" size="default"
                             onClick={()=>{this.props.close()}}>确定</Button>,
                        ]}
                >
                <div style={{margin:"5px 30px"}}>
                    <div style={{marginBottom:"0px"}}></div>
                    <Table columns={courseArrangementTableFormat} loading={this.state.loading}
                           dataSource={this.state.courseArrangementData}
                           pagination={paginationSettings} defaultPageSize={5}>
                    </Table>
                </div>
            </Modal>
        );
    }
}