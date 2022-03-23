import { Tag } from "./tag";

export interface Note{
title:string;
content:string;
createDate?:string;
tags?:Tag[];
id?:number;
}
