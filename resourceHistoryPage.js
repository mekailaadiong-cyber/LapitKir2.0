import { FACILITIES } from "./data.js";

let state = { typeFilter: "All", facilityFilter: "All", search: "" };

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) + " " + d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
}

const TYPE_COLORS = { Medicine: "bg-blue-100 text-blue-700", Bed: "bg-emerald-100 text-emerald-700", Equipment: "bg-amber-100 text-amber-700", Service: "bg-purple-100 text-purple-700" };

function renderContent(resourceUpdates) {
  const sorted = [...resourceUpdates].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const q = state.search.toLowerCase();
  const filtered = sorted.filter(u => {
    const matchesSearch = !q || u.resourceName.toLowerCase().includes(q) || u.updatedByName.toLowerCase().includes(q);
    const matchesType = state.typeFilter === "All" || u.resourceType === state.typeFilter;
    const matchesFacility = state.facilityFilter === "All" || u.facilityId === state.facilityFilter;
    return matchesSearch && matchesType && matchesFacility;
  });

  const rows = filtered.length === 0
    ? `<tr><td colspan="7" class="px-5 py-10 text-center text-slate-400 text-sm">No records found.</td></tr>`
    : filtered.map(u => `
        <tr class="hover:bg-slate-50">
          <td class="px-5 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">${formatTime(u.timestamp)}</td>
          <td class="px-4 py-3"><span class="text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[u.resourceType] ?? "bg-slate-100 text-slate-600"}">${u.resourceType}</span></td>
          <td class="px-4 py-3 font-medium text-slate-800">${u.resourceName}</td>
          <td class="px-4 py-3 text-slate-600 text-xs">${u.facilityName}</td>
          <td class="px-4 py-3"><div class="flex items-center gap-2 text-xs"><span class="bg-red-50 text-red-700 border border-red-200 rounded px-1.5 py-0.5">${u.previousValue}</span><svg viewBox="0 0 24 24" class="w-3 h-3 fill-slate-400 flex-shrink-0"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg><span class="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-1.5 py-0.5">${u.newValue}</span></div><p class="text-xs text-slate-400 mt-0.5">${u.field}</p></td>
          <td class="px-4 py-3 text-slate-600 text-xs">${u.updatedByName}</td>
          <td class="px-4 py-3 text-xs text-slate-400 max-w-[180px] truncate">${u.notes || "—"}</td>
        </tr>`).join("");

  return `
    <div class="bg-white rounded-xl shadow-sm overflow-hidden" style="border:1px solid var(--border)">
      <div class="overflow-x-auto"><table class="w-full text-sm">
        <thead><tr class="border-b bg-slate-50" style="border-color:var(--border)">
          <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Timestamp</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Resource</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Facility</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Change</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Updated By</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</th>
        </tr></thead>
        <tbody class="divide-y" style="border-color:var(--border)">${rows}</tbody>
      </table></div>
    </div>`;
}

export function renderResourceHistoryPage() {
  return `
    <div class="space-y-5">
      <div class="bg-white rounded-xl shadow-sm p-4" style="border:1px solid var(--border)">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1 relative">
            <svg viewBox="0 0 24 24" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 fill-slate-400"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input id="rh-search" value="${state.search}" placeholder="Search by resource or staff name..." class="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" />
          </div>
          <select id="rh-type" class="px-3 py-2.5 border rounded-lg text-sm focus:outline-none bg-white" style="border-color:var(--border)">${["All", "Medicine", "Bed", "Equipment", "Service"].map(t => `<option ${state.typeFilter === t ? "selected" : ""}>${t}</option>`).join("")}</select>
          <select id="rh-facility" class="px-3 py-2.5 border rounded-lg text-sm focus:outline-none bg-white" style="border-color:var(--border)"><option value="All" ${state.facilityFilter === "All" ? "selected" : ""}>All Facilities</option>${FACILITIES.map(f => `<option value="${f.id}" ${state.facilityFilter === f.id ? "selected" : ""}>${f.name}</option>`).join("")}</select>
        </div>
      </div>
      <div id="rh-content"></div>
    </div>`;
}

export function attachResourceHistoryEvents({ resourceUpdates }) {
  function rerender() {
    const el = document.getElementById("rh-content");
    if (el) el.innerHTML = renderContent(resourceUpdates);
  }
  document.getElementById("rh-search")?.addEventListener("input", e => { state.search = e.target.value; rerender(); });
  document.getElementById("rh-type")?.addEventListener("change", e => { state.typeFilter = e.target.value; rerender(); });
  document.getElementById("rh-facility")?.addEventListener("change", e => { state.facilityFilter = e.target.value; rerender(); });
  rerender();
}
