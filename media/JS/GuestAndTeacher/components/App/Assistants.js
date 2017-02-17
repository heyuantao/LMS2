/**
 * Created by hyt on 2017/1/18.
 */
import React from "react";
import {connect} from "react-redux";
import {List,Map,fromJS} from "immutable";
import {Row,Col,Table,Button,Select,message} from "antd";
import axios from "axios";
import Setting from "../../globalSetting";

let baseUrl = Setting.baseUrl
let assistantListUrl=baseUrl+"api/assistantlist/";

@connect((store)=>{
    return {infrastructure:store.infrastructure}
})
export default class Assistants extends React.Component{
    constructor(props){
        super(props);
        this.state={
            tableData:fromJS([]),
            selected:fromJS({lab:"未选择"}),
            pagination: fromJS({totalItem:10,pageSize:10,pageNumber:1,needPagination:true}), 
            fetching:false
        };
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
                this.setState({tableData:assistantData,pagination:paginationData})
                this.setState({fetching:false})
                 message.success("获取数据成功");
        }.bind(this)).catch(function(){                
                this.setState({fetching:false})
                message.error("获取数据失败");
        }.bind(this))
    }
    componentWillMount(){
        this.loadData()
    }
    handleLabChange(lab){
        let newSelected=this.state.selected.set("lab",lab);
        let resetPagination=fromJS({totalItem:10,pageSize:10,pageNumber:1,needPagination:true});
        this.setState({selected:newSelected,pagination:resetPagination},()=>{this.loadData()})
    }
    assistantsTablePaginationFormat(){
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
    assistantsTableFormat(){
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
            }
        ];
        return tableFormat;
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
                                <Select size="small" style={{ marginLeft:"20px",width:"150px" }} value={this.state.selected.get("lab")}
                                    onChange={(v)=>{this.handleLabChange(v)}}>
                                    {
                                        infrastructure.getIn(["labInformation","data"]).map(function (obj) {
                                            return <Select.Option key={obj.get("id")} value={obj.get("name")}>{obj.get("name")}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Col>
                        </Row>
                    </Col>

                </Row>


                <Row type="flex" justify="between" align="middle">
                    <Col span={24}  >
                        {/*页面表格内容部分*/}
                        <div style={{marginBottom:"15px"}}></div>
                        <Table columns={this.assistantsTableFormat()} dataSource={this.state.tableData.toJS()}
                            pagination={this.assistantsTablePaginationFormat()} loading={this.state.fetching}></Table>
                    </Col>
                </Row>
            </div>
        )
    }
}