export function navigationUrl(a,b,mode,region){
 const point=p=>`${p.point.lat},${p.point.lng}`;
 const q={origin:`latlng:${point(a)}|name:${a.name}`,destination:`latlng:${point(b)}|name:${b.name}`,mode,coord_type:'bd09ll',output:'html',src:'webapp.xiyouxingji'};
 // region 必填：缺失时百度不会进入路线页，只会跳到地图首页。
 if(region)q.region=region;
 return 'https://api.map.baidu.com/direction?'+new URLSearchParams(q);
}
