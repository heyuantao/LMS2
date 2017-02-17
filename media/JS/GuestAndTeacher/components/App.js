/**
 * Created by hyt on 2017/1/9.
 */
import React from "react";
import {connect} from "react-redux"
import AppHeader from "./App/AppHeader"
import AppFooter from "./App/AppFooter"
import AppSideBar from "./App/AppSideBar"
import { Row, Col,Layout,Card,Breadcrumb,Icon,Modal } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

@connect((store) => {
    return {
        infrastructure:store.infrastructure,
        hashLocation: store.navigationBreadcrumb.get("hashLocation")
    };
})
export default class App extends React.Component{
    constructor(props){
        super(props);
    }
    infrastructureDataIsFetching(){
        let infrastructure=this.props.infrastructure;
        let fetching=( infrastructure.getIn(["termWeekInformation","fetching"])||infrastructure.getIn(["weekInformation","fetching"])||
            infrastructure.getIn(["lessonInformation","fetching"]) )
        if(fetching==true){
            return true
        }else{
            return false
        }
    }
    infrastructureDataIsFetchingError(){
        let infrastructure=this.props.infrastructure;
        let error=( infrastructure.getIn(["termWeekInformation","error"])||infrastructure.getIn(["weekInformation","error"])||
            infrastructure.getIn(["lessonInformation","error"]) )
        if(error==true){
            return true
        }else{
            return false
        }
    }
    render(){
        return(
            <div style={{background:"#ececec"}}>
                <Row type="flex" justify="center" align="middle " style={{marginBottom:"30px",background:"#ffffff"}}>
                    <Col md={{span:20}}>
                        <AppHeader/>
                    </Col>
                </Row>

                <Row type="flex" justify="center" align="top">
                    <Col md={{span:20}}>
                        <Card>
                            <Col md={{span:5}}>
                                <AppSideBar></AppSideBar>
                            </Col>
                            <Col  md={{span:16,offset:1}}>
                                {/*面包屑导航部分*/}
                                <Breadcrumb style={{marginBottom:"20px"}}>
                                    {
                                        this.props.hashLocation.map(function(item){
                                            return(
                                                <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
                                            )
                                        })
                                    }
                                </Breadcrumb>
                                {/*页面表格内容部分*/}
                                {   ( (this.infrastructureDataIsFetching()==false)&&(this.infrastructureDataIsFetchingError()==false) )&&
                                    <div style={{minHeight:"750px"}}>
                                        {this.props.children}
                                    </div>
                                }
                                {   ( (this.infrastructureDataIsFetching()==true)&&(this.infrastructureDataIsFetchingError()==false)  )&&
                                    <div style={{minHeight:"750px"}}>
                                    <h1>正在载入</h1>
                                    </div>
                                }
                                {   ((this.infrastructureDataIsFetchingError()==true) )&&
                                    <div style={{minHeight:"750px"}}>
                                    <h1>数据载入失败</h1>
                                    </div>
                                }
                            </Col>
                        </Card>
                    </Col>
                </Row>

                <Row type="flex" justify="center" align="bottom" style={{marginTop:"20px",background:"#ffffff"}}>
                    <Col md={{span:20}}>
                        <AppFooter />
                    </Col>
                </Row>
            </div>
        )
    }
}