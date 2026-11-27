# Builds site/broadside/play/index.html from bssrc/broadside.html.
# broadside.html is the same file as the standalone Broadside artifact; the site copy
# only adds the site favicon, a description and a link back to the landing page.
import os
d=os.path.dirname(os.path.abspath(__file__))
h=open(os.path.join(d,'broadside.html'),encoding='utf8').read()
def rep(a,b):
    global h
    assert h.count(a)==1,a;h=h.replace(a,b)
rep('<title>Broadside</title>','<title>Broadside · fantasyapp.io</title><meta name="description" content="Battleship with eight twist modes, special weapons, four worlds and three CPU captains. Free in your browser."><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">')
rep('<div class="chips"><button class="chip" data-a="help">','<div class="chips"><a class="chip" style="text-decoration:none;color:inherit;display:inline-flex;align-items:center" href="/broadside/">fantasyapp.io</a><button class="chip" data-a="help">')
out=os.path.join(d,'..','site','broadside','play','index.html');os.makedirs(os.path.dirname(out),exist_ok=True)
open(out,'w',encoding='utf8').write(h);print('wrote',out,len(h))
