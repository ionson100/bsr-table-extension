import React, {ReactElement, useRef} from 'react';

import './App.css';
import {Column, Table, DataRow, ColumnGroup, HeaderGroup} from "./table";
import {GetDataRowList} from "./fider";

import './index.css'



const listData: Array<DataRow> = [];



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
            <button onClick={() => {
                GetDataRowList(5, listData)
                refTable.current!.Refresh()
            }}>
                add5
            </button>
            <div style={{display: "flex", justifyContent: "center"}}>
                <Table
                    style={{width:"70%"}}
                    styleBody={{ background: "rgba(253,251,226,0.94)"}}
                    styleHeader={{background: "rgba(3,38,108,0.94)",color:"white"}}
                    useRowSelection={true}
                    id={'assa-123'}
                    className={'scroll'}
                    caption={'test: 345'}
                    ref={refTable}
                    rowItems={GetDataRowList(5, listData)}>

                    <Column style={{width: 50}} propertyName={'button'}>33</Column>
                    <Column propertyName={'firstName'}>firstName</Column>
                    <Column propertyName={'lastName'}>lastName</Column>
                    <Column propertyName={'age'}>age</Column>
                    <Column style={{width: "50%"}}  propertyName={'profession'}>profession</Column>
                </Table>

            </div>


        </div>
    );
}

export default App;
