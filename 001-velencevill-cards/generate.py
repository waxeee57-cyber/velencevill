# -*- coding: utf-8 -*-
"""
Velence Vill Kft. - nevjegykartya generator (tiszta PIL, semmi AI kepgeneras)

Kimenet (4 lap):
  simple_front.png - logo-oldal: VELENCE VILL Kft. kozepen, mogotte
                     dombornyomott villam a lap mertani kozeppontjaban
  simple_back.png  - adatoldal: nev, telefon, email, weboldal, cim, QR - kozepre
  vip_front.png    - VIP elolap
  vip_back.png     - VIP hatlap
Meret:   2240 x 1340 px  (3.5 x 2 inch @ 600 DPI + 3 mm bleed), PNG 300 DPI meta

MERETSKALA
A briefben megadott px-ertekek (42px nev, 28px telefon, ...) egy ~800px szeles
kepernyo-referenciara vonatkoznak. 600 DPI nyomdai vasznon ezek olvashatatlanul
aprok lennenek (20px = 0.85 pt), ezert egysegesen S = 2.8-cal skalazva vannak:
a brief aranyai megmaradnak, a legkisebb szoveg is ~6.7 pt lesz.
"""
import os
import math
import random

from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageFilter
import qrcode
from qrcode.constants import ERROR_CORRECT_H, ERROR_CORRECT_M

random.seed(7)  # determinisztikus hatterelemek

# ---------------------------------------------------------------- MERETEK
W, H = 2240, 1340
BLEED = 70                    # 3 mm bleed @ 600 DPI -> trim vonal
SAFE = 188                    # safe zone = trim + 5 mm (print-designer szabvany)
S = 2.8                       # brief-px -> vaszon-px skala

# Nyomdai minimum betumeret nevjegyen: 8 pt = 67 px @ 600 DPI
MIN_PT_PX = 67


def px(v):
    """Brief-beli px -> vaszon px."""
    return int(round(v * S))


# ---------------------------------------------------------------- SZINEK
BG = (6, 13, 24)              # #060d18
TEAL = (0, 255, 239)          # #00FFEF
WHITE = (255, 255, 255)       # #FFFFFF
GREY = (136, 153, 170)        # #8899aa
SILVER_LO = (26, 42, 58)      # #1a2a3a
SILVER_HI = (58, 74, 90)      # #3a4a5a

# ---------------------------------------------------------------- FONTOK
FONT_DIR = os.path.join(os.environ.get("USERPROFILE", os.path.expanduser("~")),
                        ".claude", "skills", "canvas-design", "canvas-fonts")
BOLD = os.path.join(FONT_DIR, "Outfit-Bold.ttf")
REG = os.path.join(FONT_DIR, "Outfit-Regular.ttf")
for _f in (BOLD, REG):
    assert os.path.exists(_f), f"Hianyzo font: {_f}"

_fcache = {}


def font(path, size):
    key = (path, size)
    if key not in _fcache:
        _fcache[key] = ImageFont.truetype(path, size)
    return _fcache[key]


OUT = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- ADATOK
NAME = "Mike Patrik"
PHONE = "+36 30 618 2165"
EMAIL = "velencevillkft@gmail.com"
SITE = "velencevill.com"
URL = "https://velencevill.com"
ADDRESS = "Velence, Fecske utca 12."


# ================================================================ SEGEDEK
def new_card():
    return Image.new("RGBA", (W, H), BG + (255,))


def tracked_text(draw, xy, text, fnt, fill, tracking=0, center_x=None):
    """Betukozos szovegrajzolas. Visszaadja a teljes szelesseget."""
    x, y = xy
    widths = [draw.textlength(ch, font=fnt) for ch in text]
    total = sum(widths) + tracking * max(len(text) - 1, 0)
    if center_x is not None:
        x = center_x - total / 2
    for ch, cw in zip(text, widths):
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += cw + tracking
    return total


def text_w(text, fnt):
    return ImageDraw.Draw(Image.new("RGB", (1, 1))).textlength(text, font=fnt)


def radial_glow(base, cx, cy, rx, ry, color, peak=90, blur=180):
    """Nagyon halvany radialis szinfolt a hatterbe."""
    mask = Image.new("L", base.size, 0)
    ImageDraw.Draw(mask).ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=peak)
    mask = mask.filter(ImageFilter.GaussianBlur(blur))
    layer = Image.new("RGBA", base.size, color + (255,))
    layer.putalpha(mask)
    base.alpha_composite(layer)


def bolt_points(cx, cy, w, h):
    """Villam polygon adott kozeppont / bounding box korul."""
    P = [
        (0.58, 0.00), (0.16, 0.52), (0.43, 0.52),
        (0.22, 1.00), (0.86, 0.40), (0.56, 0.40), (0.80, 0.00),
    ]
    return [(cx + (x - 0.5) * w, cy + (y - 0.5) * h) for x, y in P]


def draw_bolt(base, pts, stroke=8, color=TEAL, fill_alpha=0,
              glow=True, glow_radius=30, glow_alpha=150):
    """Villam korvonal + opcionalis halvany kitoltes + glow."""
    if glow:
        gl = Image.new("RGBA", base.size, (0, 0, 0, 0))
        ImageDraw.Draw(gl).line(pts + [pts[0]], fill=color + (glow_alpha,),
                                width=stroke + 12, joint="curve")
        base.alpha_composite(gl.filter(ImageFilter.GaussianBlur(glow_radius)))
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    if fill_alpha:
        d.polygon(pts, fill=color + (fill_alpha,))
    d.line(pts + [pts[0]], fill=color + (255,), width=stroke, joint="curve")
    base.alpha_composite(layer)


def gradient_bolt(base, pts, c_lo=SILVER_LO, c_hi=SILVER_HI):
    """Villam alak ezust/szurke atmenettel kitoltve (atlos gradient)."""
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    x0, y0, x1, y1 = min(xs), min(ys), max(xs), max(ys)
    bw, bh = int(x1 - x0) + 1, int(y1 - y0) + 1

    grad = Image.new("RGB", (bw, bh))
    gp = grad.load()
    for y in range(bh):
        for x in range(0, bw, 4):
            t = (x / bw * 0.45 + y / bh * 0.55)
            t = t * t * (3 - 2 * t)  # smoothstep
            c = tuple(int(round(c_lo[i] + (c_hi[i] - c_lo[i]) * t)) for i in range(3))
            for k in range(4):
                if x + k < bw:
                    gp[x + k, y] = c

    mask = Image.new("L", (bw, bh), 0)
    ImageDraw.Draw(mask).polygon([(p[0] - x0, p[1] - y0) for p in pts], fill=255)
    grad = grad.convert("RGBA")
    grad.putalpha(mask)
    base.alpha_composite(grad, (int(x0), int(y0)))


def teal_frame(base, inset=SAFE, width=6, alpha=235, corner=None):
    """Teal keret a safe zonan + opcionalis sarok-negyzetek."""
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rectangle([inset, inset, W - inset, H - inset],
                outline=TEAL + (alpha,), width=width)
    if corner:
        h = corner // 2
        for cx, cy in [(inset, inset), (W - inset, inset),
                       (inset, H - inset), (W - inset, H - inset)]:
            d.rectangle([cx - h, cy - h, cx + h, cy + h], fill=TEAL + (255,))
    base.alpha_composite(layer)


def emboss_shape(base, pts, depth=6, soft=5, face=24,
                 light=(205, 226, 242), lift=0.90, sink=1.0):
    """Dombornyomas-hatas: magassagterkep -> el-megvilagitas balrol-felulrol.

    Nem szinez, hanem "reliefet" rak a lapra: a forma lapja egy arnyalattal
    vilagosabb, a bal-felso ele csillan, a jobb-also ele arnyekot vet.
    Igy nez ki egy valodi vaknyomott (blind deboss) nevjegy."""
    hm = Image.new("L", base.size, 0)
    ImageDraw.Draw(hm).polygon(pts, fill=255)
    hm = hm.filter(ImageFilter.GaussianBlur(soft))

    up = ImageChops.offset(hm, -depth, -depth)
    dn = ImageChops.offset(hm, depth, depth)
    hi = ImageChops.subtract(up, dn)          # bal-felso el -> feny
    lo = ImageChops.subtract(dn, up)          # jobb-also el -> arnyek

    # a forma lapja: alig lathato vilagositas
    f = Image.new("RGBA", base.size, light + (255,))
    f.putalpha(hm.point(lambda v: int(v * face / 255)))
    base.alpha_composite(f)

    sh = Image.new("RGBA", base.size, (0, 0, 0, 255))
    sh.putalpha(lo.point(lambda v: int(v * sink)))
    base.alpha_composite(sh)

    li = Image.new("RGBA", base.size, light + (255,))
    li.putalpha(hi.point(lambda v: int(v * lift)))
    base.alpha_composite(li)


def centered(d, y, text, fnt, fill, cx=W / 2, tracking=0):
    """Vizszintesen kozepre zart szoveg."""
    return tracked_text(d, (0, y), text, fnt, fill, tracking=tracking, center_x=cx)


def make_qr(data, size, fill=TEAL, back=BG, ec=ERROR_CORRECT_H):
    qr = qrcode.QRCode(version=None, error_correction=ec,
                       box_size=10, border=2)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color=fill, back_color=back).convert("RGBA")
    return img.resize((size, size), Image.NEAREST)


def place_qr(base, data, x, y, size, pad=26, radius=22, border_alpha=120,
             ec=ERROR_CORRECT_H):
    """QR + lekerekitett sotet panel vekony teal kerettel (szandekos elem,
    nem 'veletlen teglalap' a hatteren)."""
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    box = [x - pad, y - pad, x + size + pad, y + size + pad]
    d.rounded_rectangle(box, radius=radius, fill=BG + (255,),
                        outline=TEAL + (border_alpha,), width=3)
    base.alpha_composite(layer)
    base.alpha_composite(make_qr(data, size, ec=ec), (x, y))


# ================================================================ 1. SIMA ELOLAP
def simple_front():
    """A LOGO-OLDAL. Semmi mas: kozepen VELENCE VILL Kft.,
    mogotte dombornyomott (vaknyomott) villam, pontosan a lap kozepen."""
    img = new_card()

    # nagyon halvany merites, hogy a lap ne legyen sik fekete
    radial_glow(img, W / 2, H / 2, 900, 620, TEAL, peak=20, blur=260)

    # --- dombornyomott villam, a lap mertani kozeppontjaban ---
    pts = bolt_points(W / 2, H / 2, 560, 900)
    emboss_shape(img, pts)

    d = ImageDraw.Draw(img, "RGBA")

    # --- szoveg a relief folott ---
    f_word = font(BOLD, 132)                      # 15.8 pt
    f_kft = font(REG, 76)                         # 9.1 pt

    # a szoveg mogott lagy sotetites: a relief ne zavarja az olvasast
    veil = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(veil).ellipse([W / 2 - 620, H / 2 - 150,
                                  W / 2 + 620, H / 2 + 150], fill=BG + (150,))
    img.alpha_composite(veil.filter(ImageFilter.GaussianBlur(70)))

    centered(d, H / 2 - 130, "VELENCE VILL", f_word, WHITE + (255,), tracking=6)
    d.line([(W / 2 - 150, H / 2 + 42), (W / 2 + 150, H / 2 + 42)],
           fill=TEAL + (215,), width=4)
    centered(d, H / 2 + 74, "Kft.", f_kft, TEAL + (255,), tracking=10)

    return img


def simple_back():
    """AZ ADATOLDAL. Minden kozepre zarva: nev, telefon, email,
    weboldal, cim, QR."""
    img = new_card()

    radial_glow(img, W / 2, 640, 760, 560, TEAL, peak=22, blur=240)

    d = ImageDraw.Draw(img, "RGBA")

    f_name = font(BOLD, 118)                      # 14.2 pt
    f_phone = font(REG, 84)                       # 10.1 pt
    f_site = font(REG, 78)                        # 9.4 pt
    f_small = font(REG, MIN_PT_PX)                # 8.0 pt

    # Fuggoleges ritmus ugy beallitva, hogy a szovegblokk vege (730) es a QR
    # panel teteje (770) ne erjen ossze, es a teljes tartalom optikailag a lap
    # kozepere essen (195..1142 -> kozep 668, a lap kozepe 670).
    centered(d, 195, NAME, f_name, WHITE + (255,), tracking=2)
    d.line([(W / 2 - 210, 352), (W / 2 + 210, 352)], fill=TEAL + (215,), width=4)

    centered(d, 388, PHONE, f_phone, WHITE + (238,))
    centered(d, 487, EMAIL, f_small, GREY + (255,))
    centered(d, 572, SITE, f_site, TEAL + (255,))
    centered(d, 663, ADDRESS, f_small, GREY + (255,))

    # QR kozepen alul. ECC M (H helyett): 29 modul 33 helyett, igy 320 px-en
    # 0.47 mm/modul - a nyomtatott QR gyakorlati also hatara ~0.4 mm
    qs = 320
    place_qr(img, URL, int((W - qs) / 2), 796, qs, ec=ERROR_CORRECT_M)

    return img


# ================================================================ 2. VIP ELOLAP
def vip_front():
    img = new_card()

    # nagy villam: ezust gradient + teal glow korvonal
    # (a keretcsucson belul marad: 205..1135, tehat nem vagja at a teal keretet)
    pts = bolt_points(1200, 670, 720, 930)
    gl = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(gl).line(pts + [pts[0]], fill=TEAL + (110,), width=26, joint="curve")
    img.alpha_composite(gl.filter(ImageFilter.GaussianBlur(60)))
    gradient_bolt(img, pts)
    draw_bolt(img, pts, stroke=6, color=TEAL, glow=True,
              glow_radius=26, glow_alpha=120)

    # sotet overlay (#060d18, 40%) - olvashatosag
    img.alpha_composite(Image.new("RGBA", img.size, BG + (102,)))

    # bal sotetebb / jobb vilagosabb elkulonites
    side = Image.new("RGBA", img.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(side)
    sd.rectangle([0, 0, 1000, H], fill=(0, 0, 0, 70))
    sd.rectangle([1000, 0, W, H], fill=(120, 150, 175, 16))
    img.alpha_composite(side.filter(ImageFilter.GaussianBlur(90)))

    d = ImageDraw.Draw(img, "RGBA")
    lx = 230

    f_vip = font(BOLD, px(52))
    vw = tracked_text(d, (lx, 360), "VIP", f_vip, TEAL + (255,), tracking=px(8))

    d.line([(lx, 360 + px(52) + 40), (lx + max(vw, 300) + 120, 360 + px(52) + 40)],
           fill=TEAL + (200,), width=4)

    f_name = font(BOLD, px(38))
    f_phone = font(REG, px(26))
    f_site = font(REG, px(26))

    d.text((lx, 610), NAME, font=f_name, fill=WHITE + (255,))
    d.text((lx, 610 + px(38) + 40), PHONE, font=f_phone, fill=GREY + (255,))
    d.text((lx, 610 + px(38) + px(26) + 80), SITE, font=f_site, fill=TEAL + (255,))

    # jobb also sarok: cegnev 30% alpha (8.0 / 7.0 pt - nyomdai minimumon)
    f_cn = font(BOLD, MIN_PT_PX)
    f_ck = font(BOLD, 58)
    cn_w = text_w("VELENCE VILL", f_cn)
    ck_w = text_w("Kft.", f_ck)
    right = W - SAFE - 30
    d.text((right - cn_w, H - SAFE - 215), "VELENCE VILL", font=f_cn,
           fill=WHITE + (77,))
    d.text((right - ck_w, H - SAFE - 215 + MIN_PT_PX + 18), "Kft.", font=f_ck,
           fill=TEAL + (77,))

    # inset = SAFE + 12: a keret vonala es a 22 px-es sarokpont KULSO ele is
    # a safe zonan belul marad (a rajzolas a vonal kozepere tortenik)
    teal_frame(img, inset=SAFE + 12, width=6, alpha=235, corner=px(8))
    return img


# ================================================================ 3. VIP HATLAP
def vip_back():
    img = new_card()

    # hatter-textura: 30 apro villam.
    # A brief 8-15% alphat kert, de nyomtatasban az a kulonbseg nem jon ki a
    # papiron (a #060d18 alapon ~4 delta-E), ezert 22-35% + vastagabb vonal:
    # kepernyon is, papiron is lathato textura marad, de nem viszi el a fokuszt.
    qs = px(240)
    qx, qy = (W - qs) // 2, 300
    panel = (qx - 90, qy - 90, qx + qs + 90, qy + qs + 90)

    def free(x, y, h, placed):
        # ne lógjon a QR panelra
        if panel[0] < x < panel[2] and panel[1] < y < panel[3]:
            return False
        # ne vagja at a teal keret vonalat
        for edge in (SAFE, W - SAFE):
            if abs(x - edge) < h * 0.7:
                return False
        for edge in (SAFE, H - SAFE):
            if abs(y - edge) < h * 0.7:
                return False
        # ne tapadjanak ossze
        return all(math.hypot(x - a, y - b) > 190 for a, b in placed)

    tex = Image.new("RGBA", img.size, (0, 0, 0, 0))
    td = ImageDraw.Draw(tex)
    placed, tries = [], 0
    while len(placed) < 30 and tries < 4000:
        tries += 1
        x = random.randint(BLEED, W - BLEED)
        y = random.randint(BLEED, H - BLEED)
        h = random.randint(px(20), px(50))
        if not free(x, y, h, placed):
            continue
        placed.append((x, y))
        a = random.randint(56, 90)          # 22-35%
        pts = bolt_points(x, y, h * 0.62, h)
        td.line(pts + [pts[0]], fill=TEAL + (a,), width=5, joint="curve")
    img.alpha_composite(tex.filter(ImageFilter.GaussianBlur(0.6)))
    print(f"    (vip_back: {len(placed)} kis villam elhelyezve)")

    d = ImageDraw.Draw(img, "RGBA")

    # kozepen nagy QR
    # halvany teal derengés a QR mogott, hogy elvaljon a texturatol
    radial_glow(img, W // 2, qy + qs // 2, qs, qs, TEAL, peak=30, blur=120)
    place_qr(img, URL, qx, qy, qs, pad=34, radius=28)

    f_url = font(REG, px(26))
    tracked_text(d, (0, qy + qs + 84), SITE, f_url, GREY + (255,),
                 tracking=3, center_x=W / 2)

    # inset = SAFE + 12: a keret vonala es a 22 px-es sarokpont KULSO ele is
    # a safe zonan belul marad (a rajzolas a vonal kozepere tortenik)
    teal_frame(img, inset=SAFE + 12, width=6, alpha=235, corner=px(8))
    return img


# ================================================================ MENTES
def save(img, name):
    path = os.path.join(OUT, name)
    # 600 DPI meta: a geometria is 600 DPI-s (trim 2100x1200 px = 3.5x2 inch).
    # 300-as tag eseten a nyomdai szoftver 7.47x4.47 inchre tenne a lapot.
    img.convert("RGB").save(path, "PNG", dpi=(600, 600))
    w, h = Image.open(path).size
    mb = os.path.getsize(path) / 1024 / 1024
    print(f"  {name:20s} {w}x{h}  {mb:.2f} MB")
    assert (w, h) == (W, H), f"HIBAS MERET: {name} {w}x{h}"


if __name__ == "__main__":
    print("Generalas...")
    save(simple_front(), "simple_front.png")
    save(simple_back(), "simple_back.png")
    save(vip_front(), "vip_front.png")
    save(vip_back(), "vip_back.png")
    print("KESZ.")
