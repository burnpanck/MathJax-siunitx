#!/usr/bin/python
from __future__ import division,print_function

import os
import subprocess
import sys
import io

template = r"""\documentclass{standalone}

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

def compile_snippet(base,snip,force=False):
    src = template%snip
    fn = '%08x'%myhash(snip)
    print('Compiling file "%s" from "%s"'%(fn,snip))
    fn = os.path.join(
        base,
        fn
    )
    if os.path.exists(fn+'.svg') and not force:
        return
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
        return
    subprocess.check_call([
        'pdftocairo',
        '-svg',
        fn+'.pdf',fn+'.svg'
    ])        


def compile_testfile(fn):
    src = os.path.abspath(fn)
    basedir = os.path.join(
        os.path.dirname(fn),
        'latex-output'
    )
    if not os.path.exists(basedir):
        os.mkdir(basedir)
    with open(fn) as fh:
        for line in fh:
            line = line.split('%',1)[0].strip()
            if not line:
                continue
            compile_snippet(basedir,line)
        
if __name__ == '__main__':
    for fn in sys.argv[1:]:
        compile_testfile(fn)

