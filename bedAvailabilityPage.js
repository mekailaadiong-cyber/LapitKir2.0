import { BEDS, FACILITIES } from "./data.js";

let state = { facilityFilter: "All", typeFilter: "All" };

function facilityName(id) { return FACILITIES.find(f => f.id === id)?.name ?? id; }

function computeFiltered() {
  return BEDS.filter(b =>
    (state.facilityFilter === "All" || b.facilityId === state.facilityFilter) &&
    (state.typeFilter === "All" || b.type === state.typeFilter)
  );
}

function renderContent() {
  const filtered = computeFiltered();
  const totalBeds = filtered.reduce((s, b) => s + b.total, 0);
  const totalAvail = filtered.reduce((s, b) => s + b.available, 0);
  const totalOccupied = filtered.reduce((s, b) => s + b.occupied, 0);
  const occupancyPct = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0;

  const stats = `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-2xl text-slate-800">${totalBeds}</p><p class="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">Total Beds</p></div>
      <div class="bg-white rounded-xl p-4 shadow-sm" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-2xl text-emerald-600">${totalAvail}</p><p class="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">Available</p></div>
      <div class="bg-white rounded-xl p-4 shadow-sm" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-2xl text-amber-600">${totalOccupied}</p><p class="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">Occupied</p></div>
      <div class="bg-white rounded-xl p-4 shadow-sm" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-2xl ${occupancyPct > 70 ? "text-red-600" : "text-slate-700"}">${occupancyPct}%</p><p class="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">Occupancy Rate</p></div>
    </div>`;

  const grouped = {};
  filtered.forEach(bed => { (grouped[bed.facilityId] ??= []).push(bed); });

  const groups = Object.entries(grouped).map(([facId, beds]) => `
    <div class="bg-white rounded-xl shadow-sm overflow-hidden" style="border:1px solid var(--border)">
      <div class="px-5 py-4 border-b bg-slate-50" style="border-color:var(--border)">
        <h3 class="font-['Outfit'] font-semibold text-slate-800">${facilityName(facId)}</h3>
        <p class="text-xs text-slate-500 mt-0.5">${beds.reduce((s, b) => s + b.available, 0)} of ${beds.reduce((s, b) => s + b.total, 0)} beds available</p>
      </div>
      <div class="divide-y" style="border-color:var(--border)">
        ${beds.map(bed => {
          const occupiedPct = Math.round((bed.occupied / bed.total) * 100);
          const reservedPct = Math.round((bed.reserved / bed.total) * 100);
          const availPct = Math.round((bed.available / bed.total) * 100);
          return `
            <div class="px-5 py-4">
              <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div><p class="font-medium text-slate-800 text-sm">${bed.ward}</p><p class="text-xs text-slate-400">${bed.type} Ward</p></div>
                <div class="flex items-center gap-4 text-xs font-mono">
                  <span class="text-emerald-600 font-semibold">${bed.available} available</span>
                  <span class="text-amber-600">${bed.occupied} occupied</span>
                  <span class="text-slate-400">${bed.reserved} reserved</span>
                  <span class="text-slate-600 font-semibold">${bed.total} total</span>
                </div>
              </div>
              <div class="flex h-2 rounded-full overflow-hidden bg-slate-100 gap-0.5">
                <div class="bg-red-400" style="width:${occupiedPct}%"></div>
                <div class="bg-blue-300" style="width:${reservedPct}%"></div>
                <div class="bg-emerald-400" style="width:${availPct}%"></div>
              </div>
              <div class="flex gap-4 mt-1.5 text-xs text-slate-500 flex-wrap">
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-400 inline-block"></span>Occupied ${occupiedPct}%</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-300 inline-block"></span>Reserved</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>Available ${availPct}%</span>
                <span class="ml-auto text-slate-400">Updated: ${bed.lastUpdated}</span>
              </div>
            </div>`;
        }).join("")}
      </div>
    </div>`).join("");

  return `<div class="space-y-5">${stats}${groups || `<div class="bg-white rounded-xl p-10 text-center text-slate-400 text-sm shadow-sm" style="border:1px solid var(--border)">No beds match.</div>`}</div>`;
}

export function renderBedAvailabilityPage() {
  const facilitiesWithBeds = FACILITIES.filter(f => BEDS.some(b => b.facilityId === f.id));
  const types = ["All", ...new Set(BEDS.map(b => b.type))];
  return `
    <div class="space-y-5">
      <div class="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-3" style="border:1px solid var(--border)">
        <select id="bed-facility" class="flex-1 px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white" style="border-color:var(--border)">
          <option value="All" ${state.facilityFilter === "All" ? "selected" : ""}>All Facilities</option>
          ${facilitiesWithBeds.map(f => `<option value="${f.id}" ${state.facilityFilter === f.id ? "selected" : ""}>${f.name}</option>`).join("")}
        </select>
        <select id="bed-type" class="flex-1 px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white" style="border-color:var(--border)">
          ${types.map(t => `<option ${state.typeFilter === t ? "selected" : ""}>${t}</option>`).join("")}
        </select>
      </div>
      <div id="bed-content"></div>
    </div>`;
}

export function attachBedAvailabilityEvents() {
  function rerender() {
    const el = document.getElementById("bed-content");
    if (el) el.innerHTML = renderContent();
  }
  document.getElementById("bed-facility")?.addEventListener("change", e => { state.facilityFilter = e.target.value; rerender(); });
  document.getElementById("bed-type")?.addEventListener("change", e => { state.typeFilter = e.target.value; rerender(); });
  rerender();
}
