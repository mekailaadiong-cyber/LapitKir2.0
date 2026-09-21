// FacilityMap — Leaflet map with custom pins, popups. Direct port of FacilityMap.tsx
// (Leaflet itself is already vanilla JS, so this needed the least conversion.)

const ICON_COLORS = {
  Open: { bg: "#16a34a", border: "#14532d" },
  Limited: { bg: "#d97706", border: "#78350f" },
  Closed: { bg: "#dc2626", border: "#7f1d1d" },
  Emergency: { bg: "#dc2626", border: "#7f1d1d" },
  Selected: { bg: "#7c3aed", border: "#4c1d95" },
};

const TYPE_ABBR = {
  "Barangay Health Center": "BHC",
  "City Health Office": "CHO",
  "Rural Health Unit": "RHU",
  "District Hospital": "DH",
  "Lying-in Clinic": "LIC",
};

function makeIcon(color, label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 52" width="40" height="52">
      <path d="M20 2C12.27 2 6 8.27 6 16c0 11 14 34 14 34s14-23 14-34C34 8.27 27.73 2 20 2z"
        fill="${color.bg}" stroke="${color.border}" stroke-width="1.5"/>
      <circle cx="20" cy="16" r="9" fill="white" opacity="0.92"/>
      <text x="20" y="20" text-anchor="middle" font-family="'Outfit',sans-serif" font-size="9"
        font-weight="700" fill="${color.border}">${label}</text>
    </svg>`;
  return L.divIcon({ className: "", html: svg, iconSize: [40, 52], iconAnchor: [20, 52], popupAnchor: [0, -54] });
}

function resolveColor(facility, isSelected) {
  if (isSelected) return ICON_COLORS.Selected;
  if (facility.emergency) return ICON_COLORS.Emergency;
  return ICON_COLORS[facility.operationalStatus] ?? ICON_COLORS.Open;
}

function buildPopup(f) {
  const opBg = f.emergency ? "#dc2626" : f.operationalStatus === "Open" ? "#16a34a" : f.operationalStatus === "Limited" ? "#d97706" : "#dc2626";
  const opLabel = f.emergency ? "🚨 EMERGENCY" : f.operationalStatus.toUpperCase();
  const queueRow = f.operationalStatus !== "Closed" && f.queueCount > 0
    ? `<div style="font-size:11px;color:#475569;margin-bottom:4px;">🔢 ${f.queueCount} in queue · ~${f.estimatedWaitMinutes} min wait</div>` : "";
  const noticeRow = f.emergencyNote
    ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:6px 8px;font-size:11px;color:#b91c1c;margin-bottom:8px;">${f.emergencyNote}</div>` : "";
  const specialties = (f.specialties || []).map(s =>
    `<span style="background:#eff6ff;color:#1d4ed8;font-size:10px;padding:2px 6px;border-radius:999px;border:1px solid #bfdbfe;">${s}</span>`
  ).join(" ");

  return `<div style="font-family:'Inter',sans-serif;min-width:230px;">
    <div style="background:${opBg};color:white;padding:5px 12px;font-size:11px;font-weight:700;letter-spacing:0.05em;">${opLabel}</div>
    <div style="padding:12px;">
      <div style="font-family:'Outfit',sans-serif;font-weight:700;font-size:13px;color:#0f172a;margin-bottom:2px;">${f.name}</div>
      <div style="font-size:11px;color:#64748b;margin-bottom:8px;">${f.type} · ${f.barangay}</div>
      ${noticeRow}${queueRow}
      <div style="font-size:11px;color:#475569;margin-bottom:3px;">📍 ${f.address}</div>
      <div style="font-size:11px;color:#475569;margin-bottom:3px;">📞 ${f.phone}</div>
      <div style="font-size:11px;color:#475569;margin-bottom:8px;">🕐 ${f.hours}</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;">${specialties}</div>
    </div>
  </div>`;
}

// Creates a map instance inside `container` (a DOM element or id string).
// Returns { setSelected(id), destroy() } so the caller can control it.
export function createFacilityMap(container, facilities, onSelect) {
  const el = typeof container === "string" ? document.getElementById(container) : container;
  if (!el) return null;

  const map = L.map(el, { center: [7.8279, 123.4366], zoom: 13, zoomControl: true, scrollWheelZoom: true });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  const markers = {};
  let selectedId = null;

  facilities.forEach(facility => {
    if (!facility.lat || !facility.lng) return;
    const abbr = TYPE_ABBR[facility.type] ?? "HC";
    const marker = L.marker([facility.lat, facility.lng], { icon: makeIcon(resolveColor(facility, false), abbr) })
      .addTo(map).bindPopup(buildPopup(facility), { maxWidth: 270 });
    marker.on("click", () => onSelect?.(facility.id));
    markers[facility.id] = marker;
  });

  function setSelected(id) {
    selectedId = id;
    facilities.forEach(facility => {
      if (!facility.lat || !facility.lng) return;
      const marker = markers[facility.id];
      if (!marker) return;
      const abbr = TYPE_ABBR[facility.type] ?? "HC";
      const isSelected = facility.id === id;
      marker.setIcon(makeIcon(resolveColor(facility, isSelected), abbr));
      if (isSelected) {
        map.flyTo([facility.lat, facility.lng], 15, { duration: 0.8 });
        marker.openPopup();
      }
    });
  }

  return { setSelected, destroy: () => map.remove() };
}
