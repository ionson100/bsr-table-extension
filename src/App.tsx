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
            <button onClick={() => {

                refTable.current!.height=600
            }}>
                height
            </button>
            <div style={{display: "flex", justifyContent: "center", height: "90%"}}>
                <Table
                    //height={700}
                    style={{width: "70%"}}
                    styleBody={{background: "rgba(209,203,121,0.94)"}}
                    styleHeader={{background: "rgba(3,38,108,0.94)", color: "white"}}
                    useRowSelection={true}
                    id={'assa-123'}
                    className={'scroll'}
                    //caption={'test: 345'}
                    ref={refTable}
                    rowItems={GetDataRowList(5, listData,(id) => {
                        refTable.current!.Refresh(()=>{
                            refTable.current!.SelectRowsById(id)
                        })


                    })}>

                        <Column style={{width: 30}} propertyName={'button'}></Column>


                    <HeaderGroup title={'asas'}>
                        <Column style={{width:200}} propertyName={'firstName'}>firstName</Column>
                        <Column style={{width:200}} propertyName={'lastName'}>lastName</Column>
                    </HeaderGroup>


                    <Column propertyName={'age'}>age</Column>
                    <Column  propertyName={'profession'}>profession</Column>
                </Table>

            </div>


        </div>
    );
}

export default App;
