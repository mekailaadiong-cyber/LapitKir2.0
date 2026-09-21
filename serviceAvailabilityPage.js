import { SERVICES, FACILITIES } from "./data.js";
import { statusBadge } from "./statusBadge.js";

let state = { search: "", categoryFilter: "All", facilityFilter: "All", statusFilter: "All" };
const CATEGORY_ICON = { Outpatient: "🩺", Preventive: "💉", "Reproductive Health": "👶", Diagnostic: "🔬", "Communicable Disease": "🦠", Dental: "🦷", Emergency: "🚑" };

function facilityMap() { return Object.fromEntries(FACILITIES.map(f => [f.id, f.name])); }

function computeFiltered() {
  const q = state.search.toLowerCase();
  return SERVICES.filter(svc => {
    const matchesSearch = !q || svc.name.toLowerCase().includes(q) || svc.description.toLowerCase().includes(q);
    const matchesCategory = state.categoryFilter === "All" || svc.category === state.categoryFilter;
    const matchesFacility = state.facilityFilter === "All" || svc.facilities.some(f => f.facilityId === state.facilityFilter);
    const matchesStatus = state.statusFilter === "All" || svc.facilities.some(f => f.status === state.statusFilter);
    return matchesSearch && matchesCategory && matchesFacility && matchesStatus;
  });
}

function renderContent() {
  const filtered = computeFiltered();
  const fMap = facilityMap();
  const cards = filtered.map(svc => {
    const displayFacilities = svc.facilities.filter(f =>
      (state.facilityFilter === "All" || f.facilityId === state.facilityFilter) &&
      (state.statusFilter === "All" || f.status === state.statusFilter));
    if (displayFacilities.length === 0) return "";
    const rows = displayFacilities.map(fac => `
      <tr class="hover:bg-slate-50">
        <td class="px-5 py-3 font-medium text-slate-700">${fMap[fac.facilityId] ?? fac.facilityId}</td>
        <td class="px-4 py-3">${statusBadge(fac.status, { dot: true })}</td>
        <td class="px-4 py-3 text-xs text-slate-600">${fac.schedule || "—"}</td>
        <td class="px-4 py-3 text-xs text-slate-600">${fac.personnel || "—"}</td>
        <td class="px-4 py-3 text-xs text-slate-400 max-w-[200px]">${fac.notes || "—"}</td>
      </tr>`).join("");
    return `
      <div class="bg-white rounded-xl shadow-sm overflow-hidden" style="border:1px solid var(--border)">
        <div class="px-5 py-4 border-b" style="border-color:var(--border)">
          <div class="flex items-start gap-3">
            <span class="text-2xl">${CATEGORY_ICON[svc.category] ?? "🏥"}</span>
            <div><h3 class="font-['Outfit'] font-semibold text-slate-800 text-base">${svc.name}</h3><p class="text-xs text-slate-500 mt-0.5">${svc.category} · ${svc.description}</p></div>
          </div>
        </div>
        <div class="overflow-x-auto"><table class="w-full text-sm">
          <thead><tr class="border-b bg-slate-50" style="border-color:var(--border)">
            <th class="text-left px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Facility</th>
            <th class="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
            <th class="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Schedule</th>
            <th class="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Personnel</th>
            <th class="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</th>
          </tr></thead>
          <tbody class="divide-y" style="border-color:var(--border)">${rows}</tbody>
        </table></div>
      </div>`;
  }).filter(Boolean).join("");
  return `<div class="space-y-4">${cards || `<div class="bg-white rounded-xl p-10 text-center text-slate-400 text-sm shadow-sm" style="border:1px solid var(--border)">No services match.</div>`}</div>`;
}

export function renderServiceAvailabilityPage() {
  const categories = ["All", ...new Set(SERVICES.map(s => s.category))];
  return `
    <div class="space-y-5">
      <div class="bg-white rounded-xl shadow-sm p-4" style="border:1px solid var(--border)">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1 relative">
            <svg viewBox="0 0 24 24" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 fill-slate-400"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input id="svc-search" placeholder="Search services..." class="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" />
          </div>
          <select id="svc-category" class="px-3 py-2.5 border rounded-lg text-sm focus:outline-none bg-white" style="border-color:var(--border)">${categories.map(c => `<option>${c}</option>`).join("")}</select>
          <select id="svc-facility" class="px-3 py-2.5 border rounded-lg text-sm focus:outline-none bg-white" style="border-color:var(--border)"><option value="All">All Facilities</option>${FACILITIES.map(f => `<option value="${f.id}">${f.name}</option>`).join("")}</select>
          <select id="svc-status" class="px-3 py-2.5 border rounded-lg text-sm focus:outline-none bg-white" style="border-color:var(--border)">${["All", "Available", "Limited", "Unavailable"].map(s => `<option>${s}</option>`).join("")}</select>
        </div>
      </div>
      <div id="svc-content"></div>
    </div>`;
}

export function attachServiceAvailabilityEvents() {
  function rerender() {
    const el = document.getElementById("svc-content");
    if (el) el.innerHTML = renderContent();
  }
  document.getElementById("svc-search")?.addEventListener("input", e => { state.search = e.target.value; rerender(); });
  document.getElementById("svc-category")?.addEventListener("change", e => { state.categoryFilter = e.target.value; rerender(); });
  document.getElementById("svc-facility")?.addEventListener("change", e => { state.facilityFilter = e.target.value; rerender(); });
  document.getElementById("svc-status")?.addEventListener("change", e => { state.statusFilter = e.target.value; rerender(); });
  rerender();
}
