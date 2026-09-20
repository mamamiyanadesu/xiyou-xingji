const returnLink=document.querySelector('a[href="index.html"]');
try {
 const saved=sessionStorage.getItem('xiyou-return-location');
 if(returnLink&&saved&&/^#story=(changan|nvguo|leiyin)&view=(story|map|trip|journal)$/.test(saved))returnLink.href='index.html'+saved;
} catch {}
