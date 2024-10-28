import React, {ReactElement, useRef} from 'react';

import {Column, Table, DataRow, ColumnGroup, HeaderGroup} from "./table";
import {GetDataRowList} from "./fider";
import { ImCamera } from "react-icons/im";

import './index.css'


const listData: Array<DataRow> = [];


function App() {
    const p = 0
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

                refTable.current!.height = 600
            }}>
                height
            </button>
            <div style={{display: "flex", justifyContent: "center", height: "90%"}}>
                <Table
                    onClickColumn={(a,b,c)=>{
                        console.log(a);console.log(b)
                    }}
                    // onClickRow={(a,b)=>{
                    //     console.log(a);console.log(b)
                    // }}
                    onClickCell={(a,b)=>{
                        console.log(a);console.log(b)
                    }}
                    //height={700}
                    style={{width: "70%"}}
                    //styleBody={{background: "rgba(209,203,121,0.94)"}}
                    //styleHeader={{background: "rgba(3,38,108,0.94)", color: "white"}}
                    useRowSelection={true}
                    id={'assa-123'}
                    className={'scroll'}
                    //caption={'test: 345'}
                    ref={refTable}
                    rowItems={GetDataRowList(1, listData, (id) => {
                        refTable.current!.Refresh(() => {
                            refTable.current!.SelectRowsById(id)
                        })


                    })}>
                    <HeaderGroup style={{background:"#d9d6d6",width:30}}  >
                        <Column  style={{width: 30}} propertyName={'button'}></Column>
                    </HeaderGroup>


                    <HeaderGroup style={{ width:401,paddingLeft:45,background:"#d9d6d6",fontSize:10,color:"black"}} title={'FIO'}>
                        <Column style={{width: '200px'}} propertyName={'firstName'}><div style={{display:"flex"}}><ImCamera color={"rgba(6,76,252,0.94)"}/><div style={{marginLeft:5}}>firest name</div></div></Column>
                        <Column style={{width: "200px"}} propertyName={'lastName'}>lastName</Column>
                    </HeaderGroup>

                    {/*<HeaderGroup style={{background:"#d9d6d6"}} >*/}
                        <ColumnGroup style={{background:'rgba(239,232,155,0.94)'}}>
                            <Column propertyName={'age'}>age</Column>
                            <Column propertyName={'profession'}>profession</Column>
                        </ColumnGroup>
                    {/*</HeaderGroup>*/}

                </Table>

            </div>


        </div>
    );
}

export default App;
