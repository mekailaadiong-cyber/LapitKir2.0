let state = { search: "", moduleFilter: "All", roleFilter: "All", successFilter: "All" };
const ROLE_BADGE = { admin: "bg-purple-100 text-purple-800", staff: "bg-emerald-100 text-emerald-800", patient: "bg-sky-100 text-sky-800" };
const MODULE_ICONS = { Authentication: "🔐", Appointments: "📅", Resources: "🗃", Admin: "⚙️", Feedback: "💬" };

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) + " " + d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function computeFiltered(logs) {
  const q = state.search.toLowerCase();
  return [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).filter(log => {
    const matchesSearch = !q || log.userName.toLowerCase().includes(q) || log.action.toLowerCase().includes(q) || log.details.toLowerCase().includes(q);
    const matchesModule = state.moduleFilter === "All" || log.module === state.moduleFilter;
    const matchesRole = state.roleFilter === "All" || log.role === state.roleFilter;
    const matchesSuccess = state.successFilter === "All" || (state.successFilter === "Success" && log.success) || (state.successFilter === "Failed" && !log.success);
    return matchesSearch && matchesModule && matchesRole && matchesSuccess;
  });
}

function renderStats(logs) {
  const successCount = logs.filter(l => l.success).length;
  const failCount = logs.filter(l => !l.success).length;
  return `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-2xl text-slate-800">${logs.length}</p><p class="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">Total Events</p></div>
      <div class="bg-white rounded-xl p-4 shadow-sm" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-2xl text-emerald-600">${successCount}</p><p class="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">Successful</p></div>
      <div class="bg-white rounded-xl p-4 shadow-sm" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-2xl text-red-600">${failCount}</p><p class="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">Failed</p></div>
      <div class="bg-white rounded-xl p-4 shadow-sm" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-2xl text-slate-700">${new Set(logs.map(l => l.userId)).size}</p><p class="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">Unique Users</p></div>
    </div>`;
}

function renderFilterBar(logs) {
  const modules = ["All", ...new Set(logs.map(l => l.module))];
  const roles = ["All", "admin", "staff", "patient"];
  const filtered = computeFiltered(logs);
  return `
    <div class="bg-white rounded-xl shadow-sm p-4" style="border:1px solid var(--border)">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1 relative">
          <svg viewBox="0 0 24 24" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 fill-slate-400"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input id="al-search" value="${state.search}" placeholder="Search by user, action, or details..." class="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" />
        </div>
        <select id="al-module" class="px-3 py-2.5 border rounded-lg text-sm focus:outline-none bg-white" style="border-color:var(--border)">${modules.map(m => `<option ${state.moduleFilter === m ? "selected" : ""}>${m}</option>`).join("")}</select>
        <select id="al-role" class="px-3 py-2.5 border rounded-lg text-sm focus:outline-none bg-white" style="border-color:var(--border)">${roles.map(r => `<option value="${r}" ${state.roleFilter === r ? "selected" : ""}>${r === "All" ? "All Roles" : r}</option>`).join("")}</select>
        <select id="al-success" class="px-3 py-2.5 border rounded-lg text-sm focus:outline-none bg-white" style="border-color:var(--border)">${["All", "Success", "Failed"].map(s => `<option ${state.successFilter === s ? "selected" : ""}>${s}</option>`).join("")}</select>
      </div>
      <p id="al-count" class="text-xs text-slate-400 mt-2">${filtered.length} record${filtered.length === 1 ? "" : "s"} found</p>
    </div>`;
}

function renderTable(logs) {
  const filtered = computeFiltered(logs);
  const rows = filtered.length === 0 ? `<tr><td colspan="7" class="px-5 py-10 text-center text-slate-400 text-sm">No activity logs found.</td></tr>` : filtered.map(log => `
    <tr class="hover:bg-slate-50 ${!log.success ? "bg-red-50/30" : ""}">
      <td class="px-5 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">${formatTime(log.timestamp)}</td>
      <td class="px-4 py-3"><p class="font-medium text-slate-800 text-sm">${log.userName}</p><span class="text-xs font-semibold px-1.5 py-0.5 rounded-full capitalize ${ROLE_BADGE[log.role]}">${log.role}</span></td>
      <td class="px-4 py-3 text-sm"><span class="flex items-center gap-1.5"><span>${MODULE_ICONS[log.module] ?? "📋"}</span><span class="text-slate-600">${log.module}</span></span></td>
      <td class="px-4 py-3 font-medium text-slate-700">${log.action}</td>
      <td class="px-4 py-3 text-xs text-slate-500 max-w-[240px]">${log.details}</td>
      <td class="px-4 py-3 font-mono text-xs text-slate-400">${log.ipAddress}</td>
      <td class="px-4 py-3">${log.success ? `<span class="flex items-center gap-1 text-xs text-emerald-600 font-medium"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Success</span>` : `<span class="flex items-center gap-1 text-xs text-red-600 font-medium"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>Failed</span>`}</td>
    </tr>`).join("");

  return `
    <div class="bg-white rounded-xl shadow-sm overflow-hidden" style="border:1px solid var(--border)">
      <div class="overflow-x-auto"><table class="w-full text-sm">
        <thead><tr class="border-b bg-slate-50" style="border-color:var(--border)">
          <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Timestamp</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Module</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Details</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">IP Address</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
        </tr></thead>
        <tbody class="divide-y" style="border-color:var(--border)">${rows}</tbody>
      </table></div>
    </div>`;
}

export function renderActivityLogsPage(ctx) {
  const stats = renderStats(ctx.logs);
  const filterBar = renderFilterBar(ctx.logs);
  return `<div class="space-y-5">${stats}${filterBar}<div id="al-table"></div></div>`;
}

export function attachActivityLogsEvents(ctx) {
  function rerenderTable() {
    const el = document.getElementById("al-table");
    if (el) el.innerHTML = renderTable(ctx.logs);
  }
  document.getElementById("al-search")?.addEventListener("input", e => { state.search = e.target.value; rerenderTable(); refreshCount(ctx.logs); });
  document.getElementById("al-module")?.addEventListener("change", e => { state.moduleFilter = e.target.value; rerenderTable(); refreshCount(ctx.logs); });
  document.getElementById("al-role")?.addEventListener("change", e => { state.roleFilter = e.target.value; rerenderTable(); refreshCount(ctx.logs); });
  document.getElementById("al-success")?.addEventListener("change", e => { state.successFilter = e.target.value; rerenderTable(); refreshCount(ctx.logs); });
  rerenderTable();
}

function refreshCount(logs) {
  const el = document.getElementById("al-count");
  if (el) el.textContent = `${computeFiltered(logs).length} record${computeFiltered(logs).length === 1 ? "" : "s"} found`;
}
