// DashboardPage — first pass covers the patient dashboard (stat cards + map + quick actions).
// Staff/admin dashboard variants will be added when StaffDashboardPage/AdminPage are converted.

import { createFacilityMap } from "./facilityMap.js";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function renderDashboardPage({ currentUser, facilities }) {
  if (currentUser.role !== "patient") {
    return `
      <div class="bg-white rounded-xl p-8 text-center shadow-sm" style="border:1px solid var(--border)">
        <p class="text-slate-500 text-sm"> ${currentUser.role} is coming soon </p>
      </div>`;
  }

  const emergencyFacilities = facilities.filter(f => f.emergency && f.active);
  const activeFacilities = facilities.filter(f => f.active);
  const openCount = facilities.filter(f => f.operationalStatus === "Open" && f.active).length;
  const limitedCount = facilities.filter(f => f.operationalStatus === "Limited").length;
  const totalQueue = activeFacilities.reduce((s, f) => s + f.queueCount, 0);

  const emergencyBanner = emergencyFacilities.length > 0 ? `
    <div class="bg-red-600 text-white rounded-xl p-4 flex items-start gap-3">
      <span class="text-xl flex-shrink-0 mt-0.5">🚨</span>
      <div>
        <p class="font-['Outfit'] font-bold text-base mb-1">Emergency Status Alert</p>
        ${emergencyFacilities.map(f => `<p class="text-sm text-red-100"><span class="font-semibold">${f.name}</span>: ${f.emergencyNote ?? ""}</p>`).join("")}
      </div>
    </div>` : "";

  return `
    <div class="space-y-5">
      ${emergencyBanner}
      <div>
        <h2 class="font-['Outfit'] font-bold text-2xl text-slate-800">${greeting()}, ${currentUser.name.split(" ")[0]} 👋</h2>
        <p class="text-slate-500 text-sm mt-0.5">${new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}${currentUser.barangay ? ` · Brgy. ${currentUser.barangay}` : ""}</p>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card-hover bg-white rounded-xl border-l-4 p-4 shadow-sm" style="border-left-color:#0ea5e9;border-top:1px solid var(--border);border-right:1px solid var(--border);border-bottom:1px solid var(--border)">
          <span class="text-2xl block mb-2">🏥</span>
          <p class="font-['Outfit'] font-bold text-2xl text-slate-800">${openCount}</p>
          <p class="text-xs font-semibold text-slate-600 mt-0.5">Open Facilities</p>
          <p class="text-xs text-slate-400 mt-0.5">${limitedCount} limited operations</p>
        </div>
        <div class="card-hover bg-white rounded-xl border-l-4 p-4 shadow-sm" style="border-left-color:#f59e0b;border-top:1px solid var(--border);border-right:1px solid var(--border);border-bottom:1px solid var(--border)">
          <span class="text-2xl block mb-2">🔢</span>
          <p class="font-['Outfit'] font-bold text-2xl text-slate-800">${totalQueue}</p>
          <p class="text-xs font-semibold text-slate-600 mt-0.5">Total in Queue</p>
          <p class="text-xs text-slate-400 mt-0.5">across active facilities</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden" style="border:1px solid var(--border)">
        <div class="flex items-center justify-between px-5 py-3.5 border-b" style="border-color:var(--border)">
          <div>
            <h3 class="font-['Outfit'] font-semibold text-slate-800">Nearby Health Facilities</h3>
            <p class="text-xs text-slate-400 mt-0.5">Click a pin to view details · Pagadian City</p>
          </div>
        </div>
        <div id="dashboard-map" style="height:340px"></div>
        <div class="px-5 py-2.5 border-t flex gap-4 flex-wrap" style="border-color:var(--border)">
          <span class="flex items-center gap-1.5 text-xs text-slate-500"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Open</span>
          <span class="flex items-center gap-1.5 text-xs text-slate-500"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Limited</span>
          <span class="flex items-center gap-1.5 text-xs text-slate-500"><span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>Closed / Emergency</span>
        </div>
      </div>
    </div>`;
}

// Call after inserting the HTML into the DOM, since Leaflet needs a real element.
export function mountDashboardMap(facilities) {
  const el = document.getElementById("dashboard-map");
  if (el) createFacilityMap(el, facilities.filter(f => f.active), () => {});
}
