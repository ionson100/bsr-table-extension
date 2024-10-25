import React, {ReactElement, useRef} from 'react';

import './App.css';
import {Column, Table, DataRow, ColumnGroup, HeaderGroup} from "./table";
import {GetDataRowList} from "./fider";

//import './table/index.css'


type assa = {
    id: string
    id2: any
    name: string
    sd: ReactElement
}
const listData: Array<DataRow> = [];

function getData(n: number) {

    listData.length = 0;
    for (let i = 0; i < n; i++) {

        const df = {
            name: 'asas',
            name2: 'sdsd'
        }
        const data = new DataRow<assa>()
        data.tag = df;
        const item: assa = {
            id: '76',
            id2: () => {
                return "ajhshjhhs"
            },
            name: "name:" + i,
            sd: <div className={'test'}>index:{i}</div>
        }
        data.id = "assa" + i
        data.onClick = (dataRow, row) => {
        }
        data.item = item
        listData.push(data)
    }
    return listData
}


function App() {
    const p=0
    const refTable = useRef<Table>(null)
    return (
        <div>
            <button onClick={() => {
                GetDataRowList(100, listData)
                refTable.current!.Refresh()
            }}>
                add
            </button>
            <button onClick={() => {
                GetDataRowList(15, listData)
                refTable.current!.Refresh()
            }}>
                add
            </button>
            <div style={{display:"flex",justifyContent:"center"}}>
                <Table
                    style={{width: "fit-content",background:"rgba(253,251,226,0.94)"}}
                    useRowSelection={true}
                    id={'assa-123'}
                    className={'scroll'}
                    //caption={'test: 345'}
                    ref={refTable}
                    rowItems={GetDataRowList(10, listData)}>

                    <Column style={{width: "20px",padding:p}} propertyName={'button'}></Column>
                    <Column style={{width: 400,padding:p}} propertyName={'firstName'}>firstName</Column>
                    <Column style={{width: 400,padding:p}} propertyName={'lastName'}>lastName</Column>
                    <Column style={{width: 30,padding:p}} propertyName={'age'}>age</Column>
                    <Column style={{width: 200,padding:p}} propertyName={'profession'}>profession</Column>
                </Table>

            </div>



        </div>
    );
}

export default App;
