// FacilityDirectoryPage — direct port of FacilityDirectoryPage.tsx.
// Keeps its own local state (search/filters/view) and re-renders only the
// results region on change, so filter inputs don't lose focus/value.

import { createFacilityMap } from "./facilityMap.js";

const OP_COLORS = {
  Open: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Limited: "bg-amber-100 text-amber-800 border-amber-200",
  Closed: "bg-red-100 text-red-800 border-red-200",
};
const OP_DOT = { Open: "bg-emerald-500", Limited: "bg-amber-500", Closed: "bg-red-500" };

const ALL_SPECIALTIES = [
  "All", "Primary Care", "Maternal Health", "Immunization",
  "Emergency Medicine", "Laboratory", "Communicable Disease",
  "Pediatrics", "OB-GYN", "Surgery", "Internal Medicine", "Dental",
];

let state = { search: "", typeFilter: "All", statusFilter: "All", specialtyFilter: "All", barangayFilter: "All", viewMode: "list", selectedId: null };
let mapHandle = null;
let facilitiesRef = [];

function computeFiltered() {
  const q = state.search.toLowerCase();
  return facilitiesRef.filter(f => {
    const matchesSearch = !q ||
      f.name.toLowerCase().includes(q) || f.address.toLowerCase().includes(q) ||
      f.barangay.toLowerCase().includes(q) ||
      f.services.some(s => s.toLowerCase().includes(q)) ||
      f.specialties.some(s => s.toLowerCase().includes(q));
    const matchesType = state.typeFilter === "All" || f.type === state.typeFilter;
    const matchesStatus = state.statusFilter === "All" ||
      (state.statusFilter === "Emergency" && f.emergency) ||
      (state.statusFilter !== "Emergency" && f.operationalStatus === state.statusFilter);
    const matchesSpecialty = state.specialtyFilter === "All" || f.specialties.includes(state.specialtyFilter);
    const matchesBarangay = state.barangayFilter === "All" || f.barangay === state.barangayFilter;
    return matchesSearch && matchesType && matchesStatus && matchesSpecialty && matchesBarangay;
  });
}

function renderCard(f) {
  const statusBarClass = f.operationalStatus === "Open" ? "bg-emerald-600 text-white" : f.operationalStatus === "Limited" ? "bg-amber-500 text-white" : "bg-red-600 text-white";
  const queueTag = (f.operationalStatus !== "Closed" && f.queueCount > 0)
    ? `<span class="opacity-90">🔢 ${f.queueCount} · ~${f.estimatedWaitMinutes}m wait</span>` : "";
  const noticeBox = (f.emergencyNote || f.operationalStatus !== "Open") ? `
    <div class="rounded-lg px-3 py-2 mb-3 text-xs ${f.emergency ? "bg-red-50 border border-red-200 text-red-700" : f.operationalStatus === "Limited" ? "bg-amber-50 border border-amber-200 text-amber-700" : "bg-red-50 border border-red-200 text-red-700"}">
      ${f.emergencyNote ?? (f.operationalStatus === "Limited" ? "Operating with limited capacity." : "Currently closed.")}
    </div>` : "";
  const specialties = f.specialties.map(s => `<span class="text-xs bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full">${s}</span>`).join("");
  const services = f.services.map(s => `<span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">${s}</span>`).join("");

  return `
    <div class="card-hover bg-white rounded-xl shadow-sm overflow-hidden ${f.emergency ? "ring-2 ring-red-500" : ""}" style="border:1px solid var(--border)">
      <div class="px-4 py-1.5 flex items-center justify-between text-xs font-semibold ${statusBarClass}">
        <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-white/70"></span>${f.emergency ? "🚨 EMERGENCY" : f.operationalStatus.toUpperCase()}</span>
        ${queueTag}
      </div>
      <div class="p-5">
        <h3 class="font-['Outfit'] font-semibold text-slate-800 text-base leading-snug">${f.name}</h3>
        <p class="text-xs text-slate-500 mt-0.5 mb-2">${f.type} · ${f.barangay}</p>
        ${noticeBox}
        <div class="space-y-1.5 text-xs text-slate-600 mb-4">
          <div class="flex gap-2"><span class="text-slate-400 w-4">📍</span><span>${f.address}</span></div>
          <div class="flex gap-2"><span class="text-slate-400 w-4">📞</span><span class="font-mono">${f.phone}</span></div>
          <div class="flex gap-2"><span class="text-slate-400 w-4">✉️</span><span class="truncate">${f.email}</span></div>
          <div class="flex gap-2"><span class="text-slate-400 w-4">🕐</span><span>${f.hours}</span></div>
        </div>
        <div class="mb-3">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Specialties</p>
          <div class="flex flex-wrap gap-1">${specialties}</div>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Services</p>
          <div class="flex flex-wrap gap-1">${services}</div>
        </div>
        <button data-view-map="${f.id}" class="mt-4 flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-800 font-medium">
          <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>
          View on Map
        </button>
      </div>
    </div>`;
}

function renderMiniCard(f) {
  const isSelected = state.selectedId === f.id;
  return `
    <button data-select-facility="${f.id}" class="text-left bg-white rounded-xl p-4 shadow-sm transition-all flex-shrink-0 ${isSelected ? "ring-2 ring-violet-500" : "hover:shadow-md"}"
      style="border:1px solid ${isSelected ? "transparent" : f.emergency ? "#fca5a5" : "var(--border)"}">
      <div class="flex items-start justify-between gap-2 mb-1.5">
        <div class="flex items-center gap-2 min-w-0">
          <span class="w-2 h-2 rounded-full flex-shrink-0 ${OP_DOT[f.operationalStatus]}"></span>
          <p class="font-semibold text-slate-800 text-sm leading-snug truncate">${f.name}</p>
        </div>
        <span class="text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${OP_COLORS[f.operationalStatus]}">${f.operationalStatus}</span>
      </div>
      <p class="text-xs text-slate-400">📍 ${f.barangay}</p>
      ${f.queueCount > 0 ? `<p class="text-xs text-slate-500 mt-0.5">🔢 ${f.queueCount} in queue · ~${f.estimatedWaitMinutes} min</p>` : ""}
    </button>`;
}

function renderResults(filtered) {
  if (state.viewMode === "map") {
    return `
      <div class="grid lg:grid-cols-3 gap-4" style="min-height:520px">
        <div class="lg:col-span-2 rounded-xl overflow-hidden shadow-sm" style="height:520px;border:1px solid var(--border)">
          <div id="facility-map-el" style="height:100%"></div>
        </div>
        <div class="flex flex-col gap-2 overflow-y-auto" style="max-height:520px">
          <div class="bg-white rounded-xl p-3 flex flex-wrap gap-3 text-xs" style="border:1px solid var(--border)">
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-emerald-500"></span><span class="text-slate-600">Open</span></span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-amber-500"></span><span class="text-slate-600">Limited</span></span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-red-600"></span><span class="text-slate-600">Emergency / Closed</span></span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-violet-600"></span><span class="text-slate-600">Selected</span></span>
          </div>
          ${filtered.map(renderMiniCard).join("") || `<div class="bg-white rounded-xl p-6 text-center text-slate-400 text-sm" style="border:1px solid var(--border)">No facilities match.</div>`}
        </div>
      </div>`;
  }

  if (filtered.length === 0) {
    return `
      <div class="bg-white rounded-xl p-12 text-center shadow-sm" style="border:1px solid var(--border)">
        <p class="text-4xl mb-3">🏥</p>
        <p class="text-slate-500 text-sm">No facilities match your search criteria.</p>
      </div>`;
  }
  return `<div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">${filtered.map(renderCard).join("")}</div>`;
}

function renderFilterBar(types, barangays) {
  const hasFilters = state.search || state.typeFilter !== "All" || state.statusFilter !== "All" || state.specialtyFilter !== "All" || state.barangayFilter !== "All";
  return `
    <div class="bg-white rounded-xl shadow-sm p-4" style="border:1px solid var(--border)">
      <div class="flex gap-3 mb-3">
        <div class="flex-1 relative">
          <svg viewBox="0 0 24 24" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 fill-slate-400"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input id="fac-search" value="${state.search}" placeholder="Search by name, barangay, or service..."
            class="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" />
        </div>
        <div class="flex rounded-lg overflow-hidden border flex-shrink-0" style="border-color:var(--border)">
          <button data-view="list" class="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${state.viewMode === "list" ? "bg-sky-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}">
            <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
            <span class="hidden sm:inline">List</span>
          </button>
          <button data-view="map" class="flex items-center gap-2 px-3 py-2 text-sm font-medium border-l transition-colors ${state.viewMode === "map" ? "bg-sky-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}" style="border-left-color:var(--border)">
            <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>
            <span class="hidden sm:inline">Map</span>
          </button>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <select id="fac-type" class="px-3 py-1.5 border rounded-lg text-xs focus:outline-none bg-white font-medium" style="border-color:var(--border)">
          ${types.map(t => `<option ${state.typeFilter === t ? "selected" : ""}>${t}</option>`).join("")}
        </select>
        <select id="fac-status" class="px-3 py-1.5 border rounded-lg text-xs focus:outline-none bg-white font-medium" style="border-color:var(--border)">
          ${["All", "Open", "Limited", "Closed", "Emergency"].map(s => `<option value="${s}" ${state.statusFilter === s ? "selected" : ""}>${s === "All" ? "All Status" : s}</option>`).join("")}
        </select>
        <select id="fac-specialty" class="px-3 py-1.5 border rounded-lg text-xs focus:outline-none bg-white font-medium" style="border-color:var(--border)">
          ${ALL_SPECIALTIES.map(s => `<option ${state.specialtyFilter === s ? "selected" : ""}>${s === "All" ? "All Specialties" : s}</option>`).join("")}
        </select>
        <select id="fac-barangay" class="px-3 py-1.5 border rounded-lg text-xs focus:outline-none bg-white font-medium" style="border-color:var(--border)">
          ${barangays.map(b => `<option ${state.barangayFilter === b ? "selected" : ""}>${b === "All" ? "All Barangays" : b}</option>`).join("")}
        </select>
        ${hasFilters ? `<button id="fac-clear" class="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 font-medium">Clear filters ✕</button>` : ""}
      </div>
      <p id="fac-count" class="text-xs text-slate-400 mt-2"></p>
    </div>`;
}

export function renderFacilityDirectoryPage({ facilities }) {
  facilitiesRef = facilities;
  const types = ["All", ...new Set(facilities.map(f => f.type))];
  const barangays = ["All", ...[...new Set(facilities.map(f => f.barangay))].sort()];
  return `
    <div class="space-y-4">
      ${renderFilterBar(types, barangays)}
      <div id="fac-results"></div>
    </div>`;
}

function updateCount(filtered) {
  const el = document.getElementById("fac-count");
  if (el) el.textContent = `${filtered.length} facilit${filtered.length === 1 ? "y" : "ies"} found in Pagadian City`;
}

function rerenderResults() {
  const filtered = computeFiltered();
  const container = document.getElementById("fac-results");
  if (!container) return;
  if (mapHandle) { mapHandle.destroy(); mapHandle = null; }
  container.innerHTML = renderResults(filtered);
  updateCount(filtered);

  if (state.viewMode === "map") {
    const el = document.getElementById("facility-map-el");
    if (el) {
      mapHandle = createFacilityMap(el, filtered, (id) => { state.selectedId = id; rerenderResults(); });
      if (state.selectedId) mapHandle.setSelected(state.selectedId);
    }
    container.querySelectorAll("[data-select-facility]").forEach(btn => {
      btn.addEventListener("click", () => { state.selectedId = btn.dataset.selectFacility; rerenderResults(); });
    });
  } else {
    container.querySelectorAll("[data-view-map]").forEach(btn => {
      btn.addEventListener("click", () => { state.selectedId = btn.dataset.viewMap; state.viewMode = "map"; rerenderTop(); });
    });
  }
}

function rerenderTop() {
  // Re-render filter bar (for view toggle highlight) + results together.
  const types = ["All", ...new Set(facilitiesRef.map(f => f.type))];
  const barangays = ["All", ...[...new Set(facilitiesRef.map(f => f.barangay))].sort()];
  const container = document.getElementById("fac-results")?.parentElement;
  if (container) {
    container.innerHTML = `${renderFilterBar(types, barangays)}<div id="fac-results"></div>`;
    attachFilterEvents();
    rerenderResults();
  }
}

function attachFilterEvents() {
  document.getElementById("fac-search")?.addEventListener("input", (e) => { state.search = e.target.value; rerenderResults(); });
  document.getElementById("fac-type")?.addEventListener("change", (e) => { state.typeFilter = e.target.value; rerenderResults(); });
  document.getElementById("fac-status")?.addEventListener("change", (e) => { state.statusFilter = e.target.value; rerenderResults(); });
  document.getElementById("fac-specialty")?.addEventListener("change", (e) => { state.specialtyFilter = e.target.value; rerenderResults(); });
  document.getElementById("fac-barangay")?.addEventListener("change", (e) => { state.barangayFilter = e.target.value; rerenderResults(); });
  document.getElementById("fac-clear")?.addEventListener("click", () => {
    state.search = ""; state.typeFilter = "All"; state.statusFilter = "All"; state.specialtyFilter = "All"; state.barangayFilter = "All";
    rerenderTop();
  });
  document.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => { state.viewMode = btn.dataset.view; rerenderTop(); });
  });
}

export function attachFacilityDirectoryEvents() {
  attachFilterEvents();
  rerenderResults();
}
