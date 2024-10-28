import React, {ReactElement, useRef} from 'react';

import {Column, Table, DataRow, ColumnGroup, HeaderGroup} from "./table";
import {GetDataRowList} from "./fider";

import './index.css'

type User = {
    id: string,
    name: string,
    age: string
    profession: string
}
// @ts-ignore

const users: Array<User> = []
for (let i = 0; i < 10; i++) {
    users.push({
        age: `V:${i}`,
        name: `name:${i}`,
        id: `${i}`,
        profession: "programmer"
    })
}

function getItem() {
    const list: Array<DataRow>= [];
    users.forEach(a => {
        list.push({
            getView: ():User => {
                return a
            }
        })
    })
    return list
}

export default function AppSimple() {
    return (
        <Table rowItems={getItem()}
                     onClickRow={(e,r)=>{

                     }}
               styleBody={{background: "rgba(209,203,121,0.94)"}}
               styleHeader={{background: "rgba(3,38,108,0.94)", color: "white"}}
        >
            <Column style={{width:50}} propertyName={'id'}>id</Column>
            <Column propertyName={'name'}>Name</Column>
            <Column propertyName={'age'}>Age</Column>
            <Column propertyName={'profession'}>Profession</Column>
        </Table>
    )
}