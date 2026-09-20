export function requestGuard(current){
 const initial=current();
 return ()=>current()===initial;
}
