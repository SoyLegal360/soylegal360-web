#!/usr/bin/env python3
"""Genera el vídeo demo del área de clientes (assets/video/sl-app-demo.mp4)
componiendo las capturas reales (assets/img/sl-app-*.jpg) con movimientos
de cámara lentos, puntero animado con clic, rótulos legibles y cierre de
marca. Sin grabación de pantalla: todo determinista y editable aquí.

Uso:  python3 scripts/gen-demo-video.py && ffmpeg (lo lanza solo)
Requiere: Pillow, ffmpeg en el PATH y el logo rasterizado (lo genera solo
con node + @resvg/resvg-js del propio repo).
"""
import math, os, shutil, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = lambda n: os.path.join(ROOT, "assets/img", n)
OUT_MP4 = os.path.join(ROOT, "assets/video/sl-app-demo.mp4")

FPS = 30
W, H = 1500, 940            # salida
RATIO = W / H
SW, SH = 2000, 1250         # espacio de trabajo (capturas a 2x)

GEORGIA = "/System/Library/Fonts/Supplemental/Georgia.ttf"
GEORGIA_B = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
ARIAL = "/System/Library/Fonts/Supplemental/Arial.ttf"
ARIAL_B = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

NAVY = (6, 20, 46)
NAVY2 = (16, 44, 83)
GOLD = (201, 169, 110)
GOLD_SOFT = (226, 198, 132)


def ease(t):  # suave en ambos extremos (smoothstep)
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def lerp(a, b, t):
    return a + (b - a) * t


def rect_at(c0, c1, t):
    """c = (cx, cy, w) en coords 2x; h se deriva del ratio de salida."""
    e = ease(t)
    cx, cy, w = (lerp(c0[i], c1[i], e) for i in range(3))
    h = w / RATIO
    x = min(max(cx - w / 2, 0), SW - w)
    y = min(max(cy - h / 2, 0), SH - h)
    return x, y, w, h


def load2x(name):
    im = Image.open(IMG(name)).convert("RGB")
    return im.resize((SW, SH), Image.LANCZOS)


def draw_cursor(frame, x, y, scale=1.0):
    """Flecha estilo macOS (negra con borde blanco), punta en (x, y)."""
    pts = [(0, 0), (0, 16.9), (4.2, 13.6), (6.9, 19.8), (9.7, 18.6), (7.0, 12.5), (11.8, 12.5)]
    s = 2.1 * scale
    poly = [(x + px * s, y + py * s) for px, py in pts]
    d = ImageDraw.Draw(frame)
    d.polygon(poly, fill=(20, 20, 25), outline=(255, 255, 255))
    d.line(poly + [poly[0]], fill=(255, 255, 255), width=2)


def draw_ripple(frame, x, y, t):
    """Onda dorada del clic; t en [0,1]."""
    if not 0 <= t <= 1:
        return
    r = 12 + 40 * ease(t)
    alpha = int(200 * (1 - t))
    ov = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    d.ellipse([x - r, y - r, x + r, y + r], outline=(GOLD_SOFT[0], GOLD_SOFT[1], GOLD_SOFT[2], alpha), width=5)
    frame.alpha_composite(ov)


CAPTION_FONT = ImageFont.truetype(GEORGIA_B if os.path.exists(GEORGIA_B) else GEORGIA, 30)


def draw_caption(frame, text, alpha):
    if alpha <= 0:
        return
    pad_x, pad_y = 26, 15
    tw = CAPTION_FONT.getbbox(text)[2]
    cw, ch = tw + pad_x * 2 + 26, 30 + pad_y * 2
    x, y = 38, H - ch - 38
    ov = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    a = int(235 * alpha)
    d.rounded_rectangle([x, y, x + cw, y + ch], radius=ch // 2, fill=(NAVY[0], NAVY[1], NAVY[2], a))
    d.rounded_rectangle([x, y, x + cw, y + ch], radius=ch // 2, outline=(GOLD[0], GOLD[1], GOLD[2], int(a * 0.75)), width=2)
    dot = 9
    d.ellipse([x + pad_x, y + ch / 2 - dot / 2, x + pad_x + dot, y + ch / 2 + dot / 2], fill=(GOLD_SOFT[0], GOLD_SOFT[1], GOLD_SOFT[2], a))
    d.text((x + pad_x + 18, y + pad_y - 3), text, font=CAPTION_FONT, fill=(255, 255, 255, a))
    frame.alpha_composite(ov)


def cap_alpha(t, t0, t1, fade=0.4):
    """1 dentro de [t0, t1] con fundido en los bordes."""
    if t < t0 or t > t1:
        return 0.0
    return min(1.0, (t - t0) / fade, (t1 - t) / fade)


def to_out(pt, rect):
    """Punto en coords 2x -> coords de salida según el encuadre actual."""
    x, y, w, h = rect
    return ((pt[0] - x) * W / w, (pt[1] - y) * H / h)


# ── Guion ────────────────────────────────────────────────────────────────
# Cada escena: imagen, encuadre inicial y final (cx, cy, w en coords 2x),
# duración en s, rótulos [(texto, t0, t1) relativos a la escena] y opcional
# puntero {de, a, t0, t1, click_t} en coords 2x.
FULL = (1000, 625, 1984)
SCENES = [
    dict(img="sl-app-dashboard.jpg", c0=FULL, c1=(1000, 615, 1500), dur=7.2,
         caps=[("Tu área privada, de un vistazo", 0.8, 6.4)],
         cursor=dict(de=(1200, 1010), a=(1580, 562), t0=2.8, t1=5.1, click=5.4)),
    dict(img="sl-app-chat.jpg", c0=FULL, c1=(930, 700, 1170), dur=10.5,
         caps=[("Pregúntale lo que necesites", 0.7, 4.6),
               ("Solo cita normativa verificada por abogados", 5.1, 9.9)]),
    dict(img="sl-app-consultas.jpg", c0=FULL, c1=(1000, 690, 1420), dur=8.5,
         caps=[("Cuando es serio, responde tu abogado en el mismo hilo", 0.8, 7.7)],
         cursor=dict(de=(1520, 1060), a=(1000, 1080), t0=4.4, t1=6.4, click=6.7)),
    dict(img="sl-app-documentos.jpg", c0=(1000, 470, 1500), c1=FULL, dur=5.6,
         caps=[("Tu documentación, siempre al día", 0.7, 4.9)]),
]
XFADE = 0.7
END_DUR = 4.6


def endcard_frame(t):
    """Cierre de marca: degradado navy + logo + claim + dominio."""
    base = Image.new("RGB", (W, H))
    for yy in range(H):
        k = yy / H
        base.paste(tuple(int(lerp(NAVY[i], NAVY2[i], k * 0.8)) for i in range(3)), (0, yy, W, yy + 1))
    fr = base.convert("RGBA")
    logo = Image.open(os.path.join(tempfile.gettempdir(), "sl360_logo_footer.png")).convert("RGBA")
    s = 1.0 + 0.03 * (1 - ease(min(1, t / 1.2)))
    lw, lh = int(logo.width * s), int(logo.height * s)
    lg = logo.resize((lw, lh), Image.LANCZOS)
    fr.alpha_composite(lg, (W // 2 - lw // 2, int(H * 0.30) - lh // 2))
    d = ImageDraw.Draw(fr)
    claim = ImageFont.truetype(GEORGIA_B if os.path.exists(GEORGIA_B) else GEORGIA, 52)
    txt = "Tu departamento legal, siempre encendido."
    tw = claim.getbbox(txt)[2]
    d.text((W // 2 - tw // 2, int(H * 0.55)), txt, font=claim, fill=(255, 255, 255, 255))
    url = ImageFont.truetype(ARIAL_B, 30)
    txt2 = "clientes.soylegal360.es"
    tw2 = url.getbbox(txt2)[2]
    d.text((W // 2 - tw2 // 2, int(H * 0.55) + 84), txt2, font=url, fill=GOLD_SOFT + (255,))
    d.rectangle([0, H - 12, W, H], fill=GOLD)
    return fr


def scene_frame(sc, im2x, t):
    rect = rect_at(sc["c0"], sc["c1"], t / sc["dur"])
    x, y, w, h = rect
    fr = im2x.crop((int(x), int(y), int(x + w), int(y + h))).resize((W, H), Image.LANCZOS).convert("RGBA")
    cur = sc.get("cursor")
    if cur:
        if t >= cur["t0"]:
            k = ease(min(1.0, (t - cur["t0"]) / (cur["t1"] - cur["t0"])))
            px = lerp(cur["de"][0], cur["a"][0], k)
            py = lerp(cur["de"][1], cur["a"][1], k)
            ox, oy = to_out((px, py), rect)
            if 0 <= ox <= W and 0 <= oy <= H:
                click_k = (t - cur["click"]) / 0.7
                draw_ripple(fr, ox, oy, click_k)
                scale = 0.92 if 0 <= click_k <= 0.25 else 1.0
                draw_cursor(fr, ox, oy, scale)
    for txt, t0, t1 in sc["caps"]:
        draw_caption(fr, txt, cap_alpha(t, t0, t1))
    return fr


def main():
    # logo horizontal rasterizado con las herramientas del propio repo
    logo_png = os.path.join(tempfile.gettempdir(), "sl360_logo_footer.png")
    subprocess.run(["node", "-e", (
        "const {Resvg}=require('@resvg/resvg-js');const fs=require('fs');"
        f"const svg=fs.readFileSync('{ROOT}/assets/img/soylegal360_logo_blanco_footer.svg','utf8');"
        "const png=new Resvg(svg,{fitTo:{mode:'height',value:260}}).render();"
        f"fs.writeFileSync('{logo_png}',png.asPng());"
    )], cwd=ROOT, check=True)

    tmp = tempfile.mkdtemp(prefix="sl-demo-")
    frames_dir = os.path.join(tmp, "frames")
    os.makedirs(frames_dir)
    sources = {sc["img"]: load2x(sc["img"]) for sc in SCENES}

    n = 0
    def emit(img):
        nonlocal n
        img.convert("RGB").save(os.path.join(frames_dir, f"f{n:05d}.jpg"), quality=93)
        n += 1

    for i, sc in enumerate(SCENES):
        frames = int(sc["dur"] * FPS)
        for f in range(frames):
            emit(scene_frame(sc, sources[sc["img"]], f / FPS))
        # fundido a la escena siguiente (o al cierre)
        xf = int(XFADE * FPS)
        last = scene_frame(sc, sources[sc["img"]], sc["dur"] - 1 / FPS)
        for f in range(xf):
            k = ease((f + 1) / xf)
            if i + 1 < len(SCENES):
                nxt = SCENES[i + 1]
                incoming = scene_frame(nxt, sources[nxt["img"]], 0.0)
            else:
                incoming = endcard_frame(0.0)
            emit(Image.blend(last, incoming, k))
    for f in range(int(END_DUR * FPS)):
        emit(endcard_frame(f / FPS))

    print(f"{n} fotogramas → codificando…")
    subprocess.run([
        "ffmpeg", "-y", "-v", "warning", "-r", str(FPS),
        "-i", os.path.join(frames_dir, "f%05d.jpg"),
        "-c:v", "libx264", "-preset", "slow", "-crf", "23",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", OUT_MP4,
    ], check=True)
    shutil.rmtree(tmp)
    size = os.path.getsize(OUT_MP4) // 1024
    print(f"OK → {OUT_MP4} ({size} KB, {n / FPS:.1f}s)")


if __name__ == "__main__":
    sys.exit(main())
