import {test} from 'node:test';
import assert from 'node:assert/strict';
import {navigationUrl} from '../dist/navigation.mjs';
test('navigation uses confirmed coordinates, correct axis order and encoded names',()=>{
 const a={name:'测试 & 起点',point:{lat:34.1,lng:108.2}},b={name:'测试终点',point:{lat:34.3,lng:108.4}};
 const u=new URL(navigationUrl(a,b,'walking','西安市'));
 assert.equal(u.origin,'https://api.map.baidu.com');assert.equal(u.searchParams.get('origin'),'latlng:34.1,108.2|name:测试 & 起点');assert.equal(u.searchParams.get('destination'),'latlng:34.3,108.4|name:测试终点');assert.equal(u.searchParams.get('coord_type'),'bd09ll');assert.equal(u.searchParams.get('mode'),'walking');assert.equal(u.searchParams.has('ak'),false);
});
test('navigation carries region, without which Baidu falls back to the map home page',()=>{
 const a={name:'起点',point:{lat:34.1,lng:108.2}},b={name:'终点',point:{lat:34.3,lng:108.4}};
 assert.equal(new URL(navigationUrl(a,b,'walking','西安市')).searchParams.get('region'),'西安市');
 assert.equal(new URL(navigationUrl(a,b,'driving','丽江市')).searchParams.get('region'),'丽江市');
 assert.equal(new URL(navigationUrl(a,b,'walking')).searchParams.has('region'),false);
});
