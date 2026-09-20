export function navigationUrl(a,b,mode){
 const point=p=>`${p.point.lat},${p.point.lng}`;
 return 'https://api.map.baidu.com/direction?'+new URLSearchParams({origin:`latlng:${point(a)}|name:${a.name}`,destination:`latlng:${point(b)}|name:${b.name}`,mode,coord_type:'bd09ll',output:'html',src:'webapp.xiyouxingji'});
}
