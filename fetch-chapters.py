from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import quote
from bs4 import BeautifulSoup
import json, hashlib, sys
base=Path(__file__).parent/'dist'/'chapters'
for chapter in (13,54,65):
 url='https://zh.wikisource.org/wiki/'+quote('西遊記/第%03d回'%chapter)
 raw=Path('/tmp/xiyou-'+str(chapter)+'.html').read_bytes() if '--cached' in sys.argv else urlopen(Request(url,headers={'User-Agent':'XiyouXingjiPrototype/0.1 (public-domain literature study)'}),timeout=35).read()
 Path('/tmp/xiyou-'+str(chapter)+'.html').write_bytes(raw)
 soup=BeautifulSoup(raw,'html.parser');main=soup.select_one('.mw-parser-output')
 if not main:raise RuntimeError('missing content')
 for el in main.select('table,style,script,.noprint,.mw-editsection,.catlinks,.licenseContainer,.navbox'):el.decompose()
 paragraphs=[]
 for el in main.find_all(['p','dd','dt','div','pre'],recursive=True):
  if el.name=='div' and 'poem' not in el.get('class',[]):continue
  if el.name=='p' and el.find_parent(class_='poem'):continue
  txt=el.get_text('\n' if el.name=='div' else '',strip=True)
  if txt:paragraphs.append(txt)
 if sum(map(len,paragraphs))<1500:raise RuntimeError('short content')
 revision=soup.find('link',rel='canonical')
 item={'version':1,'chapter':chapter,'source':url,'retrievedAt':'2026-09-20','transcription':'维基文库《西遊記》转录文本；保留繁体字形。','sha256':hashlib.sha256(raw).hexdigest(),'paragraphs':paragraphs}
 (base/f'{chapter}.json').write_text(json.dumps(item,ensure_ascii=False,indent=2))
 print(chapter,len(paragraphs),sum(map(len,paragraphs)))
