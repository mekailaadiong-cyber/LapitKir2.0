import { statusBadge } from "./statusBadge.js";

let state = { activeTab: "monitoring", search: "", editFacId: null, editOpStatus: "Open", editEmergency: false, editEmergencyNote: "", editActive: true };
const OP_COLORS = { Open: "bg-emerald-100 text-emerald-800 border-emerald-200", Limited: "bg-amber-100 text-amber-800 border-amber-200", Closed: "bg-red-100 text-red-800 border-red-200" };
const OP_DOT = { Open: "bg-emerald-500", Limited: "bg-amber-500", Closed: "bg-red-500" };
const ROLE_BADGE = { admin: "bg-purple-100 text-purple-800", staff: "bg-emerald-100 text-emerald-800", patient: "bg-sky-100 text-sky-800" };
const ROLE_DISPLAY = { admin: "Administrator", staff: "Health Worker", patient: "Patient" };

function render({ currentUser, facilities, users }) {
  const filteredFacilities = facilities.filter(f => !state.search || f.name.toLowerCase().includes(state.search.toLowerCase()) || f.barangay.toLowerCase().includes(state.search.toLowerCase()));
  const filteredUsers = users.filter(u => !state.search || u.name.toLowerCase().includes(state.search.toLowerCase()) || u.email.toLowerCase().includes(state.search.toLowerCase()));

  const openCount = facilities.filter(f => f.operationalStatus === "Open" && f.active).length;
  const limitedCount = facilities.filter(f => f.operationalStatus === "Limited").length;
  const closedCount = facilities.filter(f => f.operationalStatus === "Closed" || !f.active).length;
  const emergencyCount = facilities.filter(f => f.emergency).length;
  const totalQueue = facilities.reduce((s, f) => s + f.queueCount, 0);
  const withWait = facilities.filter(f => f.estimatedWaitMinutes > 0);
  const avgWait = withWait.length > 0 ? Math.round(withWait.reduce((s, f) => s + f.estimatedWaitMinutes, 0) / withWait.length) : 0;

  const TABS = [["monitoring", "📊 Citywide Monitoring"], ["facilities", "🏥 Facility Accounts"], ["users", "👥 User Accounts"], ["settings", "⚙️ System Settings"]];
  const tabsBar = `<div class="flex border-b overflow-x-auto" style="border-color:var(--border)">
    ${TABS.map(([id, label]) => `<button data-atab="${id}" class="flex-shrink-0 px-5 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${state.activeTab === id ? "border-sky-600 text-sky-700" : "border-transparent text-slate-500 hover:text-slate-700"}">${label}</button>`).join("")}
  </div>`;

  let body = "";
  if (state.activeTab === "monitoring") {
    const cards = [
      ["Open Facilities", openCount, "text-emerald-600", "bg-emerald-50", "border-emerald-200"],
      ["Limited Operations", limitedCount, "text-amber-600", "bg-amber-50", "border-amber-200"],
      ["Closed / Inactive", closedCount, "text-red-600", "bg-red-50", "border-red-200"],
      ["Emergency Status", emergencyCount, "text-red-700", "bg-red-50", "border-red-300"],
      ["Total in Queue (City)", totalQueue, "text-slate-800", "bg-slate-50", "border-slate-200"],
      [`Avg. Wait Time`, `${avgWait} min`, "text-slate-700", "bg-slate-50", "border-slate-200"],
    ];
    body = `
      <div class="p-5 space-y-5">
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          ${cards.map(([label, value, color, bg, border]) => `<div class="rounded-xl p-4 border ${bg} ${border}"><p class="font-['Outfit'] font-bold text-2xl ${color}">${value}</p><p class="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">${label}</p></div>`).join("")}
        </div>
        <div>
          <h3 class="font-['Outfit'] font-semibold text-slate-800 mb-3">All Facilities – Current Status</h3>
          <div class="overflow-x-auto rounded-xl" style="border:1px solid var(--border)"><table class="w-full text-sm">
            <thead><tr class="border-b bg-slate-50" style="border-color:var(--border)">
              <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Facility</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Barangay</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Operational</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Queue</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Est. Wait</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Emergency</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
            </tr></thead>
            <tbody class="divide-y bg-white" style="border-color:var(--border)">
              ${facilities.map(f => `
                <tr class="hover:bg-slate-50">
                  <td class="px-5 py-3"><p class="font-medium text-slate-800">${f.name}</p><p class="text-xs text-slate-400">${f.type}</p></td>
                  <td class="px-4 py-3 text-xs text-slate-600">${f.barangay}</td>
                  <td class="px-4 py-3"><span class="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border w-fit ${OP_COLORS[f.operationalStatus]}"><span class="w-1.5 h-1.5 rounded-full ${OP_DOT[f.operationalStatus]}"></span>${f.operationalStatus}</span></td>
                  <td class="px-4 py-3 font-mono text-sm text-slate-700">${f.queueCount}</td>
                  <td class="px-4 py-3 font-mono text-xs text-slate-500">${f.estimatedWaitMinutes > 0 ? `~${f.estimatedWaitMinutes} min` : "—"}</td>
                  <td class="px-4 py-3">${f.emergency ? `<span class="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">🚨 Active</span>` : `<span class="text-xs text-slate-400">—</span>`}</td>
                  <td class="px-4 py-3">${statusBadge(f.active ? "Active" : "Inactive")}</td>
                </tr>`).join("")}
            </tbody>
          </table></div>
        </div>
      </div>`;
  } else if (state.activeTab === "facilities") {
    body = `
      <div>
        <div class="px-5 py-3 border-b" style="border-color:var(--border)">
          <div class="relative max-w-sm">
            <svg viewBox="0 0 24 24" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 fill-slate-400"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input id="admin-search" value="${state.search}" placeholder="Search facilities..." class="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" />
          </div>
        </div>
        <div class="overflow-x-auto"><table class="w-full text-sm">
          <thead><tr class="border-b bg-slate-50" style="border-color:var(--border)">
            <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Facility</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Operational</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Verified</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
          </tr></thead>
          <tbody class="divide-y" style="border-color:var(--border)">
            ${filteredFacilities.map(f => `
              <tr class="hover:bg-slate-50">
                <td class="px-5 py-3"><p class="font-medium text-slate-800">${f.name}</p><p class="text-xs text-slate-400">${f.type} · ${f.barangay}</p></td>
                <td class="px-4 py-3"><p class="text-xs font-mono text-slate-600">${f.phone}</p><p class="text-xs text-slate-400 truncate max-w-[160px]">${f.email}</p></td>
                <td class="px-4 py-3"><span class="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border w-fit ${OP_COLORS[f.operationalStatus]}"><span class="w-1.5 h-1.5 rounded-full ${OP_DOT[f.operationalStatus]}"></span>${f.operationalStatus}</span>${f.emergency ? `<span class="text-xs text-red-600 mt-0.5 block">🚨 Emergency</span>` : ""}</td>
                <td class="px-4 py-3">${statusBadge(f.verified ? "Active" : "Inactive")}</td>
                <td class="px-4 py-3"><button data-admin-edit="${f.id}" class="px-3 py-1 rounded border text-xs font-medium text-sky-600 border-sky-200 hover:bg-sky-50">Edit Status</button></td>
              </tr>
              ${state.editFacId === f.id ? `
                <tr><td colspan="5" class="bg-sky-50 px-5 py-4 border-t border-sky-200">
                  <div class="flex flex-wrap gap-4 items-end">
                    <div><label class="block text-xs font-semibold text-slate-600 mb-1">Operational Status</label>
                      <select id="admin-op-status" class="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none" style="border-color:var(--border)">
                        ${["Open", "Limited", "Closed"].map(o => `<option ${state.editOpStatus === o ? "selected" : ""}>${o}</option>`).join("")}
                      </select></div>
                    <div><label class="block text-xs font-semibold text-slate-600 mb-1">Active</label>
                      <select id="admin-active" class="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none" style="border-color:var(--border)">
                        <option ${state.editActive ? "selected" : ""}>Active</option><option ${!state.editActive ? "selected" : ""}>Inactive</option>
                      </select></div>
                    <label class="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer"><input id="admin-emergency" type="checkbox" ${state.editEmergency ? "checked" : ""} class="accent-red-600" /> Emergency</label>
                    ${state.editEmergency ? `<input id="admin-emergency-note" value="${state.editEmergencyNote}" placeholder="Emergency notice..." class="flex-1 min-w-[160px] px-3 py-2 border rounded-lg text-sm bg-white" style="border-color:var(--border)" />` : ""}
                    <div class="flex gap-2">
                      <button data-admin-save="${f.id}" class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg">Save</button>
                      <button id="admin-cancel-edit" class="px-3 py-2 border rounded-lg text-xs text-slate-600" style="border-color:var(--border)">Cancel</button>
                    </div>
                  </div>
                </td></tr>` : ""}
            `).join("")}
          </tbody>
        </table></div>
      </div>`;
  } else if (state.activeTab === "users") {
    body = `
      <div>
        <div class="px-5 py-3 border-b" style="border-color:var(--border)">
          <div class="relative max-w-sm">
            <svg viewBox="0 0 24 24" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 fill-slate-400"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input id="admin-search" value="${state.search}" placeholder="Search users..." class="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" />
          </div>
        </div>
        <div class="overflow-x-auto"><table class="w-full text-sm">
          <thead><tr class="border-b bg-slate-50" style="border-color:var(--border)">
            <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Barangay</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Verified</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
          </tr></thead>
          <tbody class="divide-y" style="border-color:var(--border)">
            ${filteredUsers.map(u => `
              <tr class="hover:bg-slate-50">
                <td class="px-5 py-3"><p class="font-medium text-slate-800">${u.name}</p><p class="text-xs text-slate-400">${u.email}</p></td>
                <td class="px-4 py-3"><span class="text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_BADGE[u.role]}">${ROLE_DISPLAY[u.role]}</span></td>
                <td class="px-4 py-3 font-mono text-xs text-slate-600">${u.phone}</td>
                <td class="px-4 py-3 text-xs text-slate-600">${u.barangay ?? "—"}</td>
                <td class="px-4 py-3"><span class="text-xs font-semibold ${u.verified ? "text-emerald-600" : "text-amber-600"}">${u.verified ? "✓ Verified" : "⏳ Pending"}</span></td>
                <td class="px-4 py-3">${statusBadge(u.active ? "Active" : "Inactive")}</td>
                <td class="px-4 py-3">${u.id !== currentUser.id ? `<button data-admin-toggle-user="${u.id}" class="px-3 py-1 rounded border text-xs font-medium transition-colors ${u.active ? "border-red-200 text-red-600 hover:bg-red-50" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"}">${u.active ? "Deactivate" : "Activate"}</button>` : ""}</td>
              </tr>`).join("")}
          </tbody>
        </table></div>
      </div>`;
  } else {
    const settings = [
      ["System Name", "LapitCare Pagadian City"], ["LGU / Health Department", "Pagadian City Health Office"],
      ["City", "Pagadian City, Zamboanga del Sur"], ["System Version", "v2.5.1"],
      ["Map Provider", "OpenStreetMap (Leaflet.js)"], ["Notification Mode", "In-app + SMS"],
      ["Appointment Buffer", "1 business day"], ["Data Refresh", "Real-time (on update)"],
    ];
    body = `
      <div class="p-5 space-y-5">
        <div class="grid sm:grid-cols-2 gap-4">
          ${settings.map(([label, value]) => `<div class="p-4 rounded-xl border" style="border-color:var(--border)"><p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">${label}</p><p class="text-sm font-medium text-slate-800">${value}</p></div>`).join("")}
        </div>
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p class="text-sm font-semibold text-amber-800 mb-1">System Maintenance</p>
          <p class="text-xs text-amber-700">Contact the system administrator at <span class="font-mono">sysadmin@pagadiancity.gov.ph</span> for configuration changes.</p>
        </div>
      </div>`;
  }

  return `<div class="space-y-5"><div class="bg-white rounded-xl shadow-sm overflow-hidden" style="border:1px solid var(--border)">${tabsBar}${body}</div></div>`;
}

export function renderAdminPage(ctx) { return render(ctx); }

export function attachAdminEvents(ctx) {
  const { onUpdateFacility, onToggleUser } = ctx;
  function rerender() {
    const el = document.getElementById("page-content");
    if (el) { el.innerHTML = render(ctx); attachAdminEvents(ctx); }
  }
  document.querySelectorAll("[data-atab]").forEach(btn => btn.addEventListener("click", () => { state.activeTab = btn.dataset.atab; state.search = ""; rerender(); }));
  document.getElementById("admin-search")?.addEventListener("input", e => { state.search = e.target.value; rerender(); });
  document.querySelectorAll("[data-admin-edit]").forEach(btn => btn.addEventListener("click", () => {
    const f = ctx.facilities.find(f => f.id === btn.dataset.adminEdit);
    if (!f) return;
    state.editFacId = f.id; state.editOpStatus = f.operationalStatus; state.editEmergency = f.emergency; state.editEmergencyNote = f.emergencyNote ?? ""; state.editActive = f.active;
    rerender();
  }));
  document.getElementById("admin-cancel-edit")?.addEventListener("click", () => { state.editFacId = null; rerender(); });
  document.getElementById("admin-op-status")?.addEventListener("change", e => { state.editOpStatus = e.target.value; });
  document.getElementById("admin-active")?.addEventListener("change", e => { state.editActive = e.target.value === "Active"; });
  document.getElementById("admin-emergency")?.addEventListener("change", e => { state.editEmergency = e.target.checked; rerender(); });
  document.getElementById("admin-emergency-note")?.addEventListener("input", e => { state.editEmergencyNote = e.target.value; });
  document.querySelectorAll("[data-admin-save]").forEach(btn => btn.addEventListener("click", () => {
    onUpdateFacility(btn.dataset.adminSave, {
      operationalStatus: state.editOpStatus, emergency: state.editEmergency,
      emergencyNote: state.editEmergency ? state.editEmergencyNote : undefined, active: state.editActive,
    }, `Admin updated facility status: ${state.editOpStatus}${state.editEmergency ? " + Emergency" : ""}${!state.editActive ? " (deactivated)" : ""}`);
    state.editFacId = null;
  }));
  document.querySelectorAll("[data-admin-toggle-user]").forEach(btn => btn.addEventListener("click", () => onToggleUser(btn.dataset.adminToggleUser)));
}
