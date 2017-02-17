/**
 * Created by he_yu_000 on 2017/1/20.
 */
import {Map,List,fromJS} from "immutable";


let initState=fromJS({
    labInformation:{
        data:[],
        fetching: false,
        fetched: false,
        error:false
    },
    classRoomInformation:{
        data:[],
        fetching: false,
        fetched: false,
        error:false
    },
    termWeekInformation:{
        data:[],
        fetching: false,
        fetched: false,
        error:false
    },
    weekInformation:{
        data:[],
        fetching: false,
        fetched: false,
        error:false
    },
    lessonInformation:{
        data:[],
        fetching: false,
        fetched: false,
        error:false
    },
    courseTypeInformation:{
        data:[],
        fetching: false,
        fetched: false,
        error:false
    }
});
export default function reducer(state=initState,action){
    if(action.type=="FETCHING_INFRASTRUCTURE_DATA"){
        //let finalStatus=state.setIn(["labInformation","data"],action.playload.get("labList"));        
        //finalStatus=finalStatus.setIn(["termWeekInformation","data"],action.playload.get("termWeekList"));
        //finalStatus=finalStatus.setIn(["weekInformation","data"],action.playload.get("weekList"));
        //finalStatus=finalStatus.setIn(["lessonInformation","data"],action.playload.get("lessonList"));
        //finalStatus=finalStatus.setIn(["courseTypeInformation","data"],action.playload.get("courseTypeList"));
        
        let finalStatus=state.setIn(["labInformation","fetching"],true);        
        finalStatus=finalStatus.setIn(["termWeekInformation","fetching"],true);
        finalStatus=finalStatus.setIn(["weekInformation","fetching"],true);
        finalStatus=finalStatus.setIn(["lessonInformation","fetching"],true);
        finalStatus=finalStatus.setIn(["courseTypeInformation","fetching"],true);
        //console.log(finalStatus.toJS())
        return finalStatus;
    }else if(action.type=="FETCHED_INFRASTRUCTURE_DATA"){

        let finalStatus=state.setIn(["labInformation","data"],action.playload.get("labList"));        
        finalStatus=finalStatus.setIn(["termWeekInformation","data"],action.playload.get("termWeekList"));
        finalStatus=finalStatus.setIn(["weekInformation","data"],action.playload.get("weekList"));
        finalStatus=finalStatus.setIn(["lessonInformation","data"],action.playload.get("lessonList"));
        finalStatus=finalStatus.setIn(["courseTypeInformation","data"],action.playload.get("courseTypeList"));
        //finalStatus=finalStatus.setIn(["classRoomInformation","data"],action.playload.get("classRoomList"));
        finalStatus=finalStatus.setIn(["labInformation","fetching"],false);        
        finalStatus=finalStatus.setIn(["termWeekInformation","fetching"],false);
        finalStatus=finalStatus.setIn(["weekInformation","fetching"],false);
        finalStatus=finalStatus.setIn(["lessonInformation","fetching"],false);
        finalStatus=finalStatus.setIn(["courseTypeInformation","fetching"],false);
        //console.log(finalStatus.toJS());
        return finalStatus;
    }else if(action.type=="FETCHING_INFRASTRUCTURE_DATA_ERROR"){
        let finalStatus=state.setIn(["labInformation","error"],true);        
        finalStatus=finalStatus.setIn(["termWeekInformation","error"],true);
        finalStatus=finalStatus.setIn(["weekInformation","error"],true);
        finalStatus=finalStatus.setIn(["lessonInformation","error"],true);
        finalStatus=finalStatus.setIn(["courseTypeInformation","error"],true);
        return finalStatus;
    }else if(action.type=="UPDATE_INFRASTRUCTURE_ROOM_DATA") {
        //return { ...state, classRoomInformation:{...state.classRoomInformation,data:action.playload},};
        console.log("in inf")
        console.log(action.playload)
        return state.setIn(["classRoomInformation","data"],action.playload)
    }else{
        return state;
    }
}