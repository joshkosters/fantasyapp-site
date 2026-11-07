import re,hashlib,os,sys
src=open('/root/.claude/projects/-home-claude/850679df-f7df-54a4-b2f6-762b4f6f60b6/tool-results/artifact-7b08e41d-1793852731-66f4.html',encoding='utf8').read()
out=sys.argv[1]; os.makedirs(out+'/img',exist_ok=True)
import base64
ext={'jpeg':'jpg','jpg':'jpg','webp':'webp','png':'png','svg+xml':'svg','gif':'gif'}
seen={}
def rep(m):
    t,d=m.group(1),m.group(2)
    b=base64.b64decode(d)
    h=hashlib.sha1(b).hexdigest()[:10]
    fn=h+'.'+ext.get(t,'bin')
    if fn not in seen:
        open(out+'/img/'+fn,'wb').write(b); seen[fn]=len(b)
    return 'img/'+fn
src2=re.sub(r'data:image/([a-z+]+);base64,([A-Za-z0-9+/=]+)',rep,src)
print('files',len(seen),'bytes',sum(seen.values()),'html',len(src2))
# logo
m=re.search(r'<svg class="logo".*?</svg>',src2,re.S)
print('logo',len(m.group(0)))
logo=m.group(0)
open(out+'/logo_inline.html','w').write(logo.replace('img/','app/img/'))
# persistence off
a="function save(){try{localStorage.setItem(KEY,JSON.stringify(G))}catch(e){}}"
b="function load(){try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.order&&s.order.length&&s.phase){Object.assign(G,s);return true}}catch(e){}return false}"
assert src2.count(a)==1 and src2.count(b)==1
src2=src2.replace(a,"function save(){}").replace(b,"function load(){return false}")
# boot
boot="if(!load()){newSeason()}else{refresh()}\ntab=G.phase==='draft'?'draft':'team';render();"
assert src2.count(boot)==1
BOOT=open('/tmp/ccb/boot.js').read()
src2=src2.replace(boot,BOOT)
t='const toast=m=>{const t=$(\'toast\');'
assert src2.count(t)==1
src2=src2.replace(t,'const toast=m=>{try{parent.postMessage({cc:3,m},\'*\')}catch(e){}const t=$(\'toast\');')
css=open('/tmp/ccb/embed.css').read()
assert src2.count('</style>')>=1
i=src2.rindex('</style>')
src2=src2[:i]+css+src2[i:]
# seed PRNG right after <script> start
s0="<script>\nconst TIERS="
assert src2.count(s0)==1
src2=src2.replace(s0,"<script>\n(function(){let s=20261107;Math.random=function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}})();\nconst TIERS=")
open(out+'/index.html','w',encoding='utf8').write(src2)
