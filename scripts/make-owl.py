"""Extract only G17 from the installed Fontsource font; keep its OFL licence."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
import shutil

root = Path(__file__).resolve().parents[1]
font_dir = root / 'node_modules/@fontsource/noto-sans-egyptian-hieroglyphs'
font = TTFont(font_dir / 'files/noto-sans-egyptian-hieroglyphs-egyptian-hieroglyphs-400-normal.woff')
glyphs = font.getGlyphSet()
glyph = glyphs[font.getBestCmap()[0x13153]]
bounds = BoundsPen(glyphs)
glyph.draw(bounds)
x0, y0, x1, y1 = bounds.bounds
scale = 28 / max(x1 - x0, y1 - y0)
pen = SVGPathPen(glyphs)
glyph.draw(TransformPen(pen, (scale, 0, 0, -scale, 16 - (x0 + x1) * scale / 2, 16 + (y0 + y1) * scale / 2)))
path = pen.getCommands()
svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img"><title>Owl (Egyptian hieroglyph G17)</title>{}<path fill="#a00000" d="' + path + '"/></svg>\n'
(root / 'public/owl.svg').write_text(svg.format(''), encoding='utf-8')
# Add a small outline to preserve the fine glyph at 16 and 32 px.
icon = svg.format('<rect width="32" height="32" rx="4" fill="#faf8f1"/>').replace('<path fill=', '<path stroke="#a00000" stroke-width="0.65" stroke-linejoin="round" fill=')
(root / 'public/favicon.svg').write_text(icon, encoding='utf-8')
component = '''---
interface Props { size?: number; class?: string; }
const { size = 20, class: className } = Astro.props;
---
<svg class={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size} role="img" aria-label="Owl (Egyptian hieroglyph G17)">
  <title>Owl (Egyptian hieroglyph G17)</title>
  <path fill="currentColor" d="''' + path + '''" />
</svg>
'''
(root / 'src/components/Owl.astro').write_text(component, encoding='utf-8')
licences = root / 'public/fonts'
licences.mkdir(exist_ok=True)
for name in ['unifrakturcook', 'noto-sans-egyptian-hieroglyphs']:
    shutil.copyfile(root / f'node_modules/@fontsource/{name}/LICENSE', licences / f'{name}-LICENSE.txt')
print('Extracted U+13153 to SVG paths. Kept both OFL licences.')
