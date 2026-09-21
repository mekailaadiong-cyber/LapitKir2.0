import { MEDICINES, FACILITIES } from "./data.js";
import { statusBadge } from "./statusBadge.js";

let medicines = JSON.parse(JSON.stringify(MEDICINES));
let state = {
  activeTab: "appointments",
  editingMed: null, editQty: "", editStatus: "", editNotes: "",
  noteTarget: null, staffNoteInput: "",
  queueCount: null, waitMinutes: null, queueSaved: false,
  facForm: null, facSaved: false, facNote: "",
};

const OP_STATUS_OPTIONS = ["Open", "Limited", "Closed"];
const OP_STATUS_COLORS = { Open: "bg-emerald-100 text-emerald-800 border-emerald-200", Limited: "bg-amber-100 text-amber-800 border-amber-200", Closed: "bg-red-100 text-red-800 border-red-200" };

function ensureFacForm(assignedFacility) {
  if (!state.facForm && assignedFacility) {
    state.facForm = { phone: assignedFacility.phone, email: assignedFacility.email, hours: assignedFacility.hours, opStatus: assignedFacility.operationalStatus, emergency: assignedFacility.emergency, emergencyNote: assignedFacility.emergencyNote ?? "" };
  }
}

function render(ctx) {
  const { currentUser, appointments, facilities } = ctx;
  const isAdmin = currentUser.role === "admin";
  const myFacilityId = currentUser.facilityId;
  const assignedFacility = facilities.find(f => f.id === myFacilityId);
  if (state.queueCount === null) state.queueCount = assignedFacility?.queueCount ?? 0;
  if (state.waitMinutes === null) state.waitMinutes = assignedFacility?.estimatedWaitMinutes ?? 0;
  ensureFacForm(assignedFacility);

  const myAppts = appointments.filter(a => isAdmin || a.facilityId === myFacilityId).sort((a, b) => a.date.localeCompare(b.date));
  const pending = myAppts.filter(a => a.status === "Pending").length;
  const approved = myAppts.filter(a => a.status === "Approved").length;

  const myMeds = myFacilityId
    ? medicines.map(m => ({ ...m, facilities: m.facilities.filter(f => f.facilityId === myFacilityId) })).filter(m => m.facilities.length > 0)
    : medicines;

  const stats = `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-2xl text-blue-600">${pending}</p><p class="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">Pending</p></div>
      <div class="bg-white rounded-xl p-4 shadow-sm" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-2xl text-emerald-600">${approved}</p><p class="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">Approved</p></div>
      <div class="bg-white rounded-xl p-4 shadow-sm" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-2xl text-slate-700">${myAppts.length}</p><p class="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">Total Appointments</p></div>
      <div class="bg-white rounded-xl p-4 shadow-sm" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-2xl ${state.queueCount > 30 ? "text-red-600" : state.queueCount > 15 ? "text-amber-600" : "text-emerald-600"}">${assignedFacility ? state.queueCount : "—"}</p><p class="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">Current Queue</p></div>
    </div>`;

  const TABS = [["appointments", "📋 Appointments"], ["queue", "🔢 Queue Status"], ["resources", "🗃 Resource Management"], ["facility", "🏥 Facility Profile"]];
  const tabsBar = `<div class="flex border-b overflow-x-auto" style="border-color:var(--border)">
    ${TABS.map(([id, label]) => `<button data-stab="${id}" class="flex-shrink-0 px-5 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${state.activeTab === id ? "border-sky-600 text-sky-700" : "border-transparent text-slate-500 hover:text-slate-700"}">${label}</button>`).join("")}
  </div>`;

  let tabContent = "";
  if (state.activeTab === "appointments") {
    tabContent = myAppts.length === 0 ? `<div class="p-12 text-center text-slate-400 text-sm">No appointments to manage.</div>` : `
      <div class="overflow-x-auto"><table class="w-full text-sm">
        <thead><tr class="border-b bg-slate-50" style="border-color:var(--border)">
          <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Service</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date & Time</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
        </tr></thead>
        <tbody class="divide-y" style="border-color:var(--border)">
          ${myAppts.map(appt => `
            <tr class="hover:bg-slate-50">
              <td class="px-5 py-3"><p class="font-medium text-slate-800">${appt.userName}</p><p class="text-xs text-slate-400 font-mono">${appt.userPhone}</p></td>
              <td class="px-4 py-3"><p class="text-slate-700">${appt.serviceName}</p><p class="text-xs text-slate-400">${appt.facilityName}</p></td>
              <td class="px-4 py-3 font-mono text-xs text-slate-600">${appt.date} · ${appt.time}</td>
              <td class="px-4 py-3">${statusBadge(appt.status, { dot: true })}</td>
              <td class="px-4 py-3"><div class="flex gap-2 flex-wrap">
                ${appt.status === "Pending" ? `<button data-sd-approve-open="${appt.id}" class="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">Approve</button><button data-sd-reject="${appt.id}" class="px-3 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium">Reject</button>` : ""}
                ${appt.status === "Approved" ? `<button data-sd-complete="${appt.id}" class="px-3 py-1 rounded bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold">Complete</button>` : ""}
              </div></td>
            </tr>
            ${state.noteTarget === appt.id ? `
              <tr><td colspan="5" class="bg-emerald-50 px-5 py-3 border-t border-emerald-200">
                <div class="flex gap-3 items-start flex-wrap">
                  <input id="sd-note-input" value="${state.staffNoteInput}" class="flex-1 min-w-[200px] px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:outline-none bg-white" placeholder="Notes for patient..." />
                  <button data-sd-approve-confirm="${appt.id}" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg">Confirm</button>
                  <button data-sd-approve-cancel class="px-3 py-2 border rounded-lg text-xs text-slate-600" style="border-color:var(--border)">Cancel</button>
                </div>
              </td></tr>` : ""}
          `).join("")}
        </tbody>
      </table></div>`;
  } else if (state.activeTab === "queue") {
    tabContent = `
      <div class="p-6 max-w-lg">
        <p class="text-sm text-slate-500 mb-5">Update the current queue count and estimated wait time for <span class="font-semibold text-slate-800">${assignedFacility?.name ?? "your facility"}</span>. This is reflected on the public-facing directory in real time.</p>
        ${state.queueSaved ? `<div class="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3 flex items-center gap-2"><span>✓</span> Queue status updated.</div>` : ""}
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-slate-50 rounded-xl p-4 text-center" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-3xl ${state.queueCount > 30 ? "text-red-600" : state.queueCount > 15 ? "text-amber-500" : "text-emerald-600"}">${state.queueCount}</p><p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Patients in Queue</p></div>
          <div class="bg-slate-50 rounded-xl p-4 text-center" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-3xl text-slate-700">${state.waitMinutes}<span class="text-lg font-normal text-slate-400"> min</span></p><p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Estimated Wait</p></div>
        </div>
        <div class="space-y-4">
          <div><label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Current Queue Count</label>
            <div class="flex items-center gap-3">
              <button id="sd-queue-minus" class="w-9 h-9 rounded-lg border text-slate-600 font-bold text-lg hover:bg-slate-50 flex-shrink-0 flex items-center justify-center" style="border-color:var(--border)">−</button>
              <input id="sd-queue-input" type="number" min="0" value="${state.queueCount}" class="flex-1 px-3 py-2.5 border rounded-lg text-sm text-center font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" />
              <button id="sd-queue-plus" class="w-9 h-9 rounded-lg border text-slate-600 font-bold text-lg hover:bg-slate-50 flex-shrink-0 flex items-center justify-center" style="border-color:var(--border)">+</button>
            </div></div>
          <div><label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Estimated Wait Time (minutes)</label>
            <div class="flex items-center gap-3">
              <button id="sd-wait-minus" class="w-9 h-9 rounded-lg border text-slate-600 font-bold text-lg hover:bg-slate-50 flex-shrink-0 flex items-center justify-center" style="border-color:var(--border)">−</button>
              <input id="sd-wait-input" type="number" min="0" step="5" value="${state.waitMinutes}" class="flex-1 px-3 py-2.5 border rounded-lg text-sm text-center font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" />
              <button id="sd-wait-plus" class="w-9 h-9 rounded-lg border text-slate-600 font-bold text-lg hover:bg-slate-50 flex-shrink-0 flex items-center justify-center" style="border-color:var(--border)">+</button>
            </div>
            <div class="flex gap-2 mt-2 flex-wrap">${[15, 30, 45, 60, 90, 120].map(m => `<button data-sd-wait-preset="${m}" class="px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${state.waitMinutes === m ? "bg-sky-100 border-sky-400 text-sky-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}">${m} min</button>`).join("")}</div>
          </div>
          <button id="sd-queue-save" class="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-lg transition-colors">Update Queue Status</button>
        </div>
      </div>`;
  } else if (state.activeTab === "resources") {
    const rows = [];
    myMeds.forEach(med => med.facilities.forEach(fac => {
      const key = `${med.id}-${fac.facilityId}`;
      rows.push(`
        <tr class="hover:bg-slate-50">
          <td class="px-5 py-3"><p class="font-medium text-slate-800">${med.name}</p><p class="text-xs text-slate-400">${med.generic}</p></td>
          <td class="px-4 py-3 text-xs text-slate-600">${med.category}</td>
          <td class="px-4 py-3 font-mono text-sm">${fac.quantity} ${med.unit}s</td>
          <td class="px-4 py-3">${statusBadge(fac.status, { dot: true })}</td>
          <td class="px-4 py-3 font-mono text-xs text-slate-500">${fac.lastUpdated}</td>
          <td class="px-4 py-3"><button data-sd-med-edit="${key}" class="px-3 py-1 rounded border text-xs font-medium text-sky-600 border-sky-200 hover:bg-sky-50">Update</button></td>
        </tr>`);
      if (state.editingMed === key) {
        rows.push(`
          <tr><td colspan="6" class="bg-sky-50 px-5 py-4 border-t border-sky-200">
            <div class="flex flex-wrap gap-3 items-end">
              <div><label class="block text-xs font-semibold text-slate-600 mb-1">Qty (${med.unit}s)</label><input id="sd-med-qty" type="number" min="0" value="${state.editQty}" class="w-24 px-3 py-2 border rounded-lg text-sm focus:outline-none bg-white" style="border-color:var(--border)" /></div>
              <div><label class="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select id="sd-med-status" class="px-3 py-2 border rounded-lg text-sm focus:outline-none bg-white" style="border-color:var(--border)">
                  ${["Available", "Low Stock", "Unavailable"].map(s => `<option ${state.editStatus === s ? "selected" : ""}>${s}</option>`).join("")}
                </select></div>
              <div class="flex-1 min-w-[180px]"><label class="block text-xs font-semibold text-slate-600 mb-1">Notes</label><input id="sd-med-notes" value="${state.editNotes}" placeholder="Reason for update..." class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none bg-white" style="border-color:var(--border)" /></div>
              <div class="flex gap-2">
                <button data-sd-med-save="${key}" class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg">Save</button>
                <button id="sd-med-cancel" class="px-3 py-2 border rounded-lg text-xs text-slate-600" style="border-color:var(--border)">Cancel</button>
              </div>
            </div>
          </td></tr>`);
      }
    }));
    tabContent = `<div class="overflow-x-auto"><table class="w-full text-sm">
      <thead><tr class="border-b bg-slate-50" style="border-color:var(--border)">
        <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Medicine</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Quantity</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Updated</th>
        <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
      </tr></thead><tbody class="divide-y" style="border-color:var(--border)">${rows.join("")}</tbody></table></div>`;
  } else if (state.activeTab === "facility") {
    const ff = state.facForm ?? {};
    tabContent = `
      <div class="p-6 max-w-xl">
        <p class="text-sm text-slate-500 mb-5">Update your facility's contact information, operating hours, and current operational status.</p>
        ${state.facSaved ? `<div class="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3 flex items-center gap-2"><span>✓</span> Facility profile updated.</div>` : ""}
        <div class="space-y-4">
          <div><label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Phone Number</label><input id="sd-fac-phone" value="${ff.phone ?? ""}" class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" /></div>
          <div><label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email Address</label><input id="sd-fac-email" value="${ff.email ?? ""}" class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" /></div>
          <div><label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Operating Hours</label><input id="sd-fac-hours" value="${ff.hours ?? ""}" class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" placeholder="e.g. Mon–Fri 8:00 AM – 5:00 PM" /></div>
          <div><label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Operational Status</label>
            <div class="flex gap-2">${OP_STATUS_OPTIONS.map(opt => `<button data-sd-fac-op="${opt}" class="flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-all ${ff.opStatus === opt ? OP_STATUS_COLORS[opt] + " ring-2 ring-offset-1 ring-current" : "border-slate-200 text-slate-500 hover:bg-slate-50"}">${opt === "Open" ? "🟢" : opt === "Limited" ? "🟡" : "🔴"} ${opt}</button>`).join("")}</div></div>
          <div>
            <label class="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer"><input id="sd-fac-emergency" type="checkbox" ${ff.emergency ? "checked" : ""} class="w-4 h-4 accent-red-600" /> Set Emergency Status</label>
            ${ff.emergency ? `<textarea id="sd-fac-emergency-note" rows="2" placeholder="Emergency notice displayed to patients..." class="mt-2 w-full px-3 py-2.5 border border-red-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none bg-red-50">${ff.emergencyNote ?? ""}</textarea>` : ""}
          </div>
          <div><label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Update Notes (for history log)</label><input id="sd-fac-note" value="${state.facNote}" placeholder="Reason or description of changes..." class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" /></div>
          <button id="sd-fac-save" class="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-lg transition-colors">Save Facility Profile</button>
        </div>
      </div>`;
  }

  return `<div class="space-y-5">${stats}<div class="bg-white rounded-xl shadow-sm overflow-hidden" style="border:1px solid var(--border)">${tabsBar}${tabContent}</div></div>`;
}

export function renderStaffDashboardPage(ctx) { return render(ctx); }

export function attachStaffDashboardEvents(ctx) {
  const { currentUser, facilities, onUpdateAppointment, onUpdateMedicineStatus, onUpdateFacility } = ctx;
  function rerender() {
    const el = document.getElementById("page-content");
    if (el) { el.innerHTML = render(ctx); attachStaffDashboardEvents(ctx); }
  }

  document.querySelectorAll("[data-stab]").forEach(btn => btn.addEventListener("click", () => { state.activeTab = btn.dataset.stab; rerender(); }));

  // Appointments tab
  document.querySelectorAll("[data-sd-approve-open]").forEach(btn => btn.addEventListener("click", () => { state.noteTarget = btn.dataset.sdApproveOpen; state.staffNoteInput = "Appointment confirmed. Please arrive 15 minutes early."; rerender(); }));
  document.getElementById("sd-note-input")?.addEventListener("input", e => { state.staffNoteInput = e.target.value; });
  document.querySelectorAll("[data-sd-approve-confirm]").forEach(btn => btn.addEventListener("click", () => { onUpdateAppointment(btn.dataset.sdApproveConfirm, "Approved", state.staffNoteInput); state.noteTarget = null; }));
  document.getElementById("sd-approve-cancel")?.addEventListener("click", () => { state.noteTarget = null; rerender(); });
  document.querySelectorAll("[data-sd-reject]").forEach(btn => btn.addEventListener("click", () => onUpdateAppointment(btn.dataset.sdReject, "Cancelled", "Rejected by facility.")));
  document.querySelectorAll("[data-sd-complete]").forEach(btn => btn.addEventListener("click", () => onUpdateAppointment(btn.dataset.sdComplete, "Completed", "Appointment completed successfully.")));

  // Queue tab
  document.getElementById("sd-queue-minus")?.addEventListener("click", () => { state.queueCount = Math.max(0, state.queueCount - 1); rerender(); });
  document.getElementById("sd-queue-plus")?.addEventListener("click", () => { state.queueCount = state.queueCount + 1; rerender(); });
  document.getElementById("sd-queue-input")?.addEventListener("change", e => { state.queueCount = Math.max(0, Number(e.target.value)); rerender(); });
  document.getElementById("sd-wait-minus")?.addEventListener("click", () => { state.waitMinutes = Math.max(0, state.waitMinutes - 5); rerender(); });
  document.getElementById("sd-wait-plus")?.addEventListener("click", () => { state.waitMinutes = state.waitMinutes + 5; rerender(); });
  document.getElementById("sd-wait-input")?.addEventListener("change", e => { state.waitMinutes = Math.max(0, Number(e.target.value)); rerender(); });
  document.querySelectorAll("[data-sd-wait-preset]").forEach(btn => btn.addEventListener("click", () => { state.waitMinutes = Number(btn.dataset.sdWaitPreset); rerender(); }));
  document.getElementById("sd-queue-save")?.addEventListener("click", () => {
    if (!currentUser.facilityId) return;
    onUpdateFacility(currentUser.facilityId, { queueCount: state.queueCount, estimatedWaitMinutes: state.waitMinutes }, `Queue updated: ${state.queueCount} patients, ~${state.waitMinutes} min wait.`);
    state.queueSaved = true;
    rerender();
    setTimeout(() => { state.queueSaved = false; rerender(); }, 3000);
  });

  // Resources tab
  document.querySelectorAll("[data-sd-med-edit]").forEach(btn => btn.addEventListener("click", () => {
    const [medId, facilityId] = btn.dataset.sdMedEdit.split("-");
    const med = medicines.find(m => m.id === medId);
    const fac = med?.facilities.find(f => f.facilityId === facilityId);
    if (!med || !fac) return;
    state.editingMed = btn.dataset.sdMedEdit;
    state.editQty = String(fac.quantity);
    state.editStatus = fac.status;
    state.editNotes = "";
    rerender();
  }));
  document.getElementById("sd-med-cancel")?.addEventListener("click", () => { state.editingMed = null; rerender(); });
  document.getElementById("sd-med-qty")?.addEventListener("input", e => { state.editQty = e.target.value; });
  document.getElementById("sd-med-status")?.addEventListener("change", e => { state.editStatus = e.target.value; });
  document.getElementById("sd-med-notes")?.addEventListener("input", e => { state.editNotes = e.target.value; });
  document.querySelectorAll("[data-sd-med-save]").forEach(btn => btn.addEventListener("click", () => {
    const [medId, facilityId] = btn.dataset.sdMedSave.split("-");
    const med = medicines.find(m => m.id === medId);
    const facMed = med?.facilities.find(f => f.facilityId === facilityId);
    if (!med || !facMed) return;
    const update = {
      id: `ru${Date.now()}`, resourceType: "Medicine", resourceName: med.name,
      facilityId, facilityName: FACILITIES.find(f => f.id === facilityId)?.name ?? facilityId,
      field: state.editStatus !== facMed.status ? "Status" : "Quantity",
      previousValue: state.editStatus !== facMed.status ? facMed.status : String(facMed.quantity),
      newValue: state.editStatus !== facMed.status ? state.editStatus : state.editQty,
      updatedById: currentUser.id, updatedByName: currentUser.name, notes: state.editNotes, timestamp: new Date().toISOString(),
    };
    facMed.quantity = Number(state.editQty);
    facMed.status = state.editStatus;
    facMed.lastUpdated = new Date().toISOString().split("T")[0];
    facMed.updatedBy = currentUser.name;
    onUpdateMedicineStatus(update);
    state.editingMed = null;
  }));

  // Facility tab
  document.querySelectorAll("[data-sd-fac-op]").forEach(btn => btn.addEventListener("click", () => { state.facForm.opStatus = btn.dataset.sdFacOp; rerender(); }));
  document.getElementById("sd-fac-emergency")?.addEventListener("change", e => { state.facForm.emergency = e.target.checked; rerender(); });
  document.getElementById("sd-fac-phone")?.addEventListener("input", e => { state.facForm.phone = e.target.value; });
  document.getElementById("sd-fac-email")?.addEventListener("input", e => { state.facForm.email = e.target.value; });
  document.getElementById("sd-fac-hours")?.addEventListener("input", e => { state.facForm.hours = e.target.value; });
  document.getElementById("sd-fac-emergency-note")?.addEventListener("input", e => { state.facForm.emergencyNote = e.target.value; });
  document.getElementById("sd-fac-note")?.addEventListener("input", e => { state.facNote = e.target.value; });
  document.getElementById("sd-fac-save")?.addEventListener("click", () => {
    if (!currentUser.facilityId) return;
    const changes = { phone: state.facForm.phone, email: state.facForm.email, hours: state.facForm.hours, operationalStatus: state.facForm.opStatus, emergency: state.facForm.emergency, emergencyNote: state.facForm.emergency ? state.facForm.emergencyNote : undefined };
    onUpdateFacility(currentUser.facilityId, changes, state.facNote || "Facility profile updated.");
    state.facSaved = true;
    rerender();
    setTimeout(() => { state.facSaved = false; rerender(); }, 3000);
  });
}
