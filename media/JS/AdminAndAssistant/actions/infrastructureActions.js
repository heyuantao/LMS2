/**
 * Created by he_yu_000 on 2017/1/20.
 */
import {Map,List,fromJS} from "immutable";
import cookie from "react-cookie"
import axios from "axios";
import Setting from "../globalSetting";

/*系统用到的所有变量*/
let baseUrl = Setting.baseUrl
let labListUrl = baseUrl + "api/lablist/"
let termWeeklistUrl = baseUrl + "api/termweeklist/"
let weekListUrl = baseUrl + "api/weeklist/"
let lessonListUrl = baseUrl + "api/lessonlist/"
let courseTypeListUrl = baseUrl + "api/coursetypelist/"
let roomListUrl = baseUrl + "api/roomlist/"


/*将基本数据保存在这个数据结构中*/
//classRoomList:classRoomList,
let infrastructureData = fromJS({
    labList: [],
    weekList: [],
    termWeekList: [],
    lessonList: [],
    courseTypeList: [],
    classRoomList: []
});


export function fetchInfrastructureDataAction() {
    console.log("fetching infrastructure data!")
    return function (dispatch) {

        dispatch({
            type: "FETCHING_INFRASTRUCTURE_DATA",
            playload: fromJS({})
        });
        axios.all([axios.get(termWeeklistUrl), axios.get(weekListUrl), axios.get(lessonListUrl),
                axios.get(labListUrl), axios.get(courseTypeListUrl)
            ])
            .then(axios.spread(function (termWeekResponse, weekResponse, lessonResponse, labResponse, courseTypeResponse) {
                //console.log("infrastructureData");

                let infrastructureData = fromJS({
                    termWeekList: termWeekResponse.data,
                    weekList: weekResponse.data,
                    lessonList: lessonResponse.data,
                    labList: labResponse.data,
                    courseTypeList: courseTypeResponse.data,
                    classRoomList: []
                });
                dispatch({
                    type: "FETCHED_INFRASTRUCTURE_DATA",
                    playload: infrastructureData
                });
            }))
            .catch(function (errors) {
                //console.log("error happen")
                dispatch({
                    type: "FETCHING_INFRASTRUCTURE_DATA_ERROR",
                    playload: fromJS({})
                })
            })

    }

}

export function updateClassRoomInInfrastructureDataAction(labName) {    
    return function(dispatch){
        if( (labName==null)||(labName=="") ){
            labName="全部"
        }
        console.log("update room list for lab:"+labName)
        let csrftoken = cookie.load('csrftoken')
        let req=axios.create({baseURL:baseUrl,headers: {'X-CSRFToken': csrftoken}})
        req.get(roomListUrl, {params:{lab:labName}
        }).then(function (response) {
            let roomList = response.data;
            dispatch({type: "UPDATE_INFRASTRUCTURE_ROOM_DATA",playload: fromJS(roomList)})
        }).catch(function(error){
            let response=error.response
            //dispatch({type:"USER_REGISTER_ERROR",playload:response.data});
        });
    }
}