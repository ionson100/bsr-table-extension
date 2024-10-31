# bsr-table-extension

> React component table

[![NPM](https://img.shields.io/npm/v/bsr-table-extension.svg)](https://www.npmjs.com/package/bsr-table-extension) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save bsr-table-extension
```

## Usage

```tsx
import React from 'react';
import {Column, Table, DataRow} from "./table";
import './index.css'

type User = {
    id: string,
    name: string,
    age: string
    profession: string
}

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
    users.forEach(user => {
        list.push({
            tag:user,
            getView: ():User => {
                return user
            }
        })
    })
    return list
}

export default function App() {
    return (
        <Table rowItems={getItem()}>
            <Column style={{width:50}} propertyName={'id'}>id</Column>
            <Column propertyName={'name'}>Name</Column>
            <Column propertyName={'age'}>Age</Column>
            <Column propertyName={'profession'}>Profession</Column>
        </Table>
    )
}
```

## License

MIT © [ionson100](https://github.com/ionson100)



[Examples, Help pages](https://ionson100.github.io/wwwroot/index.html#page=15-2).
