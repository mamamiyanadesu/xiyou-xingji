import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const code=fs.readFileSync(new URL('../dist/source-return.js',import.meta.url),'utf8');
test('sources return preserves story and view without allowing external redirects',()=>{
 for(const [saved,expected] of [['#story=nvguo&view=map','index.html#story=nvguo&view=map'],['https://example.com','index.html'],['#story=unknown&view=map','index.html']]){
 const link={href:'index.html'};vm.runInNewContext(code,{document:{querySelector:()=>link},sessionStorage:{getItem:()=>saved}});assert.equal(link.href,expected);
 }
});
test('sources return still works with storage blocked',()=>{
 const link={href:'index.html'};vm.runInNewContext(code,{document:{querySelector:()=>link},sessionStorage:{getItem(){throw Error('blocked')}}});assert.equal(link.href,'index.html');
});
