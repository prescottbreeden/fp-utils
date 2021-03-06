export declare type Func = (...args: any) => any;
export interface Mappable {
    map: Func;
}
export interface Reducable {
    reduce: Func;
}
export declare type ReduceFunction = (prev: any, curr: any) => any;
export interface Filterable {
    filter: Func;
}
