/**
 * Created by hyt on 2017/1/23.
 */
import {fromJS,Map,List} from "immutable";

class ClassRoomLessonData{
    constructor(){
        {/*产生周次的信息*/}
        let termWeekList=[];
        let termWeekEnd=18;
        for(let i=1;i<=termWeekEnd;i++){
            let item={id:i.toString(),name:"第"+i+"周"};
            termWeekList.push(item);
        }
        this.termWeekList=termWeekList;

        {/*产生周的信息*/}
        let weekList=[];
        for(let i=1;i<=7;i++){
            let item={id:i.toString(),name:"周"+i};
            weekList.push(item);
        }
        this.weekList=weekList;

        {/*产生每次课程的信息*/}
        let lessonList=[
            {id:"1",name:"1-2节"},
            {id:"2",name:"3-4节"},
            {id:"3",name:"5-6节"},
            {id:"4",name:"7-8节"},
            {id:"5",name:"9-10节"},
        ];
        this.lessonList=lessonList;
    }
    fetchDataAt(classroom){
        let originData=[
            {id:"1",termWeek:"第1周",week:"周1",lesson:"1-2节",teacher:"李清秀",courseName:"计算机网络原理"},
            {id:"2",termWeek:"第1周",week:"周2",lesson:"3-4节",teacher:"李清秀",courseName:"计算机网络原理"},
            {id:"3",termWeek:"第2周",week:"周1",lesson:"1-2节",teacher:"李清秀",courseName:"计算机网络原理"},
            {id:"4",termWeek:"第1周",week:"周3",lesson:"1-2节",teacher:"李清秀",courseName:"计算机网络原理"},
            {id:"5",termWeek:"第1周",week:"周4",lesson:"5-6节",teacher:"李清秀",courseName:"计算机网络原理"},
            {id:"6",termWeek:"第5周",week:"周1",lesson:"1-2节",teacher:"李清秀",courseName:"计算机网络原理"},
        ];

        {/*生成在g2表格中用到的数据*/}
        let xAixData=[];let yAixData=[];
        let g2Data = [];
        let termWeekList=this.termWeekList;let weekList=this.weekList;

        //for(let i=0;i<termWeekList.length;i++){
        //    xAixData.push(termWeekList[i].name);
        //}
        xAixData=this._fetchXAixData();
        yAixData=this._fetchYAixData();

        {/*加入虚假的测试数据*/}
        for(let i=0;i<xAixData.length;i++){
            for(let j=0;j<yAixData.length;j++){
                let newItem={
                    termWeek:xAixData[i],
                    weekLesson:yAixData[j],
                    teacher:"李清秀",
                    courseName:"计算机网络原理",
                    isBusy:true
                }
                g2Data.push(newItem);
            }
        }
        return fromJS(g2Data);
    }
    _fetchXAixData(){
        let xAixData=[];
        let termWeekList=this.termWeekList;
        for(let i=0;i<termWeekList.length;i++){
            xAixData.push(termWeekList[i].name);
        }
        return xAixData;
    }
    _fetchYAixData(){
        let yAixData=[];
        let weekList=this.weekList;let lessonList=this.lessonList;

        for(let i=0;i<weekList.length;i++){
            for(let j=0;j<lessonList.length;j++){
                yAixData.push(weekList[i].name+":"+lessonList[j].name);
            }
        }
        yAixData=yAixData.reverse();
        return yAixData;
    }
}
let classRoomLessonData=new ClassRoomLessonData();
export default classRoomLessonData;