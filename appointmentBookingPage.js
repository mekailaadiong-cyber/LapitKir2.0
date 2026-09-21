import { FACILITIES, SERVICES, APPOINTMENT_SLOTS } from "./data.js";

let wiz = { step: 1, facilityId: "", serviceId: "", date: "", time: "", notes: "", booked: false, bookedId: "" };
const UNAVAILABLE_SLOTS = ["08:30 AM", "09:30 AM"];

function minDateStr() {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function facilityServicesFor(facilityId) {
  return SERVICES.filter(s => s.facilities.some(f => f.facilityId === facilityId && f.status !== "Unavailable"));
}

function stepsBar() {
  const STEPS = ["Select Facility", "Select Service", "Choose Date & Time", "Confirm"];
  return `
    <div class="bg-white rounded-xl shadow-sm p-5" style="border:1px solid var(--border)">
      <div class="flex items-center">
        ${STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isDone = wiz.step > stepNum;
          const isActive = wiz.step === stepNum;
          return `
            <div class="flex-1 flex items-center">
              <div class="flex items-center gap-2 ${i > 0 ? "pl-2" : ""}">
                <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isDone ? "bg-emerald-500 text-white" : isActive ? "bg-sky-600 text-white" : "bg-slate-200 text-slate-500"}">${isDone ? "✓" : stepNum}</div>
                <span class="text-xs font-medium hidden sm:block ${isActive ? "text-sky-700" : isDone ? "text-emerald-700" : "text-slate-400"}">${label}</span>
              </div>
              ${i < STEPS.length - 1 ? `<div class="flex-1 h-0.5 mx-2 ${isDone ? "bg-emerald-400" : "bg-slate-200"}"></div>` : ""}
            </div>`;
        }).join("")}
      </div>
    </div>`;
}

function step1() {
  return `
    <div class="bg-white rounded-xl shadow-sm" style="border:1px solid var(--border)">
      <div class="px-5 py-4 border-b" style="border-color:var(--border)"><h3 class="font-['Outfit'] font-semibold text-slate-800">Select a Health Facility</h3></div>
      <div class="p-5 space-y-3">
        ${FACILITIES.filter(f => f.active).map(f => `
          <label class="flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${wiz.facilityId === f.id ? "border-sky-500 bg-sky-50" : "hover:border-slate-300"}" style="border-color:${wiz.facilityId === f.id ? "" : "var(--border)"}">
            <input type="radio" name="facility" value="${f.id}" ${wiz.facilityId === f.id ? "checked" : ""} class="wiz-facility-radio mt-0.5 accent-sky-600" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5 flex-wrap"><p class="font-semibold text-slate-800 text-sm">${f.name}</p>${f.emergency ? `<span class="text-xs bg-red-100 text-red-700 border border-red-200 rounded-full px-2 py-0.5 font-medium">🚨 Emergency</span>` : ""}</div>
              <p class="text-xs text-slate-500">${f.type} · ${f.hours}</p>
              <p class="text-xs text-slate-400 mt-0.5">📍 ${f.address}</p>
            </div>
          </label>`).join("")}
        <div class="pt-3 flex justify-end">
          <button id="wiz-next-1" ${!wiz.facilityId ? "disabled" : ""} class="px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Next: Select Service →</button>
        </div>
      </div>
    </div>`;
}

function step2() {
  const facility = FACILITIES.find(f => f.id === wiz.facilityId);
  const facilityServices = facilityServicesFor(wiz.facilityId);
  return `
    <div class="bg-white rounded-xl shadow-sm" style="border:1px solid var(--border)">
      <div class="px-5 py-4 border-b" style="border-color:var(--border)">
        <p class="text-xs text-slate-400 font-medium">Facility: <span class="text-slate-700">${facility?.name ?? ""}</span></p>
        <h3 class="font-['Outfit'] font-semibold text-slate-800 mt-0.5">Select a Service</h3>
      </div>
      <div class="p-5 space-y-3">
        ${facilityServices.map(svc => {
          const facSvc = svc.facilities.find(f => f.facilityId === wiz.facilityId);
          if (!facSvc || facSvc.status === "Unavailable") return "";
          return `
            <label class="flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${wiz.serviceId === svc.id ? "border-sky-500 bg-sky-50" : "hover:border-slate-300"}" style="border-color:${wiz.serviceId === svc.id ? "" : "var(--border)"}">
              <input type="radio" name="service" value="${svc.id}" ${wiz.serviceId === svc.id ? "checked" : ""} class="wiz-service-radio mt-0.5 accent-sky-600" />
              <div>
                <div class="flex items-center gap-2 mb-0.5 flex-wrap"><p class="font-semibold text-slate-800 text-sm">${svc.name}</p>${facSvc.status === "Limited" ? `<span class="text-xs bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">Limited</span>` : ""}</div>
                <p class="text-xs text-slate-500">${svc.category} · Schedule: ${facSvc.schedule}</p>
                <p class="text-xs text-slate-400 mt-0.5">👤 ${facSvc.personnel}</p>
              </div>
            </label>`;
        }).join("")}
        <div class="pt-3 flex justify-between">
          <button id="wiz-back-2" class="px-4 py-2 rounded-lg border text-slate-600 text-sm font-medium hover:bg-slate-50" style="border-color:var(--border)">← Back</button>
          <button id="wiz-next-2" ${!wiz.serviceId ? "disabled" : ""} class="px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Next: Choose Date →</button>
        </div>
      </div>
    </div>`;
}

function step3() {
  const facility = FACILITIES.find(f => f.id === wiz.facilityId);
  const service = SERVICES.find(s => s.id === wiz.serviceId);
  const slots = wiz.serviceId ? (APPOINTMENT_SLOTS[wiz.serviceId] ?? []) : [];
  return `
    <div class="bg-white rounded-xl shadow-sm" style="border:1px solid var(--border)">
      <div class="px-5 py-4 border-b" style="border-color:var(--border)">
        <p class="text-xs text-slate-400">${facility?.name ?? ""} · ${service?.name ?? ""}</p>
        <h3 class="font-['Outfit'] font-semibold text-slate-800 mt-0.5">Choose Date & Time</h3>
      </div>
      <div class="p-5 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Appointment Date</label>
          <input id="wiz-date" type="date" value="${wiz.date}" min="${minDateStr()}" class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" />
        </div>
        ${wiz.date ? `
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Available Time Slots</label>
            <div class="grid grid-cols-3 gap-2">
              ${slots.map(slot => {
                const isUnavail = UNAVAILABLE_SLOTS.includes(slot);
                const isWalkIn = slot.startsWith("No appointment");
                const cls = wiz.time === slot ? "bg-sky-600 border-sky-600 text-white" :
                  isUnavail ? "bg-red-50 border-red-200 text-red-400 cursor-not-allowed" :
                  isWalkIn ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed col-span-3" :
                  "border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-700";
                return `<button data-slot="${slot}" ${isUnavail || isWalkIn ? "disabled" : ""} class="wiz-slot-btn py-2 px-3 rounded-lg border text-xs font-medium transition-all text-center ${cls}">${isUnavail ? `<s>${slot}</s> Taken` : slot}</button>`;
              }).join("")}
            </div>
          </div>` : ""}
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Notes / Reason for Visit (Optional)</label>
          <textarea id="wiz-notes" rows="3" placeholder="Describe your symptoms or reason for the appointment..." class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" style="border-color:var(--border)">${wiz.notes}</textarea>
        </div>
        <div class="flex justify-between">
          <button id="wiz-back-3" class="px-4 py-2 rounded-lg border text-slate-600 text-sm font-medium hover:bg-slate-50" style="border-color:var(--border)">← Back</button>
          <button id="wiz-next-3" ${!wiz.date || !wiz.time ? "disabled" : ""} class="px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Review Booking →</button>
        </div>
      </div>
    </div>`;
}

function step4(currentUser) {
  const facility = FACILITIES.find(f => f.id === wiz.facilityId);
  const service = SERVICES.find(s => s.id === wiz.serviceId);
  const rows = [
    ["Patient Name", currentUser.name], ["Contact", currentUser.phone],
    ["Facility", facility?.name], ["Service", service?.name],
    ["Date", wiz.date], ["Time", wiz.time], ["Notes", wiz.notes || "None"],
  ];
  return `
    <div class="bg-white rounded-xl shadow-sm" style="border:1px solid var(--border)">
      <div class="px-5 py-4 border-b" style="border-color:var(--border)"><h3 class="font-['Outfit'] font-semibold text-slate-800">Review & Confirm Appointment</h3></div>
      <div class="p-5 space-y-4">
        <div class="bg-slate-50 rounded-xl p-5 space-y-3 text-sm" style="border:1px solid var(--border)">
          <h4 class="font-semibold text-slate-700 font-['Outfit']">Appointment Details</h4>
          ${rows.map(([label, value]) => `<div class="flex justify-between gap-4"><span class="text-slate-500 flex-shrink-0">${label}:</span><span class="font-medium text-slate-800 text-right">${value}</span></div>`).join("")}
        </div>
        <div class="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800">
          <p class="font-semibold mb-0.5">Please note:</p>
          <p>Your appointment will be <strong>Pending</strong> until confirmed by the facility. You will receive a notification once approved. Please arrive 15 minutes before your scheduled time.</p>
        </div>
        <div class="flex justify-between">
          <button id="wiz-back-4" class="px-4 py-2 rounded-lg border text-slate-600 text-sm font-medium hover:bg-slate-50" style="border-color:var(--border)">← Edit</button>
          <button id="wiz-confirm" class="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors">✓ Confirm Appointment</button>
        </div>
      </div>
    </div>`;
}

function successScreen() {
  const facility = FACILITIES.find(f => f.id === wiz.facilityId);
  const service = SERVICES.find(s => s.id === wiz.serviceId);
  return `
    <div class="max-w-md mx-auto mt-8">
      <div class="bg-white rounded-2xl shadow-sm p-8 text-center" style="border:1px solid var(--border)">
        <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" class="w-9 h-9 fill-emerald-600"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        </div>
        <h3 class="font-['Outfit'] font-bold text-xl text-slate-800 mb-2">Appointment Submitted!</h3>
        <p class="text-sm text-slate-500 mb-1">Your appointment request is now <span class="font-semibold text-blue-600">Pending</span> review.</p>
        <p class="text-xs text-slate-400 mb-6">You will receive a notification once it is approved or needs action.</p>
        <div class="bg-slate-50 rounded-xl p-4 text-left text-sm space-y-1.5 mb-6" style="border:1px solid var(--border)">
          <div class="flex justify-between"><span class="text-slate-500">Facility:</span><span class="font-medium">${facility?.name ?? ""}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Service:</span><span class="font-medium">${service?.name ?? ""}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Date:</span><span class="font-medium font-mono">${wiz.date}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Time:</span><span class="font-medium font-mono">${wiz.time}</span></div>
        </div>
        <button id="wiz-book-another" class="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors">Book Another Appointment</button>
      </div>
    </div>`;
}

export function renderAppointmentBookingPage({ currentUser }) {
  if (wiz.booked) return successScreen();
  return `
    <div class="max-w-2xl mx-auto space-y-5" id="booking-wizard">
      ${stepsBar()}
      ${wiz.step === 1 ? step1() : wiz.step === 2 ? step2() : wiz.step === 3 ? step3() : step4(currentUser)}
    </div>`;
}

export function attachAppointmentBookingEvents({ currentUser, onBook }) {
  function rerender() {
    const container = document.getElementById("page-content");
    if (container) {
      container.innerHTML = renderAppointmentBookingPage({ currentUser });
      attachAppointmentBookingEvents({ currentUser, onBook });
    }
  }

  document.getElementById("wiz-next-1")?.addEventListener("click", () => { wiz.step = 2; rerender(); });
  document.querySelectorAll(".wiz-facility-radio").forEach(r => r.addEventListener("change", () => { wiz.facilityId = r.value; wiz.serviceId = ""; rerender(); }));
  document.querySelectorAll(".wiz-service-radio").forEach(r => r.addEventListener("change", () => { wiz.serviceId = r.value; rerender(); }));
  document.getElementById("wiz-back-2")?.addEventListener("click", () => { wiz.step = 1; rerender(); });
  document.getElementById("wiz-next-2")?.addEventListener("click", () => { wiz.step = 3; rerender(); });
  document.getElementById("wiz-date")?.addEventListener("change", e => { wiz.date = e.target.value; wiz.time = ""; rerender(); });
  document.querySelectorAll(".wiz-slot-btn").forEach(btn => btn.addEventListener("click", () => { wiz.time = btn.dataset.slot; rerender(); }));
  document.getElementById("wiz-notes")?.addEventListener("input", e => { wiz.notes = e.target.value; });
  document.getElementById("wiz-back-3")?.addEventListener("click", () => { wiz.step = 2; rerender(); });
  document.getElementById("wiz-next-3")?.addEventListener("click", () => { wiz.step = 4; rerender(); });
  document.getElementById("wiz-back-4")?.addEventListener("click", () => { wiz.step = 3; rerender(); });
  document.getElementById("wiz-confirm")?.addEventListener("click", () => {
    const facility = FACILITIES.find(f => f.id === wiz.facilityId);
    const service = SERVICES.find(s => s.id === wiz.serviceId);
    const appt = {
      id: `a${Date.now()}`, userId: currentUser.id, userName: currentUser.name, userPhone: currentUser.phone,
      facilityId: wiz.facilityId, facilityName: facility?.name ?? "", serviceId: wiz.serviceId, serviceName: service?.name ?? "",
      date: wiz.date, time: wiz.time, status: "Pending", notes: wiz.notes,
      createdAt: new Date().toISOString().split("T")[0], updatedAt: new Date().toISOString().split("T")[0],
    };
    onBook(appt);
    wiz.booked = true;
    wiz.bookedId = appt.id;
    rerender();
  });
  document.getElementById("wiz-book-another")?.addEventListener("click", () => {
    wiz = { step: 1, facilityId: "", serviceId: "", date: "", time: "", notes: "", booked: false, bookedId: "" };
    rerender();
  });
}

export function resetBookingWizard() {
  wiz = { step: 1, facilityId: "", serviceId: "", date: "", time: "", notes: "", booked: false, bookedId: "" };
}
