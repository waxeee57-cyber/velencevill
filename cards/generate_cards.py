# -*- coding: utf-8 -*-
"""
Velence Vill - GSJJ-kompatibilis nevjegykartya generator
4 kep: VIP elolap/hatlap + Sima (Mike Patrik) elolap/hatlap
2240 x 1340 px @ 600 DPI (3.5x2 inch + 3mm bleed)
"""
import os, math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import qrcode
from qrcode.constants import ERROR_CORRECT_H

random.seed(42)  # determinisztikus etchingek

# ---------- MERETEK ----------
W, H = 2240, 1340          # teljes meret bleeddel @ 600 DPI
BLEED = 70                 # 3mm bleed -> trim vonal
SAFE = 140                 # safe zone (bleed + safety)
RADIUS = 76                # kerekitett sarok a trim vonalon
TRIM = (BLEED, BLEED, W - BLEED, H - BLEED)
SAFE_BOX = (SAFE, SAFE, W - SAFE, H - SAFE)

# ---------- SZINEK ----------
BG_DARK   = (6, 13, 24)      # #060d18
NAVY_MID  = (20, 33, 56)     # belso navy
SILVER    = (120, 140, 168)  # ezustos fem
SILVER_HI = (170, 188, 210)
TEAL      = (0, 255, 239)     # #00FFEF accent
TEAL_DIM  = (0, 150, 142)
WHITE     = (245, 240, 232)   # #F5F0E8 warm white
FAINT     = (120, 140, 160)
MAGENTA   = (255, 0, 255)     # CutContour
PANEL_LT  = (238, 242, 245)   # vilagos QR panel
QR_DARK   = (8, 18, 30)       # sotet QR modul (max kontraszt)

# ---------- FONTOK ----------
FONT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                        "..", "..", "..", "Users", "waxee", ".claude",
                        "skills", "canvas-design", "canvas-fonts")
FONT_DIR = os.path.abspath(FONT_DIR)
BOLD = os.path.join(FONT_DIR, "Outfit-Bold.ttf")
REG  = os.path.join(FONT_DIR, "Outfit-Regular.ttf")
assert os.path.exists(BOLD), f"Nincs font: {BOLD}"

_fc = {}
def font(path, size):
    k = (path, size)
    if k not in _fc:
        _fc[k] = ImageFont.truetype(path, size)
    return _fc[k]

OUT = os.path.dirname(os.path.abspath(__file__))

# ---------- SEGEDEK ----------
def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))

def h_gradient(w, h, c_left, c_right, ease=True):
    """Vizszintes gradient (brushed metal alap)."""
    row = Image.new("RGB", (w, 1))
    px = row.load()
    for x in range(w):
        t = x / (w - 1)
        if ease:
            t = t * t * (3 - 2 * t)  # smoothstep
        px[x, 0] = lerp(c_left, c_right, t)
    return row.resize((w, h))

def brushed(img, strength=10):
    """Finom vizszintes fem-csiszolas + diagonalis fenycsik."""
    w, h = img.size
    ov = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(ov)
    for y in range(0, h):
        v = random.randint(-strength, strength)
        if v != 0:
            d.line([(0, y), (w, y)], fill=128 + v * 6)
    ov = ov.filter(ImageFilter.GaussianBlur(0.4))
    base = img.convert("RGB")
    # brushed overlay mint soft-light kozelites
    noise = Image.merge("RGB", (ov, ov, ov))
    return Image.blend(base, ImageChopsScreen(base, noise), 0.10)

def ImageChopsScreen(a, b):
    from PIL import ImageChops
    return ImageChops.screen(a, b)

def metal_bg(c_left, c_right, sheen=True, brush=True, vignette=True):
    img = h_gradient(W, H, c_left, c_right)
    if brush:
        img = brushed(img, strength=9)
    if sheen:
        # lagy diagonalis femfeny
        gl = Image.new("L", (W, H), 0)
        gd = ImageDraw.Draw(gl)
        gd.ellipse([W * 0.45, -H * 0.5, W * 1.25, H * 1.1], fill=70)
        gl = gl.filter(ImageFilter.GaussianBlur(220))
        white = Image.new("RGB", (W, H), SILVER_HI)
        img = Image.composite(
            Image.blend(img, white, 0.18), img, gl)
    if vignette:
        vg = Image.new("L", (W, H), 0)
        vd = ImageDraw.Draw(vg)
        vd.rectangle([0, 0, W, H], fill=255)
        vd.rounded_rectangle([90, 90, W - 90, H - 90], radius=200, fill=0)
        vg = vg.filter(ImageFilter.GaussianBlur(160))
        dark = Image.new("RGB", (W, H), (2, 6, 12))
        img = Image.composite(dark, img, vg)
    return img.convert("RGBA")

def tracked_text(draw, xy, text, fnt, fill, tracking=0, anchor_lm=False, center_x=None):
    """Betukoz (letter-spacing). xy = bal felso (vagy lm ha anchor_lm)."""
    x, y = xy
    widths = [draw.textlength(ch, font=fnt) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    if center_x is not None:
        x = center_x - total / 2
    asc, desc = fnt.getmetrics()
    yy = y - (asc + desc) / 2 if anchor_lm else y
    for ch, cw in zip(text, widths):
        draw.text((x, yy), ch, font=fnt, fill=fill)
        x += cw + tracking
    return total

def lightning_points(cx, cy, w, h):
    """Villam polygon pontok adott kozeppont/meret korul."""
    P = [
        (0.58, 0.00), (0.16, 0.52), (0.43, 0.52),
        (0.22, 1.00), (0.86, 0.40), (0.56, 0.40), (0.80, 0.00),
    ]
    pts = [(cx + (px - 0.5) * w, cy + (py - 0.5) * h) for px, py in P]
    return pts

def draw_bolt_outline(base, pts, stroke=7, glow=True, color=TEAL,
                      fill=None, glow_radius=26, glow_op=150):
    """Villam korvonal teal glow-val, belso ures/sotet (die-cut hatas)."""
    if glow:
        gl = Image.new("RGBA", base.size, (0, 0, 0, 0))
        gd = ImageDraw.Draw(gl)
        gd.line(pts + [pts[0]], fill=color + (glow_op,),
                width=stroke + 10, joint="curve")
        gl = gl.filter(ImageFilter.GaussianBlur(glow_radius))
        base.alpha_composite(gl)
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    if fill is not None:
        ld.polygon(pts, fill=fill)
    ld.line(pts + [pts[0]], fill=color + (255,), width=stroke, joint="curve")
    base.alpha_composite(layer)

def dashed_polyline(draw, pts, color, width, dash=22, gap=16):
    """Szaggatott vonal pontsorozaton (CutContour)."""
    closed = pts + [pts[0]]
    for i in range(len(closed) - 1):
        x0, y0 = closed[i]; x1, y1 = closed[i + 1]
        seg = math.hypot(x1 - x0, y1 - y0)
        if seg == 0: continue
        ux, uy = (x1 - x0) / seg, (y1 - y0) / seg
        d = 0
        while d < seg:
            a = d; b = min(d + dash, seg)
            draw.line([(x0 + ux * a, y0 + uy * a),
                       (x0 + ux * b, y0 + uy * b)], fill=color, width=width)
            d += dash + gap

def offset_bolt(pts, cx, cy, scale=1.10):
    return [(cx + (x - cx) * scale, cy + (y - cy) * scale) for x, y in pts]

def teal_frame(base, inset=BLEED, radius=RADIUS, width=4, color=TEAL, op=210):
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle([inset, inset, W - inset, H - inset],
                        radius=radius, outline=color + (op,), width=width)
    base.alpha_composite(layer)

def corner_L(base, color=TEAL, op=220, length=66, off=170, width=5):
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    c = color + (op,)
    corners = [(off, off, 1, 1), (W - off, off, -1, 1),
               (off, H - off, 1, -1), (W - off, H - off, -1, -1)]
    for x, y, sx, sy in corners:
        d.line([(x, y), (x + sx * length, y)], fill=c, width=width)
        d.line([(x, y), (x, y + sy * length)], fill=c, width=width)
    base.alpha_composite(layer)

def lightning_logo(base, cx, cy, r, ring=5, color=TEAL):
    """Villam kor logo (teal korvonal)."""
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color + (235,), width=ring)
    base.alpha_composite(layer)
    pts = lightning_points(cx, cy, r * 1.05, r * 1.55)
    draw_bolt_outline(base, pts, stroke=5, glow=True, color=color,
                      glow_radius=12, glow_op=120)

def scatter_etchings(base, n=14, color=TEAL, op=22):
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    for _ in range(n):
        x = random.randint(SAFE, W - SAFE)
        y = random.randint(SAFE, H - SAFE)
        s = random.randint(30, 70)
        pts = lightning_points(x, y, s * 0.7, s)
        d = ImageDraw.Draw(layer)
        d.line(pts + [pts[0]], fill=color + (op,), width=2, joint="curve")
    layer = layer.filter(ImageFilter.GaussianBlur(0.5))
    base.alpha_composite(layer)

def make_qr(data, box=12, border=2):
    qr = qrcode.QRCode(version=None, error_correction=ERROR_CORRECT_H,
                       box_size=box, border=border)
    qr.add_data(data); qr.make(fit=True)
    img = qr.make_image(fill_color=QR_DARK, back_color=PANEL_LT).convert("RGBA")
    return img

def place_qr(base, data, cx, cy, target=470, frame=TEAL):
    qr = make_qr(data)
    qr = qr.resize((target, target), Image.NEAREST)
    pad = 34
    panel_w = target + pad * 2
    px0 = int(cx - panel_w / 2); py0 = int(cy - panel_w / 2)
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    # halvany glow a panel mogott
    gl = Image.new("RGBA", base.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(gl)
    gd.rounded_rectangle([px0 - 6, py0 - 6, px0 + panel_w + 6, py0 + panel_w + 6],
                         radius=34, fill=frame + (60,))
    gl = gl.filter(ImageFilter.GaussianBlur(22))
    base.alpha_composite(gl)
    d.rounded_rectangle([px0, py0, px0 + panel_w, py0 + panel_w],
                        radius=28, fill=PANEL_LT + (255,))
    d.rounded_rectangle([px0, py0, px0 + panel_w, py0 + panel_w],
                        radius=28, outline=frame + (235,), width=5)
    base.alpha_composite(layer)
    base.alpha_composite(qr, (int(cx - target / 2), int(cy - target / 2)))
    return py0 + panel_w  # alja

# =====================================================================
# 1. VIP ELOLAP
# =====================================================================
def vip_front():
    img = metal_bg(BG_DARK, (58, 78, 104))
    scatter_etchings(img, n=12)

    # nagy villam jobb oldalon (die-cut)
    bcx, bcy = 1640, 670
    bw, bh = 760, 1040
    pts = lightning_points(bcx, bcy, bw, bh)
    # belso sotet (kivagas hatas)
    fill_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(fill_layer).polygon(pts, fill=(3, 7, 13, 235))
    img.alpha_composite(fill_layer)
    # magenta CutContour (kicsit kintebb)
    cut = ImageDraw.Draw(img, "RGBA")
    dashed_polyline(cut, offset_bolt(pts, bcx, bcy, 1.08), MAGENTA + (200,),
                    width=3, dash=24, gap=18)
    # teal korvonal + glow
    draw_bolt_outline(img, pts, stroke=8, glow=True, color=TEAL,
                      glow_radius=30, glow_op=160)

    d = ImageDraw.Draw(img, "RGBA")

    # VIP felirat + ket oldali teal vonal
    vip_y = 250
    f_vip = font(BOLD, 86)
    vip_w = d.textlength("VIP", font=f_vip)
    vx = SAFE + 6
    d.text((vx, vip_y), "VIP", font=f_vip, fill=TEAL + (255,))
    ly = vip_y + 48
    d.line([(vx + vip_w + 26, ly), (vx + vip_w + 180, ly)], fill=TEAL + (170,), width=3)

    # VELENCE / VILL / Kft.
    f_big = font(BOLD, 150)
    d.text((SAFE, 360), "VELENCE", font=f_big, fill=WHITE + (255,))
    d.text((SAFE, 510), "VILL", font=f_big, fill=TEAL + (255,))
    f_kft = font(REG, 52)
    d.text((SAFE + 6, 690), "Kft.", font=f_kft, fill=FAINT + (200,))

    # szlogen alul
    f_slo = font(REG, 40)
    tracked_text(d, (SAFE + 4, 1070), "ÖN AZ ÉN KIEMELT PARTNEREM",
                 f_slo, FAINT + (210,), tracking=8)

    teal_frame(img)
    return img

# =====================================================================
# 2. VIP HATLAP
# =====================================================================
def vip_back():
    img = metal_bg((8, 16, 28), (30, 44, 64), sheen=True)

    d = ImageDraw.Draw(img, "RGBA")

    # bal oldal: VIP badge + logo + cegnev
    lx = 250
    # VIP badge (lekerekitett kis kartya)
    bx0, by0 = SAFE + 10, 300
    f_badge = font(BOLD, 64)
    bw = d.textlength("VIP", font=f_badge)
    d.rounded_rectangle([bx0, by0, bx0 + bw + 70, by0 + 100],
                        radius=20, outline=TEAL + (235,), width=4)
    d.text((bx0 + 35, by0 + 14), "VIP", font=f_badge, fill=TEAL + (255,))

    lightning_logo(img, bx0 + (bw + 70) / 2, 560, 78)

    f_cn1 = font(BOLD, 58)
    f_cn2 = font(REG, 40)
    d2 = ImageDraw.Draw(img, "RGBA")
    d2.text((bx0, 690), "VELENCE VILL", font=f_cn1, fill=WHITE + (255,))
    d2.text((bx0 + 4, 758), "Kft.", font=f_cn2, fill=FAINT + (210,))

    # jobb oldal: QR
    qcx, qcy = 1620, 600
    bottom = place_qr(img, "https://velencevill.com/vip", qcx, qcy, target=470)
    d3 = ImageDraw.Draw(img, "RGBA")
    f_url = font(BOLD, 46)
    tw = d3.textlength("velencevill.com/vip", font=f_url)
    d3.text((qcx - tw / 2, bottom + 26), "velencevill.com/vip",
            font=f_url, fill=TEAL + (255,))

    # alul kozepen szlogen
    f_b = font(REG, 36)
    tracked_text(d3, (0, H - 175), "SZEMÉLYRE SZABOTT BELÉPŐ",
                 f_b, FAINT + (200,), tracking=10, center_x=W / 2)

    corner_L(img)
    teal_frame(img)
    return img

# =====================================================================
# 3. SIMA ELOLAP (Mike Patrik)
# =====================================================================
def sima_front():
    img = metal_bg(BG_DARK, (46, 62, 86))

    d = ImageDraw.Draw(img, "RGBA")

    # bal fent VELENCE / VILL
    f_logo = font(BOLD, 104)
    d.text((SAFE, 200), "VELENCE", font=f_logo, fill=WHITE + (255,))
    d.text((SAFE, 305), "VILL", font=f_logo, fill=TEAL + (255,))

    # jobb fent villam kor + kft.
    lightning_logo(img, W - SAFE - 110, 280, 92)
    d4 = ImageDraw.Draw(img, "RGBA")
    f_kft = font(REG, 40)
    kw = d4.textlength("kft.", font=f_kft)
    d4.text((W - SAFE - 110 - kw / 2, 400), "kft.", font=f_kft, fill=FAINT + (210,))

    # teal elvalaszto kozepen
    d4.line([(SAFE, 540), (W - SAFE, 540)], fill=TEAL + (150,), width=3)

    # MIKE PATRIK (nincs Ugyvezeto felirat)
    f_name = font(BOLD, 92)
    d4.text((SAFE, 600), "MIKE PATRIK", font=f_name, fill=WHITE + (255,))

    # kontakt blokk 2 oszlop, teal fuggoleges elvalaszto
    col_x = W / 2 + 30
    cy0 = 800
    d4.line([(col_x, cy0), (col_x, H - SAFE - 20)], fill=TEAL + (140,), width=2)

    f_c = font(REG, 42)
    f_cb = font(BOLD, 42)
    # bal oszlop
    lx = SAFE + 6
    d4.text((lx, cy0), "+36 30 618 2165", font=f_cb, fill=WHITE + (255,))
    d4.text((lx, cy0 + 78), "velencevillkft@gmail.com", font=f_c, fill=WHITE + (235,))
    d4.text((lx, cy0 + 156), "velencevill.com", font=f_cb, fill=TEAL + (255,))
    # jobb oszlop
    rx = col_x + 50
    d4.text((rx, cy0), "Fecske utca 12., 2481 Velence", font=f_c, fill=WHITE + (235,))
    d4.text((rx, cy0 + 78), "H–P: 8:00–16:00", font=f_c, fill=WHITE + (235,))
    d4.text((rx, cy0 + 156), "Szo: 8:00–12:00", font=f_c, fill=WHITE + (235,))

    teal_frame(img)
    return img

# =====================================================================
# 4. SIMA HATLAP
# =====================================================================
def sima_back():
    img = metal_bg((8, 16, 28), (34, 48, 70))

    d = ImageDraw.Draw(img, "RGBA")

    # bal fent: Nyitvatartas
    f_h = font(BOLD, 40)
    f_t = font(REG, 38)
    lx = SAFE + 6
    d.text((lx, 200), "NYITVATARTÁS", font=f_h, fill=TEAL + (255,))
    d.text((lx, 264), "H–P: 8:00–16:00", font=f_t, fill=WHITE + (235,))
    d.text((lx, 318), "Szo: 8:00–12:00", font=f_t, fill=WHITE + (235,))
    d.text((lx, 372), "Vas: Zárva", font=f_t, fill=FAINT + (220,))

    # jobb fent: Cim + telefonok
    rx = W - SAFE - 470
    d.text((rx, 200), "ELÉRHETŐSÉG", font=f_h, fill=TEAL + (255,))
    d.text((rx, 264), "Fecske utca 12., 2481 Velence", font=f_t, fill=WHITE + (235,))
    d.text((rx, 318), "+36 30 618 2165", font=f_t, fill=WHITE + (235,))
    d.text((rx, 372), "+36 30 618 2166", font=f_t, fill=WHITE + (235,))

    # kozepen QR
    qcx, qcy = W / 2, 720
    bottom = place_qr(img, "https://velencevill.com", qcx, qcy, target=430)
    d5 = ImageDraw.Draw(img, "RGBA")
    f_url = font(BOLD, 46)
    tw = d5.textlength("velencevill.com", font=f_url)
    d5.text((qcx - tw / 2, bottom + 22), "velencevill.com",
            font=f_url, fill=TEAL + (255,))
    f_s = font(REG, 34)
    tracked_text(d5, (0, bottom + 88), "SZKENNELJ A WEBOLDALHOZ",
                 f_s, FAINT + (210,), tracking=8, center_x=W / 2)

    # alul cegnev
    f_cn = font(BOLD, 40)
    cnw = d5.textlength("VELENCE VILL Kft.", font=f_cn)
    # alul nem kell, mar zsufolt -> kihagyva a duplikacio elkerulesere
    corner_L(img)
    teal_frame(img)
    return img

# ---------- GENERALAS ----------
def save(img, name):
    p = os.path.join(OUT, name)
    img.convert("RGB").save(p, "PNG", dpi=(600, 600))
    sz = os.path.getsize(p) / 1024 / 1024
    print(f"  {name:28s} {img.size[0]}x{img.size[1]}  {sz:.2f} MB")

print("Generalas...")
cards = [
    (vip_front(),  "vip_elolap_gsjj.png"),
    (vip_back(),   "vip_hatlap_gsjj.png"),
    (sima_front(), "sima_elolap_gsjj.png"),
    (sima_back(),  "sima_hatlap_gsjj.png"),
]
for im, nm in cards:
    save(im, nm)

# kontakt lap (mind a 4 egymas mellett)
contact = Image.new("RGB", (W + 80, H * 2 + 120), (12, 18, 28))
sc = 0.5
small = (int(W * sc), int(H * sc))
positions = [(40, 40), (40 + small[0] + 40, 40),
             (40, 40 + small[1] + 40), (40 + small[0] + 40, 40 + small[1] + 40)]
# atmeretezzuk a kontakt lapot a 2x2 racshoz
contact = Image.new("RGB", (small[0] * 2 + 120, small[1] * 2 + 120), (12, 18, 28))
positions = [(40, 40), (small[0] + 80, 40),
             (40, small[1] + 80), (small[0] + 80, small[1] + 80)]
for (im, nm), pos in zip(cards, positions):
    contact.paste(im.convert("RGB").resize(small), pos)
cp = os.path.join(OUT, "kontakt_lap.png")
contact.save(cp, "PNG")
print(f"  kontakt_lap.png             {contact.size[0]}x{contact.size[1]}")
print("KESZ.")
