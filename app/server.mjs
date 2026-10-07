import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
const products=[{id:'bag',name:'Everyday Backpack',category:'Bags',price:249900,stock:5},{id:'headphones',name:'Wireless Headphones',category:'Electronics',price:399900,stock:4},{id:'bottle',name:'Steel Water Bottle',category:'Accessories',price:79900,stock:10},{id:'watch',name:'Classic Watch',category:'Accessories',price:199900,stock:0}];
const sessions=new Map();
const staticFiles={'/':['index.html','text/html'],'/app.js':['app.js','text/javascript'],'/styles.css':['styles.css','text/css']};
function send(res,status,data){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
async function body(req){let text='';for await(const c of req){text+=c;if(text.length>10000)throw Error('Payload too large');}const data=JSON.parse(text||'{}');if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Object body required');return data;}
function cart(s){const items=[...s.cart].map(([id,quantity])=>{const p=products.find(p=>p.id===id);return {...p,quantity,lineTotal:p.price*quantity};});const subtotal=items.reduce((sum,i)=>sum+i.lineTotal,0);const shipping=subtotal===0||subtotal>=500000?0:9900;return {items,itemCount:items.reduce((sum,i)=>sum+i.quantity,0),subtotal,shipping,total:subtotal+shipping};}
http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://127.0.0.1');const path=url.pathname;
 if(path==='/health')return send(res,200,{status:'ok'});
 if(req.method==='GET'&&staticFiles[path]){const [file,type]=staticFiles[path];res.writeHead(200,{'Content-Type':type});return res.end(await readFile(new URL(file,import.meta.url)));}
 if(path==='/api/products'&&req.method==='GET')return send(res,200,{products});
 if(!path.startsWith('/api/'))return send(res,404,{error:'Not found'});
 const key=req.headers['x-workspace'];if(typeof key!=='string'||!/^[a-zA-Z0-9-]{1,80}$/.test(key))return send(res,400,{error:'Valid workspace required'});
 if(!sessions.has(key))sessions.set(key,{cart:new Map(),orders:[]});const s=sessions.get(key);
 if(path==='/api/session'&&req.method==='DELETE'){sessions.delete(key);return send(res,200,{deleted:true});}
 if(path==='/api/cart'&&req.method==='GET')return send(res,200,cart(s));
 if(path==='/api/cart'&&req.method==='POST'){
  const d=await body(req);const p=products.find(p=>p.id===d.productId);if(!p)return send(res,404,{error:'Product not found'});
  if(!Number.isInteger(d.quantity)||d.quantity<0)return send(res,422,{error:'Quantity must be a non-negative integer'});
  if(d.quantity>p.stock)return send(res,409,{error:'Requested quantity exceeds stock'});
  if(d.quantity===0)s.cart.delete(p.id);else s.cart.set(p.id,d.quantity);return send(res,200,cart(s));
 }
 if(path==='/api/orders'&&req.method==='GET')return send(res,200,{orders:s.orders});
 if(path==='/api/orders'&&req.method==='POST'){
  const d=await body(req);const c=cart(s);if(!c.items.length)return send(res,409,{error:'Your cart is empty'});
  if(typeof d.name!=='string'||!d.name.trim()||d.name.length>80)return send(res,422,{error:'Enter your full name'});
  if(typeof d.email!=='string'||!/^\S+@\S+\.\S+$/.test(d.email)||d.email.length>120)return send(res,422,{error:'Enter a valid email address'});
  if(typeof d.address!=='string'||d.address.trim().length<10||d.address.length>200)return send(res,422,{error:'Enter an address with at least 10 characters'});
  const order={id:randomUUID(),...c,customer:{name:d.name.trim(),email:d.email,address:d.address.trim()},payment:'Demo only – no payment collected'};
  s.orders.push(order);s.cart.clear();return send(res,201,order);
 }
 return send(res,404,{error:'Not found'});
}catch(e){return send(res,400,{error:e.message});}}).listen(4183,'127.0.0.1',()=>console.log('ShopCart: http://127.0.0.1:4183'));
