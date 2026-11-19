# Builds site/drop-four/play/index.html from the Drop Four sources in this folder.
# The same sources make the standalone Drop Four artifact; the site copy only adds
# the site favicon and a small link back to fantasyapp.io in the lobby.
import os
d=os.path.dirname(os.path.abspath(__file__));r=lambda f:open(os.path.join(d,f),encoding='utf8').read()
h=r('shell.html').replace('/*JS*/',r('data.js')+r('engine.js')+r('ui.js'))
def rep(a,b):
    global h
    assert h.count(a)==1,a;h=h.replace(a,b)
rep('<title>Drop Four</title>','<title>Drop Four · fantasyapp.io</title><meta name="description" content="Four in a row with power discs, six worlds and a CPU ladder. Free in your browser."><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">')
rep('<div class="hero">\n','<div class="hero">\n    <a class="qt home" href="/drop-four/">fantasyapp.io</a>\n')
rep('[hidden]{display:none!important}','[hidden]{display:none!important}\n.qt.home{display:inline-flex;width:auto;text-decoration:none;margin-bottom:6px}')
out=os.path.join(d,'..','site','drop-four','play','index.html');os.makedirs(os.path.dirname(out),exist_ok=True)
open(out,'w',encoding='utf8').write(h);print('wrote',out,len(h))
