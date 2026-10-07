import {test as base,expect} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {ShopApi} from '../support/shop-api';
import {ShopPage} from '../pages/shop.page';
export const test=base.extend<{workspace:string;api:ShopApi;shop:ShopPage}>({
 workspace:async({},use)=>{await use(randomUUID());},
 api:async({playwright,baseURL,workspace},use)=>{const request=await playwright.request.newContext({baseURL,extraHTTPHeaders:{'X-Workspace':workspace}});const api=new ShopApi(request,workspace);try{await use(api);}finally{await api.cleanup();await request.dispose();}},
 shop:async({page,api},use)=>{await use(new ShopPage(page,api.workspace));}
});export{expect};
