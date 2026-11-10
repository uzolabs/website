"""Uzo Labs glass art. Run: blender --background --factory-startup --python render.py -- <outdir> [names...]"""
import bpy, bmesh, math, sys, os
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else os.path.abspath("out")
PREVIEW = os.environ.get("UZO_PREVIEW") == "1"
ONLY = set(argv[1:])
os.makedirs(OUT, exist_ok=True)

# Uli palette, matching the site: edo ochre, ufie camwood, nzu chalk.
GOLD = (1.0, 0.56, 0.12)
CAMWOOD = (0.95, 0.24, 0.09)
CHALK = (1.0, 0.9, 0.74)


def srgb(c):
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)


# ---------- scene ----------
def reset(res_x, res_y, samples=72):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    _mats.clear()
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    cy = sc.cycles
    cy.device = "CPU"
    cy.samples = samples
    cy.use_adaptive_sampling = True
    cy.adaptive_threshold = 0.02
    cy.use_denoising = True
    cy.max_bounces = 16
    cy.transmission_bounces = 16
    cy.glossy_bounces = 8
    cy.transparent_max_bounces = 16
    cy.caustics_reflective = False
    cy.caustics_refractive = False
    cy.film_transparent_glass = True
    cy.film_transparent_roughness = 0.2
    sc.render.film_transparent = True
    sc.render.resolution_x = res_x
    sc.render.resolution_y = res_y
    sc.render.resolution_percentage = 40 if PREVIEW else 100
    if PREVIEW:
        cy.samples = 20
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGBA"
    sc.render.image_settings.color_depth = "8"
    sc.view_settings.view_transform = "Standard"
    for look in ("Medium High Contrast", "None"):
        try:
            sc.view_settings.look = look
            break
        except Exception:
            pass
    world = bpy.data.worlds.new("w")
    sc.world = world
    world.use_nodes = True
    nt = world.node_tree
    bg = nt.nodes["Background"]
    bg.inputs[0].default_value = (*srgb((0.19, 0.15, 0.11)), 1)
    bg.inputs[1].default_value = 1.0
    rig()


def area(name, loc, rot, size, color, power, shape="RECTANGLE", size_y=None):
    d = bpy.data.lights.new(name, "AREA")
    d.shape = shape
    d.size = size
    if size_y:
        d.size_y = size_y
    d.color = color
    d.energy = power
    o = bpy.data.objects.new(name, d)
    bpy.context.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = rot
    return o


def look_at(obj, target=(0, 0, 0)):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def strip(name, loc, size, color, strength):
    """A long emissive card: seen only in reflections, it draws the glass edges."""
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = (size[0], size[1], 1)
    look_at(o)
    o.rotation_euler.rotate_axis("X", math.pi)
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    n = m.node_tree.nodes
    n.clear()
    em = n.new("ShaderNodeEmission")
    em.inputs[0].default_value = (*color, 1)
    em.inputs[1].default_value = strength
    out = n.new("ShaderNodeOutputMaterial")
    m.node_tree.links.new(em.outputs[0], out.inputs[0])
    o.data.materials.append(m)
    o.visible_camera = False
    o.visible_shadow = False
    return o


def rig():
    for l in (
        area("key", (-3.5, -4, 5), (0, 0, 0), 4, (1, 0.97, 0.94), 900),
        area("gold", (-5, 3, 1.5), (0, 0, 0), 3, GOLD, 2200),
        area("camwood", (5, 2.5, 2.5), (0, 0, 0), 3, CAMWOOD, 2200),
        area("under", (0, -2, -4), (0, 0, 0), 5, CHALK, 300),
    ):
        look_at(l)
    strip("s1", (-6, -3, 3), (0.5, 9), CHALK, 6)
    strip("s2", (6, -4, 2), (0.35, 9), CAMWOOD, 8)
    strip("s3", (0, 6, 6), (10, 1.2), GOLD, 4)


# ---------- materials ----------
_mats = {}
GLOW_SCALE = 0.42


def glass(tint=(0.85, 1.0, 0.95), rough=0.03, film=320.0, name=None):
    key = name or f"g{tint}{rough}{film}"
    if key in _mats:
        return _mats[key]
    m = bpy.data.materials.new(key)
    m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    tint = (min(1.0, tint[1]), 0.93 * tint[1], 0.82 * tint[2])  # cool tints in, warm chalk glass out
    p.inputs["Base Color"].default_value = (*srgb(tint), 1)
    p.inputs["Roughness"].default_value = rough
    p.inputs["IOR"].default_value = 1.47
    p.inputs["Transmission Weight"].default_value = 1.0
    if "Thin Film Thickness" in p.inputs:
        p.inputs["Thin Film Thickness"].default_value = film
        p.inputs["Thin Film IOR"].default_value = 1.38
    _mats[key] = m
    return m


def glow(strength=3.0, axis="X", stops=(GOLD, CAMWOOD), name=None):
    key = name or f"e{strength}{axis}{stops}"
    if key in _mats:
        return _mats[key]
    m = bpy.data.materials.new(key)
    m.use_nodes = True
    nt = m.node_tree
    n = nt.nodes
    n.clear()
    tc = n.new("ShaderNodeTexCoord")
    sep = n.new("ShaderNodeSeparateXYZ")
    ramp = n.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*stops[0], 1)
    ramp.color_ramp.elements[1].color = (*stops[-1], 1)
    em = n.new("ShaderNodeEmission")
    em.inputs[1].default_value = strength * GLOW_SCALE
    out = n.new("ShaderNodeOutputMaterial")
    nt.links.new(tc.outputs["Generated"], sep.inputs[0])
    nt.links.new(sep.outputs[axis], ramp.inputs[0])
    nt.links.new(ramp.outputs[0], em.inputs[0])
    nt.links.new(em.outputs[0], out.inputs[0])
    _mats[key] = m
    return m


def assign(o, m):
    o.data.materials.clear()
    o.data.materials.append(m)
    return o


def smooth(o):
    for p in o.data.polygons:
        p.use_smooth = True
    return o


# ---------- shapes ----------
def rounded_box(size, loc=(0, 0, 0), bevel=0.12, mat=None, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.object
    o.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    b = o.modifiers.new("bevel", "BEVEL")
    b.width = bevel
    b.segments = 10
    b.limit_method = "NONE"
    b.harden_normals = False
    smooth(o)
    o.modifiers.new("wn", "WEIGHTED_NORMAL").keep_sharp = False
    if mat:
        assign(o, mat)
    return o


def sphere(r, loc, mat):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=64, ring_count=32)
    return assign(smooth(bpy.context.object), mat)


def torus(R, r, loc=(0, 0, 0), rot=(0, 0, 0), mat=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, location=loc, rotation=rot,
                                     major_segments=128, minor_segments=40)
    o = smooth(bpy.context.object)
    if mat:
        assign(o, mat)
    return o


def cylinder(r, depth, loc=(0, 0, 0), rot=(0, 0, 0), mat=None, bevel=0.06):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc, rotation=rot, vertices=96)
    o = bpy.context.object
    if bevel:
        b = o.modifiers.new("bevel", "BEVEL")
        b.width = bevel
        b.segments = 8
        b.limit_method = "ANGLE"
        b.angle_limit = math.radians(60)
    smooth(o)
    o.modifiers.new("wn", "WEIGHTED_NORMAL")
    if mat:
        assign(o, mat)
    return o


def tube(points, radius, mat, radii=None, res=10, caps=True):
    cu = bpy.data.curves.new("tube", "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = radius
    cu.bevel_resolution = res
    cu.use_fill_caps = caps
    cu.resolution_u = 4
    sp = cu.splines.new("POLY")
    sp.points.add(len(points) - 1)
    for i, p in enumerate(points):
        sp.points[i].co = (*p, 1)
        if radii:
            sp.points[i].radius = radii[i]
    sp.use_smooth = True
    o = bpy.data.objects.new("tube", cu)
    bpy.context.collection.objects.link(o)
    cu.materials.append(mat)
    return o


def text(body, size, extrude, mat, loc=(0, 0, 0), rot=(math.pi / 2, 0, 0), bevel=0.02):
    bpy.ops.object.text_add(location=loc, rotation=rot)
    o = bpy.context.object
    o.data.body = body
    o.data.size = size
    o.data.extrude = extrude
    o.data.bevel_depth = bevel
    o.data.bevel_resolution = 6
    o.data.align_x = "CENTER"
    o.data.align_y = "CENTER"
    o.data.materials.append(mat)
    return o


def shape2d(points, extrude, bevel, mat, loc=(0, 0, 0), rot=(math.pi / 2, 0, 0), scale=1.0):
    """A flat outline, extruded and beveled into a glass slab."""
    cu = bpy.data.curves.new("shape", "CURVE")
    cu.dimensions = "2D"
    cu.fill_mode = "BOTH"
    cu.extrude = extrude
    cu.bevel_depth = bevel
    cu.bevel_resolution = 8
    sp = cu.splines.new("POLY")
    sp.points.add(len(points) - 1)
    for i, (x, y) in enumerate(points):
        sp.points[i].co = (x * scale, y * scale, 0, 1)
    sp.use_cyclic_u = True
    o = bpy.data.objects.new("shape", cu)
    bpy.context.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = rot
    cu.materials.append(mat)
    return o


def revolve(profile, segments=96, mat=None, loc=(0, 0, 0)):
    """Mesh of revolution from (radius, z) pairs, top to bottom."""
    me = bpy.data.meshes.new("rev")
    bm = bmesh.new()
    rings = []
    for r, z in profile:
        ring = [bm.verts.new((r * math.cos(2 * math.pi * k / segments), r * math.sin(2 * math.pi * k / segments), z))
                for k in range(segments)]
        rings.append(ring)
    for a, b in zip(rings, rings[1:]):
        for k in range(segments):
            k2 = (k + 1) % segments
            bm.faces.new((a[k], a[k2], b[k2], b[k]))
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new("rev", me)
    bpy.context.collection.objects.link(o)
    o.location = loc
    smooth(o)
    if mat:
        assign(o, mat)
    return o


# ---------- camera ----------
def frame(direction=(0.0, -1.0, 0.35), lens=60, pad=1.12, target=None):
    sc = bpy.context.scene
    bpy.context.view_layer.update()
    deps = bpy.context.evaluated_depsgraph_get()
    pts = []
    for o in sc.objects:
        if o.type in {"MESH", "CURVE", "FONT"} and o.visible_camera:
            ev = o.evaluated_get(deps)
            pts += [ev.matrix_world @ Vector(c) for c in ev.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    center = Vector(target) if target else (lo + hi) / 2
    cd = bpy.data.cameras.new("cam")
    cd.lens = lens
    cd.sensor_fit = "HORIZONTAL"
    cam = bpy.data.objects.new("cam", cd)
    sc.collection.objects.link(cam)
    sc.camera = cam
    rx, ry = sc.render.resolution_x, sc.render.resolution_y
    th = math.tan(cd.angle / 2)
    tv = th * ry / rx
    fwd = Vector(direction).normalized()
    right = fwd.cross(Vector((0, 0, 1))).normalized()
    up = right.cross(fwd).normalized()
    dist = 0.0
    for p in pts:
        v = p - center
        x, y, z = abs(v.dot(right)), abs(v.dot(up)), v.dot(fwd)
        dist = max(dist, x * pad / th - z, y * pad / tv - z)
    cam.location = center - fwd * dist
    look_at(cam, center)


def render(name):
    path = os.path.join(OUT, f"{name}.png")
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print("RENDERED", path, flush=True)


# ---------- pieces ----------
def spiral_points(turns=2.6, r0=0.12, r1=1.55, rise=0.9, n=360):
    pts, radii = [], []
    for i in range(n + 1):
        t = i / n
        th = t * turns * 2 * math.pi
        r = r0 + (r1 - r0) * t
        pts.append((r * math.cos(th), r * math.sin(th), rise * (1 - t) ** 1.6))
        radii.append(0.35 + 0.65 * t)
    return pts, radii


def hero():
    reset(1600, 1400, samples=96)
    pts, radii = spiral_points()
    s = tube(pts, 0.27, glass((0.82, 1.0, 0.94), 0.02), radii=radii, res=12)
    core = tube(pts, 0.045, glow(3.6, "X"), radii=radii, res=6)
    for o in (s, core):
        o.rotation_euler = (math.radians(58), 0, math.radians(-18))
    sphere(0.32, (1.75, 0.2, 1.25), glass((0.75, 0.95, 1.0), 0.02))
    sphere(0.12, (-1.75, -0.4, 1.35), glow(2.4, "Z", (CAMWOOD, GOLD)))
    rounded_box((0.55, 0.55, 0.55), (-1.6, 0.5, -0.95), 0.12, glass((0.8, 1.0, 0.92), 0.04),
                rot=(0.5, 0.6, 0.3))
    torus(2.15, 0.018, (0, 0.6, 0), (math.radians(64), 0, math.radians(-18)), glow(2, "X", (CAMWOOD, GOLD)))
    frame((0.0, 1.0, -0.12), lens=70, pad=1.02)
    render("hero")


def deploy():
    reset(900, 900)
    arrow = [(-0.28, -1.0), (0.28, -1.0), (0.28, 0.15), (0.78, 0.15), (0.0, 1.05), (-0.78, 0.15), (-0.28, 0.15)]
    shape2d(arrow, 0.2, 0.07, glass((0.82, 1.0, 0.94), 0.02), rot=(math.radians(90), 0, math.radians(-20)))
    shape2d(arrow, 0.02, 0.0, glow(3.2, "Y"), rot=(math.radians(90), 0, math.radians(-20)), scale=0.42,
            loc=(0, 0, -0.05))
    torus(0.62, 0.025, (0, 0, -1.1), (0, 0, 0), glow(2.6, "X", (CAMWOOD, GOLD)))
    frame((0.25, 1.0, -0.3), lens=60, pad=1.0)
    render("deploy")


def sdk():
    reset(900, 900)
    t = text("{ }", 1.6, 0.22, glass((0.82, 1.0, 0.96)), bevel=0.035)
    t.rotation_euler = (math.radians(90), 0, math.radians(-16))
    rounded_box((0.32, 0.32, 0.32), (0, 0, 0.0), 0.08, glow(3.2), rot=(0.6, 0.7, 0.2))
    frame((0.3, 1.0, -0.25), lens=60, pad=1.12)
    render("sdk")


def templates():
    reset(900, 900)
    tints = [(0.78, 1.0, 0.92), (0.8, 0.95, 1.0), (0.85, 1.0, 0.97)]
    for i, tint in enumerate(tints):
        rounded_box((1.7, 1.15, 0.12), (i * 0.28 - 0.28, -i * 0.05, i * 0.42 - 0.42), 0.06, glass(tint, 0.03),
                    rot=(0, 0, math.radians(-8)))
    for j, w in enumerate((0.9, 0.6, 0.75)):
        rounded_box((w, 0.07, 0.04), (0.28 - 0.35 + w / 2 - 0.25, -0.12 - j * 0.0, 0.5 + 0.0), 0.02, glow(3.2),
                    rot=(0, 0, math.radians(-8))).location.y = -0.3 + j * 0.25
    frame((0.0, 1.0, -0.9), lens=60, pad=1.12)
    render("templates")


def rpc():
    reset(900, 900)
    torus(1.0, 0.24, (0, 0, 0), (math.radians(70), 0, math.radians(20)), glass((0.8, 0.97, 1.0)))
    sphere(0.36, (0, 0, 0), glow(2.8, "Z", (GOLD, CAMWOOD)))
    torus(1.55, 0.015, (0, 0, 0), (math.radians(60), math.radians(20), 0), glow(2, "X", (CAMWOOD, GOLD)))
    for a in (0.3, 2.4, 4.4):
        sphere(0.13, (1.55 * math.cos(a), 1.55 * math.sin(a) * 0.5, 1.55 * math.sin(a) * 0.86 * 0.5), glass((0.85, 1, 0.95)))
    frame((0.0, 1.0, -0.2), lens=60, pad=1.1)
    render("rpc")


def index():
    reset(900, 900)
    g = glass((0.82, 1.0, 0.95))
    for i in range(3):
        cylinder(1.0, 0.42, (0, 0, i * 0.62 - 0.62), mat=g, bevel=0.1)
        if i < 2:
            torus(0.95, 0.03, (0, 0, i * 0.62 - 0.31), mat=glow(3.6, "X"))
    frame((0.0, 1.0, -0.42), lens=60, pad=1.12)
    render("index")


def teardrop(scale=1.0, loc=(0, 0, 0), mat=None):
    prof = []
    n = 90
    for i in range(n + 1):
        t = i / n * math.pi
        r = math.sin(t) * math.sin(t / 2) ** 1.15
        prof.append((max(r, 1e-4) * 0.78 * scale, math.cos(t) * scale))
    return revolve(prof, mat=mat, loc=loc)


def faucet():
    reset(900, 900)
    teardrop(1.0, (0, 0, 0), glass((0.78, 1.0, 0.9), 0.02))
    sphere(0.2, (0, 0, -0.45), glow(3.2, "Z", (GOLD, CAMWOOD)))
    teardrop(0.38, (0.95, -0.2, -0.7), glass((0.8, 0.95, 1.0), 0.02))
    torus(0.9, 0.02, (0, 0, -1.08), (0, 0, 0), glow(2, "X", (CAMWOOD, GOLD)))
    frame((0.0, 1.0, -0.3), lens=60, pad=1.15)
    render("faucet")


def quickstart():
    reset(900, 900)
    rounded_box((1.9, 0.18, 1.35), (0, 0, 0), 0.08, glass((0.82, 0.98, 1.0), 0.03), rot=(0, 0, math.radians(-18)))
    t = text(">_", 0.72, 0.06, glow(3.6, "X"), loc=(0, 0, 0), bevel=0.01)
    t.rotation_euler = (math.radians(90), 0, math.radians(-18))
    t.location = (-0.05, -0.16, -0.05)
    for k in range(3):
        sphere(0.05, (-0.72 + k * 0.16, -0.12, 0.5), glow(2.4, "Z", ((GOLD, CAMWOOD, CHALK)[k],) * 2))
    frame((0.35, 1.0, -0.25), lens=60, pad=1.12)
    render("quickstart")


def roadmap():
    reset(900, 900)
    tops = []
    for i in range(4):
        h = 0.45 + i * 0.45
        x = -1.2 + i * 0.8
        rounded_box((0.62, 0.62, h), (x, 0, h / 2 - 1), 0.08,
                    glass((0.8, 1.0, 0.93) if i < 3 else (0.8, 0.95, 1.0), 0.03))
        tops.append((x, 0, h - 1 + 0.12))
    sphere(0.14, (tops[-1][0], 0, tops[-1][2] + 0.12), glow(3.6))
    path = []
    for i in range(len(tops) - 1):
        a, b = Vector(tops[i]), Vector(tops[i + 1])
        for s in range(12):
            u = s / 12
            p = a.lerp(b, u)
            p.z += math.sin(u * math.pi) * 0.25
            path.append(tuple(p))
    path.append(tops[-1])
    tube(path, 0.022, glow(3.2, "X"))
    for o in bpy.context.scene.objects:
        if o.type in {"MESH", "CURVE"}:
            o.rotation_euler.rotate_axis("Z", math.radians(-22))
            o.location = Vector(o.location)
    frame((0.2, 1.0, -0.45), lens=60, pad=1.0)
    render("roadmap")


def network():
    reset(900, 900)
    torus(0.85, 0.2, (-0.45, 0, 0), (math.radians(90), 0, math.radians(-25)), glass((0.78, 1.0, 0.9)))
    torus(0.85, 0.2, (0.45, 0, 0), (0, math.radians(20), math.radians(-25)), glass((0.8, 0.94, 1.0)))
    sphere(0.12, (0, 0, 0), glow(3.6))
    frame((0.0, 1.0, -0.3), lens=60, pad=1.12)
    render("network")


def ribbon():
    reset(2000, 900, samples=80)
    n, half = 240, 0.75
    me = bpy.data.meshes.new("ribbon")
    bm = bmesh.new()
    pairs, edge = [], []
    for i in range(n + 1):
        t = i / n
        c = Vector((-4.2 + 8.4 * t, 0.5 * math.sin(t * 5.0), 0.6 * math.sin(t * 2 * math.pi + 0.6)))
        a = t * math.pi * 2.2
        w = Vector((0.18 * math.sin(a), math.sin(a), math.cos(a))).normalized() * half
        pairs.append((bm.verts.new(c - w), bm.verts.new(c + w)))
        edge.append(tuple(c + w * 1.02))
    for (a0, a1), (b0, b1) in zip(pairs, pairs[1:]):
        bm.faces.new((a0, b0, b1, a1))
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new("ribbon", me)
    bpy.context.collection.objects.link(o)
    smooth(o)
    sol = o.modifiers.new("sol", "SOLIDIFY")
    sol.thickness = 0.07
    sol.offset = 0
    sub = o.modifiers.new("sub", "SUBSURF")
    sub.levels = 1
    sub.render_levels = 2
    assign(o, glass((0.82, 1.0, 0.95), 0.05))
    tube(edge, 0.016, glow(2.8, "X"))
    frame((0.0, 1.0, -0.38), lens=50, pad=1.02)
    render("ribbon")


PIECES = {f.__name__: f for f in (hero, deploy, sdk, templates, rpc, index, faucet, quickstart, roadmap, network, ribbon)}
for name, fn in PIECES.items():
    if ONLY and name not in ONLY:
        continue
    try:
        fn()
    except Exception as e:
        import traceback
        traceback.print_exc()
        print("FAILED", name, e, flush=True)
