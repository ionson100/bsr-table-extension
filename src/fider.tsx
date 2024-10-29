import {DataRow} from "./table";
import {TiEdit} from "react-icons/ti";
import {BaseBodyDialog, ShowBsrDialog} from "bsr-modaldialog";
import 'bsr-modaldialog/dist/index.css'
import React from "react";
import {FaReact} from "react-icons/fa";
import {v4 as key} from 'uuid';

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    profession: string;

}
type EdotProperty = {
    user: User
}

class Edit extends BaseBodyDialog<EdotProperty> {
    private refNameFirst = React.createRef<HTMLInputElement>()
    private refNameLast = React.createRef<HTMLInputElement>()
    private refAge = React.createRef<HTMLInputElement>()
    private refProfession = React.createRef<HTMLInputElement>()

    validate(mode: string | undefined): boolean | undefined {
        if (mode === '1') {
            this.props.user.age = parseInt(this.refAge.current!.value)
            this.props.user.firstName = this.refNameFirst.current!.value
            this.props.user.lastName = this.refNameLast.current!.value
            this.props.user.profession = this.refProfession.current!.value
            this.selfClose('200')
        }
        return true
    }

    getData(mode: string | undefined) {
        return {
            id: this.props.user.id ? this.props.user.id : undefined
        }
    }

    componentDidMount() {
        this.refNameFirst.current?.select()
        this.refNameFirst.current?.focus()
    }

    render() {
        return (
            <div id={'d-34'} style={{padding: 20}}>

                <div >First Name:</div>
                <input ref={this.refNameFirst} type={"text"} defaultValue={this.props.user.firstName}/>

                <div style={{paddingTop: 10}}>Last Name:</div>
                <input ref={this.refNameLast} type={"text"} defaultValue={this.props.user.lastName}/>

                <div style={{paddingTop: 10}}>Age:</div>
                <input ref={this.refAge} type={"number"} defaultValue={this.props.user.age}/>

                <div style={{paddingTop: 10}}>Profession:</div>
                <input ref={this.refProfession} type={"text"} defaultValue={this.props.user.profession}/>
            </div>


        )
    }

}

const listUser: Array<User> = []
let listDataRows: Array<DataRow>

export function GetDataRowList(n: number, list: Array<DataRow>, callback?: (id: string) => void) {
    list.length = 0;
    listUser.length=0

    for (let i = 0; i < n; i++) {
        listUser.push({
            id: key(),
            profession: 'programmer',
            age: i * 10,
            lastName: 'user last' + i,
            firstName: 'user first' + i
        })
    }
    listUser.forEach(user => {
        list.push(GetDataRow(user, callback))
    })
    listDataRows = list
    return list
}

function GetDataRow(user: User, callback?: (id: string) => void): DataRow {
    const data = new DataRow()

    data.id = user.id
    data.tag = user;
    // data.onClick= (dataRow, target) => {
    //     console.log(dataRow)
    //     console.log(target)
    // }
    data.getView = () => {
        return {
            button: <div onClick={(e) => {
                e.stopPropagation()
                ShowBsrDialog({
                    position: "top",
                    icon: <FaReact/>,
                    header: (<span style={{paddingLeft: 10}}>Edit </span>),
                    body: <Edit user={user}/>,
                    buttons: [<button data-mode={1}>save</button>, <button data-mode={-1}>close</button>]
                }).then(a => {

                    if (a.mode === '200') {

                        if (callback) callback(a.dataBody.id)
                    }
                })
            }}><TiEdit color={"rgba(1,47,156,0.94)"} size={20}/></div>,


            firstName: user.firstName,
            lastName: data.tag.lastName,
            age: data.tag.age,
            profession: data.tag.profession

        }
    }
    return data
}

