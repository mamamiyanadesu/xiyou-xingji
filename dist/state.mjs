import {stories,places} from './data.js';
export const blankState=()=>({version:1,read:{},notes:{},visits:[],trip:[],positions:{}});
const storyIds=new Set(stories.map(s=>s.id)),placeIds=new Set(places.map(p=>p.id));
export function validateBackup(v){
 if(!v||typeof v!=='object'||v.version!==1||!Array.isArray(v.trip)||!Array.isArray(v.visits))throw Error('不是有效的西游行记备份。');
 const out=blankState();
 for(const [id,val] of Object.entries(v.read||{})){if(!storyIds.has(id)||typeof val!=='boolean')throw Error('阅读记录格式不正确。');out.read[id]=val;}
 for(const [id,val] of Object.entries(v.notes||{})){if(!storyIds.has(id)||typeof val!=='string'||val.length>3000)throw Error('心得格式不正确或超过 3000 字。');out.notes[id]=val;}
 if(v.trip.length>5||new Set(v.trip.map(x=>x.id)).size!==v.trip.length)throw Error('行程最多 5 站且不可重复。');
 out.trip=v.trip.map(x=>{if(!placeIds.has(x.id)||!Number.isInteger(x.minutes)||x.minutes<10||x.minutes>480||typeof x.must!=='boolean')throw Error('行程数据格式不正确。');return {id:x.id,minutes:x.minutes,must:x.must}});
 const regions=new Set(out.trip.map(x=>places.find(p=>p.id===x.id).region));if(regions.size>1)throw Error('此版本仅支持同一区域短途行程。');
 if(v.visits.length>1000)throw Error('到访记录过多。');
 out.visits=v.visits.map(x=>{if(!placeIds.has(x.id)||!['manual','location'].includes(x.method)||!Number.isFinite(Date.parse(x.date)))throw Error('到访记录格式不正确。');return {id:x.id,method:x.method,date:x.date}});
 for(const [key,val] of Object.entries(v.positions||{})){if(!['13','54','65'].includes(key)||!Number.isFinite(val)||val<0||val>1000000)throw Error('阅读位置格式不正确。');out.positions[key]=val;}
 return out;
}
export function summarize(trip,legs){const visit=trip.reduce((n,x)=>n+x.minutes,0);if(legs===null)return {visit,total:null,travel:null};const travel=Math.ceil(legs.reduce((n,x)=>n+x.seconds,0)/60);return {visit,travel,total:visit+travel};}
export function removableStops(trip){return trip.filter(x=>!x.must);}
