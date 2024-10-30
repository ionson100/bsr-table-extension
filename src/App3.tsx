import React, {useEffect, useId, useLayoutEffect, useRef, useState} from 'react';

import {Column, Table, DataRow, HeaderGroup, RowFooter, CellFooter} from "./table";
import {tab} from "@testing-library/user-event/dist/tab";
type sd<T =any,V =any>={
    tag?:T
    sd:()=>T
}
const sdd:sd<User,User>={
    sd:():User => {
        return{
            age:1,
            email:'as',
            name:'asas'
        }
    }
}

type User = {
    name: string,
    email: string,
    age: any
}
type User2 = {
    name2: string,
    email2: string,

}
const listUser: User[] = [];
const listUser2: User2[] = [];
const listDataRow: DataRow[] = [];
const listDataRow2: DataRow[] = [];

    function fetch() {
        listUser.length = 0
        for (let i = 0; i < 100; i++) {
            listUser.push({
                name: 'name:' + i,
                email: "ion100@gmail.com",
                age: i
            })
        }
        listDataRow.length = 0
        listUser.forEach(u => {
            listDataRow.push({
                tag: u,
                getView: (): User => {
                    return {
                        age: () => {
                            return u.age
                        },
                        email: u.email,
                        name: u.name
                    }
                }
            })
        })
    }



function fetch2() {
    listUser2.length = 0
    for (let i = 0; i < 100; i++) {
        listUser2.push({
            name2: 'name2:' + i,
            email2: "ion100@gmail.com2",

        })
    }
    listDataRow2.length = 0
    listUser2.forEach(u => {
        listDataRow2.push({
            tag: u,
            getView: (): User2 => {
                return {

                    email2: u.email2,
                    name2: u.name2
                }
            }
        })
    })
}

export function App33() {
    fetch2();
    fetch()
    const [state, setState] = useState(3)
    const state1 = () => {
        return (
            <Table rowItems={listDataRow} height={undefined}>
                <Column style={{fontSize: 18, fontWeight: 800}} propertyName={'name'}>name</Column>
                <Column style={{fontSize: 18, fontWeight: 800}} propertyName={'email'}>email</Column>
                <Column style={{fontSize: 18, fontWeight: 800, width: 100}} propertyName={'age'}>age</Column>
            </Table>
        )
    }
    const state2 = () => {
        return (
            <Table rowItems={listDataRow2} height={500}>
                <Column style={{fontSize: 18, fontWeight: 800}} propertyName={'name2'}>name</Column>
                <Column style={{fontSize: 18, fontWeight: 800}} propertyName={'email2'}>email</Column>

            </Table>
        )
    }

    return (
        <>
            <button onClick={()=>{
                fetch2()
                setState(2)
            }}>2</button>
            <button onClick={()=>{
                fetch()
                setState(1)
            }}>1</button>
            <div>
                <label htmlFor="some-id">Some input</label>

                <input name="some-input" id="some-id" />
            </div>
            <Table style={{width:"50%"}} caption={'table1'} rowItems={listDataRow} height={200}>
                <Column style={{fontSize: 18, fontWeight: 800}} propertyName={'name'}>name</Column>
                <Column style={{fontSize: 18, fontWeight: 800}} propertyName={'email'}>email</Column>
                <Column style={{fontSize: 18, fontWeight: 800, width: 100}} propertyName={'age'}>age</Column>
            </Table>
            <br/>

            <Table style={{width:"50%"}} caption={'table2'} rowItems={listDataRow2} height={300} >
                <Column style={{fontSize: 18, fontWeight: 800}} propertyName={'name2'}>name</Column>
                <Column style={{fontSize: 18, fontWeight: 800}} propertyName={'email2'}>email</Column>

            </Table>
        </>


    )


}