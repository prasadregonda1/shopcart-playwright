import { APIRequestContext, expect } from '@playwright/test';
export type Product={id:string;name:string;category:string;price:number;stock:number};
export type Cart={items:Array<Product & {quantity:number;lineTotal:number}>;itemCount:number;subtotal:number;shipping:number;total:number};
export const customer={name:'Demo Customer',email:'demo@example.com',address:'123 Demo Street, Hyderabad'};
export class ShopApi{
 constructor(readonly request:APIRequestContext,readonly workspace:string){}
 async products():Promise<Product[]>{const r=await this.request.get('/api/products');expect(r.status()).toBe(200);return(await r.json()).products;}
 async cart():Promise<Cart>{const r=await this.request.get('/api/cart');expect(r.status()).toBe(200);return r.json();}
 async setQuantity(productId:string,quantity:number):Promise<Cart>{const r=await this.request.post('/api/cart',{data:{productId,quantity}});expect(r.status()).toBe(200);return r.json();}
 async orders(){const r=await this.request.get('/api/orders');expect(r.status()).toBe(200);return(await r.json()).orders;}
 async cleanup(){expect((await this.request.delete('/api/session')).status()).toBe(200);}
}
