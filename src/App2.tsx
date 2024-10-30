import React, {useEffect, useLayoutEffect, useRef} from 'react';

import {Column, Table, DataRow, HeaderGroup, RowFooter, CellFooter} from "./table";
import {tab} from "@testing-library/user-event/dist/tab";

type User = {
    name: string,
    email: string,
    age: any
}
const listUser: User[] = [];
const listDataRow: DataRow[] = [];

(function fetch() {
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
})()


export default function App2() {
    const refTable = useRef<Table>(null)
    useLayoutEffect(() => {
        refTable.current!.SetItemsRow(listDataRow)
    }, [])
    return (
        <Table ref={refTable} height={700} useRowSelection>
            <Column style={{fontSize: 18, fontWeight: 800}} propertyName={'name'}>name</Column>
            <Column style={{fontSize: 18, fontWeight: 800}} propertyName={'email'}>email</Column>
            <Column style={{fontSize: 18, fontWeight: 800, width: 100}} propertyName={'age'}>age</Column>
            <RowFooter>
                <CellFooter style={{fontSize: 18, fontWeight: 600}}
                            colspan={2}>Total:</CellFooter>
                <CellFooter style={{
                    fontSize: 18,
                    fontWeight: 600,
                    textAlign: "right"
                }}>{() => {
                    return refTable.current?.GetItemsRow()?.length
                }}</CellFooter>
            </RowFooter>
        </Table>
    )
}

export class App3 extends React.Component<any, any> {
    private refTable = React.createRef<Table>()

    getCount() {
        setTimeout(() => {

        })
        return this.refTable.current?.GetItemsRow().length
    }

    filter() {


        const r = listDataRow.filter((value) => {
            return value.tag && (value.tag as User).age > 30
        })
        listDataRow.length = 0;
        listDataRow.push(...r)
        this.refTable.current?.Refresh()
    }

    render() {
        // @ts-ignore
        return (
            <>
                <button onClick={() => {
                    this.filter()


                }}>dsd
                </button>
                <Table ref={this.refTable} height={700} useRowSelection rowItems={listDataRow}>
                    <Column style={{fontSize: 18, fontWeight: 800}} propertyName={'name'}>name</Column>
                    <Column style={{fontSize: 18, fontWeight: 800}} propertyName={'email'}>email</Column>
                    <Column style={{fontSize: 18, fontWeight: 800, width: 100}} propertyName={'age'}>age</Column>
                    <RowFooter>
                        <CellFooter style={{fontSize: 18, fontWeight: 600}}
                                    colspan={2}>Total:</CellFooter>
                        <CellFooter style={{
                            fontSize: 18,
                            fontWeight: 600,
                            textAlign: "right"
                        }}>{() => {
                            return listDataRow.length
                        }}</CellFooter>
                    </RowFooter>
                </Table>
            </>

        )
    }
}