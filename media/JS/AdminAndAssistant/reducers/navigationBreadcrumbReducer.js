/**
 * Created by hyt on 2017/1/16.
 * 该部分代码用来在链接转跳的时候改变面包屑的内容
 */
import {Map,List,fromJS} from "immutable";
let initState=fromJS({
    hashLocation:["首页",]
});
export default function reducer(state=initState,action){
    if(action.type=="ChangeHashLocation"){
        return state.set("hashLocation",action.playload);
    }
    else{
        return state
    }
}