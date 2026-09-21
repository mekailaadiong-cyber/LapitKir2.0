import { APPOINTMENT_SLOTS } from "./data.js";
import { statusBadge } from "./statusBadge.js";

let state = { statusFilter: "All", cancellingId: null, reschedulingId: null, newDate: "", newTime: "" };
const STATUSES = ["All", "Pending", "Approved", "Completed", "Cancelled"];

function minDateStr() { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; }

function render({ currentUser, appointments }) {
  const userAppts = appointments
    .filter(a => currentUser.role !== "patient" || a.userId === currentUser.id)
    .filter(a => state.statusFilter === "All" || a.status === state.statusFilter)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const scope = a => currentUser.role === "patient" ? a.userId === currentUser.id : true;
  const counts = {
    All: appointments.filter(scope).length,
    Pending: appointments.filter(a => scope(a) && a.status === "Pending").length,
    Approved: appointments.filter(a => scope(a) && a.status === "Approved").length,
    Completed: appointments.filter(a => scope(a) && a.status === "Completed").length,
    Cancelled: appointments.filter(a => scope(a) && a.status === "Cancelled").length,
  };

  const tabs = `
    <div class="bg-white rounded-xl shadow-sm" style="border:1px solid var(--border)">
      <div class="flex overflow-x-auto">
        ${STATUSES.map(s => `
          <button data-status="${s}" class="astat-tab flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${state.statusFilter === s ? "border-sky-600 text-sky-700" : "border-transparent text-slate-500 hover:text-slate-700"}">
            ${s}<span class="text-xs rounded-full px-2 py-0.5 font-bold ${state.statusFilter === s ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-500"}">${counts[s]}</span>
          </button>`).join("")}
      </div>
    </div>`;

  if (userAppts.length === 0) {
    return `<div class="space-y-5">${tabs}
      <div class="bg-white rounded-xl p-12 text-center shadow-sm" style="border:1px solid var(--border)">
        <p class="text-4xl mb-3">📅</p><p class="text-slate-500 text-sm mb-4">No appointments found.</p>
        ${currentUser.role === "patient" ? `<button id="astat-book" class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors">Book an Appointment</button>` : ""}
      </div></div>`;
  }

  const list = userAppts.map(appt => {
    const reschedulingAppt = appt.id === state.reschedulingId ? appt : null;
    const slots = reschedulingAppt ? (APPOINTMENT_SLOTS[reschedulingAppt.serviceId] ?? []) : [];

    let actions = "";
    if (currentUser.role === "patient" && (appt.status === "Pending" || appt.status === "Approved")) {
      actions = `
        <button data-reschedule="${appt.id}" class="px-3 py-1.5 rounded-lg border text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors" style="border-color:var(--border)">Reschedule</button>
        <button data-cancel="${appt.id}" class="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">Cancel Appointment</button>`;
    }
    if ((currentUser.role === "staff" || currentUser.role === "admin") && appt.status === "Pending") {
      actions = `
        <button data-approve="${appt.id}" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white transition-colors">✓ Approve</button>
        <button data-reject="${appt.id}" class="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50">Reject</button>`;
    }
    if ((currentUser.role === "staff" || currentUser.role === "admin") && appt.status === "Approved") {
      actions = `<button data-complete="${appt.id}" class="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-xs font-semibold text-white transition-colors">Mark as Completed</button>`;
    }

    return `
      <div class="bg-white rounded-xl shadow-sm overflow-hidden" style="border:1px solid var(--border)">
        <div class="px-5 py-4">
          <div class="flex items-start justify-between gap-4 mb-3">
            <div>
              <div class="flex items-center gap-2 mb-0.5 flex-wrap"><h3 class="font-['Outfit'] font-semibold text-slate-800">${appt.serviceName}</h3>${statusBadge(appt.status, { dot: true })}</div>
              <p class="text-xs text-slate-500">${appt.facilityName}</p>
            </div>
            <div class="text-right flex-shrink-0"><p class="font-mono text-sm font-semibold text-slate-700">${appt.date}</p><p class="font-mono text-xs text-slate-500">${appt.time}</p></div>
          </div>
          <div class="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500 mb-3">
            <span>Patient: <span class="text-slate-700 font-medium">${appt.userName}</span></span>
            <span>Phone: <span class="text-slate-700 font-mono">${appt.userPhone}</span></span>
            ${appt.notes ? `<span class="sm:col-span-2">Notes: <span class="text-slate-700">${appt.notes}</span></span>` : ""}
            ${appt.staffNotes ? `<span class="sm:col-span-2 text-blue-700">Staff: ${appt.staffNotes}</span>` : ""}
          </div>
          ${actions ? `<div class="flex flex-wrap gap-2 pt-2 border-t" style="border-color:var(--border)">${actions}</div>` : ""}
        </div>
        ${state.cancellingId === appt.id ? `
          <div class="bg-red-50 border-t border-red-200 px-5 py-4">
            <p class="text-sm font-semibold text-red-800 mb-1">Cancel this appointment?</p>
            <p class="text-xs text-red-600 mb-3">This action cannot be undone. You may rebook at any time.</p>
            <div class="flex gap-2">
              <button data-confirm-cancel="${appt.id}" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg">Yes, Cancel</button>
              <button data-keep="${appt.id}" class="px-4 py-2 border rounded-lg text-xs text-slate-600 hover:bg-white" style="border-color:var(--border)">Keep Appointment</button>
            </div>
          </div>` : ""}
        ${state.reschedulingId === appt.id ? `
          <div class="bg-sky-50 border-t border-sky-200 px-5 py-4">
            <p class="text-sm font-semibold text-sky-800 mb-3">Select a New Date & Time</p>
            <div class="flex flex-col sm:flex-row gap-3 mb-3">
              <input id="astat-new-date" type="date" value="${state.newDate}" min="${minDateStr()}" class="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" />
              ${state.newDate ? `
                <select id="astat-new-time" class="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none bg-white" style="border-color:var(--border)">
                  <option value="">Choose time slot</option>
                  ${slots.filter(s => !s.startsWith("No")).map(s => `<option ${state.newTime === s ? "selected" : ""}>${s}</option>`).join("")}
                </select>` : ""}
            </div>
            <div class="flex gap-2">
              <button data-confirm-reschedule="${appt.id}" ${!state.newDate || !state.newTime ? "disabled" : ""} class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg disabled:opacity-40">Confirm Reschedule</button>
              <button data-cancel-reschedule="${appt.id}" class="px-4 py-2 border rounded-lg text-xs text-slate-600 hover:bg-white" style="border-color:var(--border)">Cancel</button>
            </div>
          </div>` : ""}
      </div>`;
  }).join("");

  return `<div class="space-y-5">${tabs}<div class="space-y-3">${list}</div></div>`;
}

export function renderAppointmentStatusPage(ctx) { return render(ctx); }

export function attachAppointmentStatusEvents(ctx) {
  const { onUpdate, onReschedule, onNavigate } = ctx;
  function rerender() {
    const el = document.getElementById("page-content");
    if (el) { el.innerHTML = render(ctx); attachAppointmentStatusEvents(ctx); }
  }
  document.querySelectorAll(".astat-tab").forEach(btn => btn.addEventListener("click", () => { state.statusFilter = btn.dataset.status; rerender(); }));
  document.getElementById("astat-book")?.addEventListener("click", () => onNavigate("book-appointment"));
  document.querySelectorAll("[data-reschedule]").forEach(btn => btn.addEventListener("click", () => { state.reschedulingId = btn.dataset.reschedule; state.newDate = ""; state.newTime = ""; rerender(); }));
  document.querySelectorAll("[data-cancel]").forEach(btn => btn.addEventListener("click", () => { state.cancellingId = btn.dataset.cancel; rerender(); }));
  document.querySelectorAll("[data-approve]").forEach(btn => btn.addEventListener("click", () => { onUpdate(btn.dataset.approve, "Approved", "Appointment confirmed. Please arrive 15 minutes early."); }));
  document.querySelectorAll("[data-reject]").forEach(btn => btn.addEventListener("click", () => { onUpdate(btn.dataset.reject, "Cancelled", "Rejected by facility."); }));
  document.querySelectorAll("[data-complete]").forEach(btn => btn.addEventListener("click", () => { onUpdate(btn.dataset.complete, "Completed", "Appointment completed successfully."); }));
  document.querySelectorAll("[data-confirm-cancel]").forEach(btn => btn.addEventListener("click", () => { onUpdate(btn.dataset.confirmCancel, "Cancelled"); state.cancellingId = null; }));
  document.querySelectorAll("[data-keep]").forEach(btn => btn.addEventListener("click", () => { state.cancellingId = null; rerender(); }));
  document.getElementById("astat-new-date")?.addEventListener("change", e => { state.newDate = e.target.value; state.newTime = ""; rerender(); });
  document.getElementById("astat-new-time")?.addEventListener("change", e => { state.newTime = e.target.value; });
  document.querySelectorAll("[data-confirm-reschedule]").forEach(btn => btn.addEventListener("click", () => {
    if (state.newDate && state.newTime) { onReschedule(btn.dataset.confirmReschedule, state.newDate, state.newTime); state.reschedulingId = null; }
  }));
  document.querySelectorAll("[data-cancel-reschedule]").forEach(btn => btn.addEventListener("click", () => { state.reschedulingId = null; rerender(); }));
}
