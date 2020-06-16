import create from 'zustand'
import produce from 'immer'

//table store
//tables: array of table objects
//add table object to tables array
//id: unique table id
//x,y: position
//width, length: table dimensions
//chair: depth of chair that is added as offset from table
//offset: offset to other tables
//count: amount of tables of this specific object
export const [useTableStore] = create(set => ({
    tables: [],
    add: (table) => set(state => ({tables: [...state.tables, {
        id: state.tables.length+1,
        x: table.x,
        y: table.y,
        width: table.width,
        length: table.length,
        chair: table.chair,
        offset: table.offset,
        count: 1}
        ]})),
    //increase amount of tables from object with id by one
    plus: (id) => set(state => ({tables: state.tables.map(table => {
            if(table.id !== id){
                return table;
            }            
            table.count+=1;
            return table;
        })
    })),
    //decrease amount of tables from object with id by one or delete object if 0
    minus: (id) => set(state => ({tables: state.tables.map(table => {
        if(table.id !== id){
            return table;
        }
        if(table.count > 0){
            table.count-=1;
        }
        return table;
    }).filter((table) => table.count !== 0) //if empty, remove
    })),
    set: fn => set(produce(fn)),
}))





