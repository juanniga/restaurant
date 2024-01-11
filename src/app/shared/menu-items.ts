import { Injectable } from "@angular/core";

export interface Menu_options{
    state:string;
    name:string;
    icon:string;
    role:string;
}
const MENU_ITEMS=[
    {state:'dashboard',name:'Dashboard',icon:'dashboard',role:''},
    {state:'menu',name:'Administrar Menu',icon:'restaurant',role:''},
    {state:'sales',name:'Administrar Ventas',icon:'store',role:''},
    {state:'order',name:'Administrar Ordenes',icon:'shopping_basket',role:''},
    {state:'deliveries',name:'Administrar entregas',icon:'room_service',role:''},
    {state:'profile',name:'Administrar Perfil',icon:'settings',role:''},
   
]
@Injectable()
export class MenuItems{
    getMenuItems():Menu_options[]{
        return MENU_ITEMS;
    }
}
