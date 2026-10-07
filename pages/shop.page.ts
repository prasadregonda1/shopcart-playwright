import {Page,expect} from '@playwright/test';
import {customer} from '../support/shop-api';
export class ShopPage{
 constructor(readonly page:Page,readonly workspace:string){}
 async open(){await this.page.goto(`/?workspace=${this.workspace}`);await expect(this.page.getByTestId('product')).toHaveCount(4);}
 product(id:string){return this.page.locator(`[data-testid="product"][data-id="${id}"]`);}
 item(id:string){return this.page.locator(`[data-testid="cart-item"][data-id="${id}"]`);}
 async add(id:string){await this.product(id).getByRole('button').click();await expect(this.item(id)).toBeVisible();}
 async checkout(data=customer){await this.page.getByLabel('Full name',{exact:true}).fill(data.name);await this.page.getByLabel('Email address').fill(data.email);await this.page.getByLabel('Delivery address').fill(data.address);await this.page.getByRole('button',{name:'Place demo order'}).click();}
 async quantity(id:string,value:number){const input=this.item(id).getByRole('spinbutton');await input.fill(String(value));await input.press('Tab');}
}
