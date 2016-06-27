#!/usr/bin/python
from __future__ import division,print_function

import os
import subprocess
import sys
import io
import threading
import webbrowser
import tempfile
import shutil
from wsgiref.simple_server import make_server

#import bs4

FILE = 'interactive-test.html'
PORT = 8080

template = r"""\documentclass[varwidth]{standalone}

\usepackage{xcolor}
\usepackage{siunitx}

\begin{document}
%s
\end{document}
"""

def myhash(src):
    ret = 0
    for c in src:
        ret =( ((ret << 5) - ret) + ord(c)) & 0xffffffff
    return ret

def compile_snippet(base,snip,fn=None,force=False):
    src = template%snip
    if fn is None:
        fn = '%08x'%myhash(snip)
    print('Compiling file "%s" from "%s"'%(fn,snip))
    fn = os.path.join(
        base,
        fn
    )
    if os.path.exists(fn+'.svg') and not force:
        return fn
    with open(fn+'.tex','w') as fh:
        fh.write(src)   
    try:
        output = subprocess.check_output(
            ['pdflatex',
            '-interaction','nonstopmode',
            '-output-directory',os.path.dirname(fn),
            fn],
            timeout=5,
        )
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as ex:
        print('Command output: ',ex.output.decode('utf-8'))
        return None
    subprocess.check_call([
        'pdftocairo',
        '-svg',
        fn+'.pdf',fn+'.svg'
    ])        
    return fn

def test_app(environ, start_response):
    if environ['REQUEST_METHOD'] == 'POST':
        try:
            request_body_size = int(environ['CONTENT_LENGTH'])
            request_body = environ['wsgi.input'].read(request_body_size)
        except (TypeError, ValueError):
            raise
        try:
            base = tempfile.mkdtemp()
            outp = compile_snippet(base,request_body.decode('ascii'))
            with open(outp+'.svg','rb') as fh:
                response_body = fh.read()
        except:
            raise
        finally:
            shutil.rmtree(base)
        status = '200 OK'
        headers = [('Content-type', 'image/svg+xml')]
        start_response(status, headers)
        return [response_body]
    else:
        with open(FILE,'rb') as fh:
            response_body = fh.read()
        status = '200 OK'
        headers = [('Content-type', 'text/html'),
                   ('Content-Length', str(len(response_body)))]
        start_response(status, headers)
        return [response_body]

def open_browser():
    """Start a browser after waiting for half a second."""
    def _open_browser():
        webbrowser.open('http://localhost:%s/%s' % (PORT, FILE))
    thread = threading.Timer(0.5, _open_browser)
    thread.start()

def start_server():
    """Start the server."""
    httpd = make_server("", PORT, test_app)
    httpd.serve_forever()

if __name__ == "__main__":
    open_browser()
    start_server()
