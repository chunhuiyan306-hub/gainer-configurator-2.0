"""
Data processing script: reads raw_data.json (extracted from the Excel workbook)
and produces a complete, structured data.ts for the Gainer Door Configurator.
"""

import json, re, textwrap

with open("raw_data.json", "r", encoding="utf-8") as f:
    raw = json.load(f)

# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------

def parse_thickness(t: str):
    """'3/4/5/8' -> [3,4,5,8]  ;  '4+4/5+5' -> [8,10]  ;  '4+4/4+5/5+5' -> [8,9,10]"""
    if not t or t.strip() in ("\\", "", "None"):
        return []
    parts = [p.strip() for p in t.replace("mm", "").split("/") if p.strip() and p.strip() != "\\"]
    result = []
    for p in parts:
        if "+" in p:
            nums = [float(x) for x in p.split("+")]
            total = sum(nums)
            result.append(int(total) if total == int(total) else total)
        else:
            try:
                val = float(p)
                result.append(int(val) if val == int(val) else val)
            except ValueError:
                pass
    return sorted(set(result))


def parse_size_limits(notes: str):
    """Extract minW, maxW, minH, maxH from the Notes field."""
    if not notes:
        return {"minW": None, "maxW": None, "minH": None, "maxH": None}
    minW = maxW = minH = maxH = None
    nf = notes.replace("\n", " ").replace("：", ":").replace("≤", "<=").replace("≥", ">=")
    nf = nf.replace("＜", "<").replace("＞", ">")

    # --- Height ---
    # "Door height <= 2700 mm"
    m = re.search(r'(?:Door\s+)?height\s*:?\s*(?:H\s*)?<=?\s*(\d+)', nf, re.I)
    if m:
        maxH = int(m.group(1))
    # standalone "H <= 2700" (word boundary to avoid matching "width")
    m = re.search(r'(?<![a-zA-Z])H\s*<=?\s*(\d+)', nf)
    if m:
        maxH = int(m.group(1))

    # --- Width ---
    # "Door width <= 500 mm"
    m = re.search(r'(?:Door\s+)?width\s*:?\s*(?:W\s*)?<=?\s*(\d+)', nf, re.I)
    if m:
        maxW = int(m.group(1))
    # standalone "W <= 500"  (word boundary)
    m = re.search(r'(?<![a-zA-Z])W\s*<=?\s*(\d+)', nf)
    if m:
        maxW = int(m.group(1))

    # 350mm < W < 600mm  /  350＜W＜600
    m = re.search(r'(\d+)\s*(?:mm)?\s*<\s*W\s*<\s*(\d+)', nf, re.I)
    if m:
        minW = int(m.group(1))
        maxW = int(m.group(2))

    # 1200 <= W <= 2400
    m = re.search(r'(\d+)\s*(?:mm)?\s*<=?\s*W\s*<=?\s*(\d+)', nf, re.I)
    if m:
        minW = int(m.group(1))
        maxW = int(m.group(2))

    # 1800 <= H <= 3000
    m = re.search(r'(\d+)\s*(?:mm)?\s*<=?\s*(?<![a-zA-Z])H\s*<=?\s*(\d+)', nf)
    if m:
        minH = int(m.group(1))
        maxH = int(m.group(2))

    return {"minW": minW, "maxW": maxW, "minH": minH, "maxH": maxH}


def parse_door_thickness(notes: str):
    if not notes:
        return None
    notes_flat = notes.replace("\n", " ").replace("：", ":")
    m = re.search(r'(?:door|Door)\s*thickness\s*:\s*([\d.]+)', notes_flat)
    if m:
        return float(m.group(1))
    m = re.search(r'D\s*=\s*([\d.]+)', notes_flat)
    if m:
        return float(m.group(1))
    return None


def classify_door_type(dt: str):
    if not dt:
        return "other"
    dt_low = dt.lower().replace("\n", " ")
    if "quartz" in dt_low and "glass" in dt_low:
        return "mixed"
    if "quartz" in dt_low:
        return "aluminum frame quartz stone door"
    if "leather" in dt_low or "fiber" in dt_low:
        return "aluminum frame fiber/leather door"
    if "wood" in dt_low:
        return "aluminum frame wood door"
    if "pivot" in dt_low:
        return "aluminum frame glass pivot door"
    if "slide" in dt_low:
        return "aluminum frame glass slide door"
    if "glass" in dt_low:
        return "aluminum frame glass door"
    return dt.replace("\n", " ").strip()


def infer_allowed_fillers(door_type_raw: str, std_filler: str):
    fillers = set()
    dt = (door_type_raw or "").lower().replace("\n", " ")
    sf = (std_filler or "").lower()
    if "glass" in dt or "G0" in (std_filler or "") or "G3" in (std_filler or ""):
        fillers.add("glass")
    if "quartz" in dt or "quartz" in sf:
        fillers.add("quartz stone")
    if "leather" in dt or "fiber" in dt:
        fillers.add("leather")
    if "wood" in dt:
        fillers.add("wood veneer")
    if not fillers:
        if std_filler and ("G01" in std_filler or "G33" in std_filler):
            fillers.add("glass")
    return sorted(fillers) if fillers else ["glass"]


def parse_allowed_finishing(surface_raw: str, color_raw: str):
    """Derive allowedFinishing list from raw surface/color fields."""
    if not surface_raw:
        return ["anodize", "spraySoftTouch", "sprayMetallic"]
    sf = surface_raw.lower().replace("\n", " ")
    result = []
    if "anod" in sf:
        result.append("anodize")
    if "spray" in sf:
        result.append("spraySoftTouch")
        result.append("sprayMetallic")
    if not result:
        result = ["anodize", "spraySoftTouch", "sprayMetallic"]
    return result


def parse_hardware_colors(c: str):
    if not c:
        return []
    return [x.strip().lower() for x in c.replace("/", ",").split(",") if x.strip()]


def to_ts_val(v):
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, list):
        inner = ", ".join(to_ts_val(x) for x in v)
        return f"[{inner}]"
    s = str(v).replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
    return f"'{s}'"


# ---------------------------------------------------------------------------
# 1. FRAMES (cabinet door)
# ---------------------------------------------------------------------------
cab_rows = raw["cabinet door"]
header_cab = cab_rows[0]
frames = []

for i, row in enumerate(cab_rows[1:], start=1):
    code = row[0]
    if not code:
        continue
    notes = row[15] if len(row) > 15 else None
    door_type_raw = row[6]
    std_filler_raw = row[7]
    thickness_raw = row[11]
    handle_raw = row[3]
    hardware_raw = row[12]
    hw_color_raw = row[13]
    surface_raw = row[4]
    color_raw = row[5]
    price_raw = row[8]

    door_type = classify_door_type(door_type_raw)
    allowed_fillers = infer_allowed_fillers(door_type_raw, std_filler_raw)
    filler_thickness = parse_thickness(thickness_raw) if thickness_raw else []
    size_limits = parse_size_limits(notes)
    door_thickness = parse_door_thickness(notes)
    allowed_finishing = parse_allowed_finishing(surface_raw, color_raw)

    # Specific color codes override (for frames with explicit color codes)
    specific_colors = None
    if color_raw and color_raw != "color swatch colors":
        specific_colors = [c.strip() for c in color_raw.replace("\n", "/").split("/") if c.strip()]

    # standard fillers
    std_fillers = []
    if std_filler_raw and std_filler_raw not in ("\\", "color swatch colors"):
        std_fillers = [s.strip() for s in std_filler_raw.replace("\n", "/").split("/") if s.strip()]

    matched_handle = handle_raw.replace("\n", " ").strip() if handle_raw else None
    matched_hardware = hardware_raw.replace("\n", " ").strip() if hardware_raw else None
    hw_colors = parse_hardware_colors(hw_color_raw)

    frames.append({
        "code": code,
        "doorType": door_type,
        "allowedFillers": allowed_fillers,
        "standardFillers": std_fillers,
        "fillerThicknessLimit": filler_thickness,
        "allowedFinishing": allowed_finishing,
        "specificColors": specific_colors,
        "sizeLimits": size_limits,
        "doorThickness": door_thickness,
        "matchedHandle": matched_handle,
        "matchedHardware": matched_hardware,
        "hardwareColors": hw_colors,
        "picture": None,
    })

# ---------------------------------------------------------------------------
# 2. GLASS
# ---------------------------------------------------------------------------
standard_glass = {"G01", "G33", "G36"}
glass_list = []
for row in raw["glass"][1:]:
    clean = [c for c in row if c is not None]
    if not clean:
        continue
    name = row[0]
    code = row[1]
    craft = row[3] if len(row) > 3 else None
    craft_code = row[4] if len(row) > 4 else None
    thickness_raw = row[5] if len(row) > 5 else None
    silk_screen = row[6] if len(row) > 6 else None

    if not code:
        continue
    thicknesses = parse_thickness(str(thickness_raw)) if thickness_raw else []
    pricing_type = "standard" if code in standard_glass else "custom"

    glass_list.append({
        "code": code,
        "name": name,
        "type": "glass",
        "craft": craft if craft and craft != "\\" else None,
        "craftCode": craft_code if craft_code and craft_code != "\\" else None,
        "thicknesses": thicknesses,
        "silkScreen": True if silk_screen and silk_screen.lower() == "yes" else False,
        "pricingType": pricing_type,
        "priceSqm": None,
        "picture": None,
    })

# ---------------------------------------------------------------------------
# 3. LEATHER
# ---------------------------------------------------------------------------
leather_list = []
for row in raw["leather"][1:]:
    clean = [c for c in row if c is not None]
    if not clean:
        continue
    code = row[0]
    thickness_raw = row[1]
    material_desc = row[4] if len(row) > 4 else row[3] if len(row) > 3 else None

    if not code:
        continue
    thicknesses = parse_thickness(str(thickness_raw)) if thickness_raw else []
    mat_name = ""
    if material_desc:
        m = re.search(r'Front:\s*(.+?)(?:\n|$)', material_desc)
        if m:
            mat_name = m.group(1).strip()

    leather_list.append({
        "code": code,
        "name": mat_name or code,
        "type": "leather",
        "thicknesses": thicknesses,
        "baseMaterial": "Honeycomb Aluminum",
        "pricingType": "custom",
        "picture": None,
    })

# ---------------------------------------------------------------------------
# 4. WOOD VENEER
# ---------------------------------------------------------------------------
wood_list = []
for row in raw["wood veneer"][1:]:
    clean = [c for c in row if c is not None]
    if not clean:
        continue
    code = row[1] if len(row) > 1 else None
    thickness_raw = row[2] if len(row) > 2 else None
    if not code:
        continue
    thicknesses = parse_thickness(str(thickness_raw)) if thickness_raw else []
    wood_list.append({
        "code": code,
        "name": code,
        "type": "woodVeneer",
        "thicknesses": thicknesses,
        "pricingType": "custom",
        "picture": None,
    })

# ---------------------------------------------------------------------------
# 5. QUARTZ STONE
# ---------------------------------------------------------------------------
quartz_list = []
for row in raw["quartz stone"][1:]:
    clean = [c for c in row if c is not None]
    if not clean:
        continue
    name = row[0]
    code = row[2] if len(row) > 2 else None
    surface = row[3] if len(row) > 3 else None
    thickness_raw = row[4] if len(row) > 4 else None
    if not code:
        continue
    thicknesses = parse_thickness(str(thickness_raw).replace("mm", "")) if thickness_raw else []
    quartz_list.append({
        "code": code,
        "name": name,
        "type": "quartzStone",
        "surface": surface,
        "thicknesses": thicknesses,
        "pricingType": "custom",
        "picture": None,
    })

# ---------------------------------------------------------------------------
# 6. SURFACE FINISHES
# ---------------------------------------------------------------------------
anodize_colors = []
for row in raw["Anodized Color"][1:]:
    clean = [c for c in row if c is not None]
    if not clean:
        continue
    name = row[0]
    code = row[1] if len(row) > 1 else None
    if not name:
        continue
    anodize_colors.append({
        "code": code,
        "name": name.replace("\n", " ").strip(),
        "picture": None,
    })

spray_soft_colors = []
for row in raw["Sprayed Soft-Touch Color"][1:]:
    clean = [c for c in row if c is not None]
    if not clean:
        continue
    name = row[0]
    code = row[1] if len(row) > 1 else None
    if not name:
        continue
    spray_soft_colors.append({
        "code": code,
        "name": name.replace("\n", " ").strip(),
        "picture": None,
    })

spray_metallic_colors = []
for row in raw["Sprayed Metallic Color"][1:]:
    clean = [c for c in row if c is not None]
    if not clean:
        continue
    name = row[0]
    code = row[1] if len(row) > 1 else None
    if not name:
        continue
    spray_metallic_colors.append({
        "code": code,
        "name": name.replace("\n", " ").strip(),
        "picture": None,
    })

# ---------------------------------------------------------------------------
# 7. HARDWARE
# ---------------------------------------------------------------------------
hardware_list = []
for row in raw["hardware"][1:]:
    clean = [c for c in row if c is not None]
    if not clean:
        continue
    name = row[0]
    price_raw = row[2] if len(row) > 2 else None
    code = row[3] if len(row) > 3 else None
    color_raw = row[4] if len(row) > 4 else None
    color_code = row[5] if len(row) > 5 else None

    if not name:
        continue

    price = None
    if price_raw:
        m = re.search(r'(\d+)', str(price_raw))
        if m:
            price = int(m.group(1))

    colors = parse_hardware_colors(color_raw) if color_raw else []

    hardware_list.append({
        "code": code,
        "name": name.replace("\n", " ").strip(),
        "allowedColors": colors,
        "pricePerPiece": price,
        "picture": None,
    })

# ---------------------------------------------------------------------------
# 8. HANDLES
# ---------------------------------------------------------------------------
handle_list = []
for row in raw["handle"][1:]:
    clean = [c for c in row if c is not None]
    if not clean:
        continue
    code = row[0]
    if not code:
        continue
    # Header: code(0) | picture(1) | name(2) | ?(3) | surface finishing(4) | color(5)
    name = row[2].replace("\n", " ").strip() if (len(row) > 2 and row[2]) else None
    surface = row[4].replace("\n", " ").strip() if (len(row) > 4 and row[4]) else None
    color = row[5].replace("\n", " ").strip() if (len(row) > 5 and row[5]) else None

    handle_list.append({
        "code": code,
        "name": name or code,
        "surfaceFinishing": surface,
        "allowedColors": ["color swatch colors"] if color == "color swatch colors" else ([color] if color else []),
        "picture": None,
    })


# ---------------------------------------------------------------------------
# GENERATE TypeScript
# ---------------------------------------------------------------------------
def ts_obj(obj, indent=2):
    lines = []
    pad = " " * indent
    for k, v in obj.items():
        if isinstance(v, dict):
            inner = ts_obj(v, indent + 2)
            lines.append(f"{pad}{k}: {inner},")
        elif isinstance(v, list):
            if not v:
                lines.append(f"{pad}{k}: [],")
            elif isinstance(v[0], dict):
                items = ",\n".join(ts_obj(item, indent + 4) for item in v)
                lines.append(f"{pad}{k}: [\n{items}\n{pad}],")
            else:
                inner = ", ".join(to_ts_val(x) for x in v)
                lines.append(f"{pad}{k}: [{inner}],")
        else:
            lines.append(f"{pad}{k}: {to_ts_val(v)},")
    return "{\n" + "\n".join(lines) + "\n" + " " * (indent - 2) + "}"


def ts_array(arr, name, indent=0):
    pad = " " * indent
    items = []
    for obj in arr:
        items.append(ts_obj(obj, indent + 4))
    joined = ",\n".join(items)
    return f"export const {name} = [\n{joined}\n] as const;\n"


def ts_obj_top(groups, name):
    lines = []
    for key, arr in groups.items():
        items = ",\n".join(ts_obj(obj, 6) for obj in arr)
        lines.append(f"  {key}: [\n{items}\n  ],")
    body = "\n".join(lines)
    return f"export const {name} = {{\n{body}\n}} as const;\n"


# Build output
out_parts = []

# ---- Type definitions ----
out_parts.append("""// =============================================================================
// Gainer Door Configurator — Structured Data
// Auto-generated from source Excel: \"318 door information(3).xlsx\"
// =============================================================================

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

export interface SizeLimits {
  minW: number | null;
  maxW: number | null;
  minH: number | null;
  maxH: number | null;
}

export interface Frame {
  code: string;
  doorType: string;
  allowedFillers: string[];
  standardFillers: string[];
  fillerThicknessLimit: number[];
  allowedFinishing: string[];
  specificColors: string[] | null;
  sizeLimits: SizeLimits;
  doorThickness: number | null;
  matchedHandle: string | null;
  matchedHardware: string | null;
  hardwareColors: string[];
  picture: string | null;
}

export interface Glass {
  code: string;
  name: string;
  type: 'glass';
  craft: string | null;
  craftCode: string | null;
  thicknesses: number[];
  silkScreen: boolean;
  pricingType: 'standard' | 'custom';
  priceSqm: number | null;
  picture: string | null;
}

export interface Leather {
  code: string;
  name: string;
  type: 'leather';
  thicknesses: number[];
  baseMaterial: 'Honeycomb Aluminum';
  pricingType: 'custom';
  picture: string | null;
}

export interface WoodVeneer {
  code: string;
  name: string;
  type: 'woodVeneer';
  thicknesses: number[];
  pricingType: 'custom';
  picture: string | null;
}

export interface QuartzStone {
  code: string;
  name: string;
  type: 'quartzStone';
  surface: string | null;
  thicknesses: number[];
  pricingType: 'custom';
  picture: string | null;
}

export type Filler = Glass | Leather | WoodVeneer | QuartzStone;

export interface SurfaceColor {
  code: string | null;
  name: string;
  picture: string | null;
}

export interface SurfaceFinishes {
  anodize: SurfaceColor[];
  spraySoftTouch: SurfaceColor[];
  sprayMetallic: SurfaceColor[];
}

export interface Hardware {
  code: string | null;
  name: string;
  allowedColors: string[];
  pricePerPiece: number | null;
  picture: string | null;
}

export interface Handle {
  code: string;
  name: string;
  surfaceFinishing: string | null;
  allowedColors: string[];
  picture: string | null;
}
""")

# ---- Frames ----
out_parts.append("\n// ---------------------------------------------------------------------------")
out_parts.append("// 1. Frames (Cabinet Doors)")
out_parts.append("// ---------------------------------------------------------------------------\n")
out_parts.append(ts_array(frames, "frames"))

# ---- Glass ----
out_parts.append("\n// ---------------------------------------------------------------------------")
out_parts.append("// 2. Glass Fillers")
out_parts.append("// ---------------------------------------------------------------------------\n")
out_parts.append(ts_array(glass_list, "glassList"))

# ---- Leather ----
out_parts.append("\n// ---------------------------------------------------------------------------")
out_parts.append("// 3. Leather Fillers (baseMaterial: Honeycomb Aluminum)")
out_parts.append("// ---------------------------------------------------------------------------\n")
out_parts.append(ts_array(leather_list, "leatherList"))

# ---- Wood Veneer ----
out_parts.append("\n// ---------------------------------------------------------------------------")
out_parts.append("// 4. Wood Veneer Fillers")
out_parts.append("// ---------------------------------------------------------------------------\n")
out_parts.append(ts_array(wood_list, "woodVeneerList"))

# ---- Quartz Stone ----
out_parts.append("\n// ---------------------------------------------------------------------------")
out_parts.append("// 5. Quartz Stone Fillers")
out_parts.append("// ---------------------------------------------------------------------------\n")
out_parts.append(ts_array(quartz_list, "quartzStoneList"))

# ---- Surface Finishes ----
out_parts.append("\n// ---------------------------------------------------------------------------")
out_parts.append("// 6. Surface Finishes")
out_parts.append("// ---------------------------------------------------------------------------\n")
out_parts.append(ts_obj_top({
    "anodize": anodize_colors,
    "spraySoftTouch": spray_soft_colors,
    "sprayMetallic": spray_metallic_colors,
}, "surfaceFinishes"))

# ---- Hardware ----
out_parts.append("\n// ---------------------------------------------------------------------------")
out_parts.append("// 7. Hardware (Hinges & Accessories)")
out_parts.append("// ---------------------------------------------------------------------------\n")
out_parts.append(ts_array(hardware_list, "hardwareList"))

# ---- Handles ----
out_parts.append("\n// ---------------------------------------------------------------------------")
out_parts.append("// 8. Handles")
out_parts.append("// ---------------------------------------------------------------------------\n")
out_parts.append(ts_array(handle_list, "handleList"))

# ---- Aggregate filler map ----
out_parts.append("""
// ---------------------------------------------------------------------------
// 9. Filler Lookup Map (for state machine filtering)
// ---------------------------------------------------------------------------

export const fillerMap = {
  glass: glassList,
  leather: leatherList,
  woodVeneer: woodVeneerList,
  quartzStone: quartzStoneList,
} as const;
""")

# ---- State-machine filter helpers ----
out_parts.append("""
// ---------------------------------------------------------------------------
// 10. State-Machine Filtering Logic
// ---------------------------------------------------------------------------

export function getAvailableFrames(w: number, h: number): (Frame & { disabled: boolean })[] {
  return frames.map((frame) => {
    const { minW, maxW, minH, maxH } = frame.sizeLimits;
    const disabled =
      (minW !== null && w < minW) ||
      (maxW !== null && w > maxW) ||
      (minH !== null && h < minH) ||
      (maxH !== null && h > maxH);
    return { ...frame, disabled };
  });
}

export function getAvailableFinishes(frame: Frame): SurfaceFinishes {
  const allowed = frame.allowedFinishing;
  return {
    anodize: allowed.includes('anodize') ? [...surfaceFinishes.anodize] : [],
    spraySoftTouch: allowed.includes('spraySoftTouch') ? [...surfaceFinishes.spraySoftTouch] : [],
    sprayMetallic: allowed.includes('sprayMetallic') ? [...surfaceFinishes.sprayMetallic] : [],
  };
}

export function getAvailableFillers(frame: Frame) {
  const allowedTypes = frame.allowedFillers;
  const thicknessLimit = frame.fillerThicknessLimit;

  const result: Filler[] = [];

  if (allowedTypes.includes('glass')) {
    for (const g of glassList) {
      const validThicknesses = thicknessLimit.length > 0
        ? g.thicknesses.filter((t) => thicknessLimit.includes(t))
        : g.thicknesses;
      if (validThicknesses.length > 0) {
        result.push({ ...g, thicknesses: validThicknesses });
      }
    }
  }

  if (allowedTypes.includes('leather')) {
    result.push(...leatherList);
  }

  if (allowedTypes.includes('wood veneer') || allowedTypes.includes('woodVeneer')) {
    result.push(...woodVeneerList);
  }

  if (allowedTypes.includes('quartz stone') || allowedTypes.includes('quartzStone')) {
    result.push(...quartzStoneList);
  }

  return result;
}

export function getMatchedHandle(frame: Frame): Handle | null {
  if (!frame.matchedHandle) return null;
  const handleName = frame.matchedHandle.toLowerCase();
  return (handleList.find(
    (h) => h.code.toLowerCase() === handleName || h.name.toLowerCase() === handleName
  ) ?? null) as Handle | null;
}

export function getMatchedHandles(frame: Frame): Handle[] {
  if (!frame.matchedHandle) return [];
  const raw = frame.matchedHandle;
  const codes = raw.split(/[\\n\\/]/).map((s) => s.trim().toLowerCase()).filter(Boolean);
  return handleList.filter(
    (h) => codes.some((c) => h.code.toLowerCase() === c || h.name.toLowerCase().includes(c))
  );
}

export function calculateHingeQty(heightMm: number): { qty: number; usePivot: boolean } {
  if (heightMm <= 2000) return { qty: 2, usePivot: false };
  if (heightMm <= 2500) return { qty: 4, usePivot: false };
  return { qty: 0, usePivot: true };
}
""")

# Write final file
output = "\n".join(out_parts)
with open("src/data.ts", "w", encoding="utf-8") as f:
    f.write(output)

print(f"Generated data.ts")
print(f"  Frames: {len(frames)}")
print(f"  Glass:  {len(glass_list)}")
print(f"  Leather: {len(leather_list)}")
print(f"  Wood Veneer: {len(wood_list)}")
print(f"  Quartz Stone: {len(quartz_list)}")
print(f"  Anodized Colors: {len(anodize_colors)}")
print(f"  Spray Soft-Touch: {len(spray_soft_colors)}")
print(f"  Spray Metallic: {len(spray_metallic_colors)}")
print(f"  Hardware: {len(hardware_list)}")
print(f"  Handles: {len(handle_list)}")
