import React from "react";
import cookie from "react-cookie";
import { Map, List, fromJS } from "immutable";
import axios from "axios";
import { Row, Col, Table, Button, Select, Card, message } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import Setting from "../../globalSetting";

let baseUrl = Setting.baseUrl;
let systemSettingsUrl = "api/systemsettings/";

export default class SystemInformation extends React.Component {
    constructor(props) {
        super(props);
        let componentData=fromJS({term:"",termBeginDate:"",notification:""}) //immutable
        this.state={data:componentData,errorMessage:""}
    }
    componentDidMount(){
        this.loadData()
    }
    loadData() {
        let csrftoken = cookie.load('csrftoken')
        let req = axios.create({ baseURL: baseUrl, headers: { 'X-CSRFToken': csrftoken } })
        let getParams = {params:{}}
        req.get(systemSettingsUrl, getParams).then(function (response) {
            let responData = fromJS(response.data)
            this.setState({ data: this.state.data.merge(responData) })
            message.success("获取数据成功")
        }.bind(this)).catch(function (error) {
            let rawData = fromJS(error.response.data);
            message.error("获取数据失败")
        }.bind(this))
    }
    render() {
        return (
            <div>
                <Row type="flex" justify="space-between" align="middle">
                    <Col md={{ span: 10 }} >
                        <h2 style={{ marginBottom: "15px", display: "inline" }}>基本信息</h2>
                    </Col>

                    <Col md={{ span: 10 }}>
                    </Col>
                </Row>


                <Row type="flex" justify="space-around" align="middle" style={{ marginTop: "30px" }}>
                    <Col md={{ span: 24 }}>
                        <Card title="学期信息">
                            <div>
                                <p>本学期为{this.state.data.get("term")}学期,学期开始日期为{this.state.data.get("termBeginDate")}</p>
                                <p>联系方式he_yuan_tao@163.com</p>
                            </div>
                        </Card>
                    </Col>
                </Row>

            </div>
        )
    }
}
