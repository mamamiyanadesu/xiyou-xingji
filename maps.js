let sdkPromise;const resolved=new Map();
export function mapKey(){try{return sessionStorage.getItem('xiyou-baidu-ak')||window.XIYOU_CONFIG?.baiduAk||''}catch{return window.XIYOU_CONFIG?.baiduAk||''}}
export function sdk(){
 if(window.BMap?.Map)return Promise.resolve(window.BMap);
 if(sdkPromise)return sdkPromise;
 const key=mapKey();if(!key)return Promise.reject(Error('地图尚未配置。阅读、收藏与手动记录仍可使用。'));
 sdkPromise=new Promise((resolve,reject)=>{let done=false;const s=document.createElement('script');const fail=()=>{if(done)return;done=true;s.remove();sdkPromise=null;reject(Error('地图暂时无法加载，请检查网络和地图服务配置后重试。'))};const timer=setTimeout(fail,12000);window.xiyouMapReady=()=>{if(done)return;done=true;clearTimeout(timer);if(window.BMap?.Map)resolve(window.BMap);else{sdkPromise=null;reject(Error('地图接口未能初始化。'))}};s.src='https://api.map.baidu.com/api?v=4.0&ak='+encodeURIComponent(key)+'&callback=xiyouMapReady';s.onerror=fail;document.head.appendChild(s)});return sdkPromise;
}
export async function searchPlace(place){
 const B=await sdk();return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('地点查询超时，请重试。')),10000);const search=new B.LocalSearch(place.region,{onSearchComplete:r=>{clearTimeout(timer);if(search.getStatus()!==0||!r?.getCurrentNumPois())return reject(Error('未找到匹配地点，请在百度地图核实地点名称。'));const found=[];for(let i=0;i<Math.min(r.getCurrentNumPois(),5);i++){const x=r.getPoi(i);if(x.point)found.push({name:x.title,address:x.address,point:x.point})}resolve(found)}});search.search(place.query||place.name)})
}
export function rememberPlace(id,candidate){resolved.set(id,candidate)}
export function confirmedPlace(id){return resolved.get(id)}
export async function resolvePlace(place){if(resolved.has(place.id))return resolved.get(place.id);const candidates=await searchPlace(place);const exact=candidates.filter(c=>c.name===place.name);if(exact.length===1){resolved.set(place.id,exact[0]);return exact[0]}throw Error('请先在现实地图中确认“'+place.name+'”的具体地点，再规划路线。')}
export async function routeLeg(a,b,mode='walking',map=null){const B=await sdk();return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('路线查询超时，请稍后重试。')),12000);const C=mode==='driving'?B.DrivingRoute:B.WalkingRoute;const route=new C(a.point,{...(map?{renderOptions:{map,autoViewport:true}}:{}),onSearchComplete:r=>{clearTimeout(timer);if(route.getStatus()!==0||!r?.getNumPlans())return reject(Error('未找到可用路线，请更换出行方式或地点。'));const p=r.getPlan(0);resolve({seconds:p.getDuration(false),meters:p.getDistance(false),from:a.name,to:b.name})}});route.search(a.point,b.point)})}
export async function planTrip(items,places,mode){const points=[];for(const i of items){const p=places.find(x=>x.id===i.id);points.push(await resolvePlace(p))}const legs=[];for(let i=1;i<points.length;i++)legs.push(await routeLeg(points[i-1],points[i],mode));return legs;}
export async function locate(){const B=await sdk();return new Promise((resolve,reject)=>{const g=new B.Geolocation();const timer=setTimeout(()=>reject(Error('定位超时。可重试或选择手动记录。')),12000);g.getCurrentPosition(function(r){clearTimeout(timer);if(this.getStatus()!==0||!r?.point)return reject(Error('未能获取位置。请允许定位，或使用手动记录。'));if(!Number.isFinite(r.accuracy)||r.accuracy>100)return reject(Error('定位精度不足，无法辅助确认到访。可以重试或手动记录。'));resolve(r)},{enableHighAccuracy:true,timeout:10000,maximumAge:0})})}
export function externalSearch(place){return 'https://api.map.baidu.com/place/search?'+new URLSearchParams({query:place.name,region:place.region,output:'html',src:'webapp.xiyouxingji'})}
