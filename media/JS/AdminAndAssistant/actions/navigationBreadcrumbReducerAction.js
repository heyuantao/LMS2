/**
 * Created by hyt on 2017/1/16.
 */
export function changeHashLocationAction(newHashLocationList){
    return {
        type:"ChangeHashLocation",
        playload:newHashLocationList
    }
}