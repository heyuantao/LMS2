/**
 * Created by hyt on 2017/1/10.
 */
import React from "react";
import { Row, Col ,Affix } from 'antd';
export default class AppFooter extends React.Component{
    constructor(){
        super();
    }
    render(){
        return (
            <Row type="flex"  align="middle" justify="end" style={{background:"#ffffff"}}>
                <Col>
                    <p>Design and implement by he_yuan_tao@163.com</p>
                    <span>backend:"Django","django rest framework"</span>
                    <span>front:"React","Redux","react-router","immutable","antd"</span>
                </Col>
            </Row>
        )
    }
}