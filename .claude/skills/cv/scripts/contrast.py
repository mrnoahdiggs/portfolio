"""Print the WCAG contrast ratio of each CV text colour on white and on the cream side panel.

Usage: python3 .claude/skills/cv/scripts/contrast.py [cv/file.html] [#hex ...]
With no colours it checks those defined in the file's :root block (default cv/index.html).
Body-size text needs >= 4.5:1; this CV holds every text colour to >= 6:1 for print.
"""
import re, sys
from pathlib import Path

def lum(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= .03928 else ((x + .055) / 1.055) ** 2.4 for x in c]
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]

def ratio(a, b):
    hi, lo = sorted([lum(a), lum(b)], reverse=True)
    return (hi + .05) / (lo + .05)

root = Path(__file__).resolve().parents[4]
args = sys.argv[1:]
html = next((a for a in args if a.endswith('.html')), 'cv/index.html')
args = [a for a in args if a != html]
css = (root / html).read_text()
tokens = dict(re.findall(r'--([\w-]+):\s*(#[0-9A-Fa-f]{6})', css.split('</style>')[0]))
side = tokens.get('side', '#FBF6EF')
colours = {c: c for c in args} or {k: v for k, v in tokens.items() if k not in ('side', 'rule')}
for name, hexv in colours.items():
    on_side = ratio(hexv, side)
    flag = '' if on_side >= 6 else '   <-- below 6:1, use for decoration only' if on_side < 4.5 else '   <-- ok for large text only'
    print(f'{name:12s} {hexv}  white {ratio(hexv, "#FFFFFF"):5.2f}  panel {on_side:5.2f}{flag}')
