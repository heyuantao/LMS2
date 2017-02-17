/**
 * Created by hyt on 2017/1/23.
 */
class UserData {
    constructor(){

    }
    isLogin(str){
        if(this.isAdministrator(str)||this.isTeacher(str)){
            return true;
        }else{
            return false;
        }
    }
    isGuest(str){
        if(str==="Guest"){
            return true;
        }else{
            return false;
        }
    }
    isAdministrator(str){
        if(str==="Administrator"){
            return true;
        }else{
            return false;
        }
    }
    isTeacher(str){
        if(str==="Teacher"){
            return true;
        }else{
            return false;
        }
    }
    isAssistant(str){
        if(str==="Assistant"){
            return true;
        }else{
            return false;
        }
    }
}
let userData=new UserData();
export default userData;