import {DataRow} from "./table";
import { TiEdit } from "react-icons/ti";

export type User={
    firstName:string;
    lastName:string;
    age:number;
    profession:string;

}
export function GetDataRowList(n:number, list:Array<DataRow>){
    list.length=0;
    const listUser:Array<User>=[]
    for (let i = 0; i <n; i++) {
        listUser.push({
            profession:'programmer',
            age:i*10,
            lastName:'user last'+i,
            firstName:'user first'+i
        })
    }
    listUser.forEach(user=>{
        list.push(GetDataRow(user))
    })
    return list
}
function GetDataRow(user:User):DataRow{
    const data= new DataRow()
    data.style={background:"green"}
    data.tag=user;
    data.item= {
        button: <div style={{color: "red"}}>{user.age}</div>,
        firstName: data.tag.firstName,
        lastName: data.tag.lastName,
        age: 11,
        profession: data.tag.profession

    }
    return data
}
