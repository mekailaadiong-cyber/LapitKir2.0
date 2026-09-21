// LoginPage — sign in + full registration wizard (choose role → fill form → success),
// ported from the original React LoginPage.tsx.

import { USERS } from "./data.js";

const FACILITIES_LIST = ["BHC Dao", "Pagadian City Health Office", "RHU Lourdes Norte", "Pagadian City Medical Center", "BHC Tuburan", "BHC San Pedro"];
const BARANGAYS = ["Dao", "Tuburan", "Lourdes Norte", "Lourdes Sur", "Poblacion", "San Pedro", "Baloyboan", "Bandera", "Bantal", "Datagan", "Dumagoc", "Kagawasan", "Lumbia", "Muricay", "Napolan", "Olutanga", "San Francisco", "Santa Lucia", "Santiago", "Tawagan Norte", "Tawagan Sur", "Tiguma", "Upper Sibul", "White Beach"];
const ROLE_CONFIG = {
  patient: { label: "Patient / Resident", icon: "👤", desc: "Access health services, book appointments, and check facility resources.", badge: "bg-sky-100 text-sky-800 border-sky-200" },
  staff: { label: "Health Worker", icon: "🩺", desc: "Manage queues, update facility status, and coordinate patient appointments.", badge: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  admin: { label: "Administrator", icon: "⚙️", desc: "Oversee citywide health resources, manage facilities and user accounts.", badge: "bg-purple-100 text-purple-800 border-purple-200" },
};
const ROLE_DISPLAY = { patient: "Patient", staff: "Health Worker", admin: "Administrator" };

const demoAccounts = [
  { label: "Patient", email: "juan@email.com", password: "patient123", color: "bg-sky-50 border-sky-200 text-sky-800" },
  { label: "Health Worker", email: "maria@bhc.gov.ph", password: "staff123", color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
  { label: "Administrator", email: "admin@pagadiancity.gov.ph", password: "admin123", color: "bg-purple-50 border-purple-200 text-purple-800" },
];

let state = {
  mode: "login",
  email: "", password: "", loginError: "",
  regStep: "choose-role", regRole: "patient", regError: "",
  regName: "", regEmail: "", regPhone: "", regPassword: "", regConfirm: "",
  regDOB: "", regSex: "Prefer not to say", regBarangay: "", regAddress: "",
  regFacility: "", regEmployeeId: "", regPosition: "",
  regDepartment: "", regAdminCode: "",
};

function resetReg() {
  Object.assign(state, {
    regStep: "choose-role", regError: "", regName: "", regEmail: "", regPhone: "", regPassword: "", regConfirm: "",
    regDOB: "", regSex: "Prefer not to say", regBarangay: "", regAddress: "",
    regFacility: "", regEmployeeId: "", regPosition: "", regDepartment: "", regAdminCode: "",
  });
}

const inputCls = "w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white";
const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";

function renderLogoHeader() {
  return `
    <div class="flex items-center gap-2 mb-6 justify-center">
      <div class="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
        <svg viewBox="0 0 24 24" class="w-5 h-5 fill-white"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
      </div>
      <span class="font-['Outfit'] font-bold text-white text-lg">LapitCare</span>
    </div>`;
}

function renderModeTabs() {
  return `
    <div class="flex bg-gray-200 rounded-lg p-1 mb-6">
      <button id="mode-login" class="flex-1 py-2 rounded-md text-sm font-medium transition-all ${state.mode === "login" ? "bg-white text-slate-800 shadow-sm" : "text-slate-600"}">Sign In</button>
      <button id="mode-register" class="flex-1 py-2 rounded-md text-sm font-medium transition-all ${state.mode === "register" ? "bg-white text-slate-800 shadow-sm" : "text-slate-600"}">Register</button>
    </div>`;
}

function renderLoginForm() {
  return `
    <div>
      <h3 class="font-['Outfit'] font-bold text-xl text-slate-800 mb-1">Welcome back</h3>
      <p class="text-sm text-slate-500 mb-5">Sign in to access the health portal.</p>
      <form id="login-form" class="space-y-4">
        <div><label class="${labelCls}">Email Address</label>
          <input id="login-email" type="email" required value="${state.email}" placeholder="your@email.com" class="${inputCls}" style="border-color:var(--border)" /></div>
        <div><label class="${labelCls}">Password</label>
          <input id="login-password" type="password" required value="${state.password}" placeholder="••••••••" class="${inputCls}" style="border-color:var(--border)" /></div>
        ${state.loginError ? `<div class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">${state.loginError}</div>` : ""}
        <button type="submit" class="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors">Sign In</button>
      </form>
      <div class="mt-5">
        <p class="text-xs text-slate-500 text-center mb-3 font-medium">Don't have an account? <button id="go-register" class="text-sky-600 hover:underline font-semibold">Register here</button></p>
        <p class="text-xs text-slate-500 text-center mb-3 font-medium">Quick Demo Access</p>
        <div class="space-y-2">
          ${demoAccounts.map(acc => `<button data-demo-email="${acc.email}" data-demo-password="${acc.password}" class="demo-btn w-full text-left px-3 py-2 rounded-lg border text-xs font-medium transition-colors hover:opacity-80 ${acc.color}"><span class="font-bold">${acc.label}:</span> ${acc.email} · <span class="opacity-70">${acc.password}</span></button>`).join("")}
        </div>
      </div>
    </div>`;
}

function renderChooseRole() {
  return `
    <div>
      <h3 class="font-['Outfit'] font-bold text-xl text-slate-800 mb-1">Create an Account</h3>
      <p class="text-sm text-slate-500 mb-5">Select your role to begin registration.</p>
      <div class="space-y-3">
        ${Object.entries(ROLE_CONFIG).map(([role, cfg]) => `
          <button data-role="${role}" class="w-full text-left px-4 py-4 rounded-xl border-2 transition-all ${state.regRole === role ? "border-sky-500 bg-sky-50" : "border-slate-200 bg-white hover:border-slate-300"}">
            <div class="flex items-center gap-3">
              <span class="text-2xl">${cfg.icon}</span>
              <div><p class="font-semibold text-sm text-slate-800">${cfg.label}</p><p class="text-xs text-slate-500 mt-0.5">${cfg.desc}</p></div>
              <div class="ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${state.regRole === role ? "border-sky-500 bg-sky-500" : "border-slate-300"}">${state.regRole === role ? `<div class="w-2 h-2 rounded-full bg-white"></div>` : ""}</div>
            </div>
          </button>`).join("")}
      </div>
      ${state.regRole === "admin" ? `<div class="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800"><span class="font-semibold">⚠ Administrator accounts</span> require a registration code issued by the Pagadian City Health Department.</div>` : ""}
      ${state.regRole === "staff" ? `<div class="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-xs text-emerald-800"><span class="font-semibold">ℹ Health Worker accounts</span> are reviewed and activated by an administrator within 1–2 business days.</div>` : ""}
      <button id="continue-role" class="w-full mt-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors">Continue as ${ROLE_CONFIG[state.regRole].label} →</button>
      <p class="text-xs text-slate-500 text-center mt-4">Already have an account? <button id="go-login-from-role" class="text-sky-600 hover:underline font-semibold">Sign in</button></p>
    </div>`;
}

function renderFillForm() {
  const roleSpecific = state.regRole === "patient" ? `
    <div class="grid grid-cols-2 gap-3">
      <div><label class="${labelCls}">Date of Birth</label><input id="reg-dob" type="date" value="${state.regDOB}" class="${inputCls}" style="border-color:var(--border)" /></div>
      <div><label class="${labelCls}">Sex</label>
        <select id="reg-sex" class="${inputCls}" style="border-color:var(--border)">
          ${["Male", "Female", "Prefer not to say"].map(s => `<option ${state.regSex === s ? "selected" : ""}>${s}</option>`).join("")}
        </select></div>
    </div>
    <div><label class="${labelCls}">Barangay</label>
      <select id="reg-barangay" class="${inputCls}" style="border-color:var(--border)">
        <option value="">Select barangay...</option>${BARANGAYS.map(b => `<option ${state.regBarangay === b ? "selected" : ""}>${b}</option>`).join("")}
      </select></div>
    <div><label class="${labelCls}">Home Address</label><input id="reg-address" type="text" value="${state.regAddress}" placeholder="Street, Barangay, Pagadian City" class="${inputCls}" style="border-color:var(--border)" /></div>`
    : state.regRole === "staff" ? `
    <div><label class="${labelCls}">Assigned Facility <span class="text-red-500">*</span></label>
      <select id="reg-facility" class="${inputCls}" style="border-color:var(--border)">
        <option value="">Select facility...</option>${FACILITIES_LIST.map(f => `<option ${state.regFacility === f ? "selected" : ""}>${f}</option>`).join("")}
      </select></div>
    <div class="grid grid-cols-2 gap-3">
      <div><label class="${labelCls}">Employee ID</label><input id="reg-employee-id" type="text" value="${state.regEmployeeId}" placeholder="EMP-2025-XXXX" class="${inputCls}" style="border-color:var(--border)" /></div>
      <div><label class="${labelCls}">Position / Title</label><input id="reg-position" type="text" value="${state.regPosition}" placeholder="Nurse, Doctor, etc." class="${inputCls}" style="border-color:var(--border)" /></div>
    </div>
    <div class="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-emerald-700">Your account will be reviewed by an administrator. You will receive an email once activated.</div>`
    : `
    <div class="grid grid-cols-2 gap-3">
      <div><label class="${labelCls}">Department</label><input id="reg-department" type="text" value="${state.regDepartment}" placeholder="City Health Office" class="${inputCls}" style="border-color:var(--border)" /></div>
      <div><label class="${labelCls}">Admin Code <span class="text-red-500">*</span></label><input id="reg-admin-code" type="text" value="${state.regAdminCode}" placeholder="Issued by PCHO" class="${inputCls}" style="border-color:var(--border)" /></div>
    </div>
    <div class="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-xs text-purple-700">The registration code is provided by the Pagadian City Health Office. Contact <span class="font-mono">sysadmin@pagadiancity.gov.ph</span>.</div>`;

  return `
    <div>
      <div class="flex items-center gap-2 mb-4">
        <button id="back-to-role" class="text-slate-400 hover:text-slate-600"><svg viewBox="0 0 24 24" class="w-5 h-5 fill-current"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></button>
        <span class="text-xs font-bold px-3 py-1 rounded-full border ${ROLE_CONFIG[state.regRole].badge}">${ROLE_CONFIG[state.regRole].icon} ${ROLE_CONFIG[state.regRole].label}</span>
      </div>
      <h3 class="font-['Outfit'] font-bold text-lg text-slate-800 mb-4">${state.regRole === "patient" ? "Personal Details" : state.regRole === "staff" ? "Health Worker Information" : "Administrator Registration"}</h3>
      <form id="reg-form" class="space-y-3">
        <div><label class="${labelCls}">Full Name <span class="text-red-500">*</span></label>
          <input id="reg-name" type="text" required value="${state.regName}" placeholder="${state.regRole === "patient" ? "Juan dela Cruz" : state.regRole === "staff" ? "Maria Santos, RN" : "Dr. Administrator"}" class="${inputCls}" style="border-color:var(--border)" /></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="${labelCls}">Email <span class="text-red-500">*</span></label>
            <input id="reg-email" type="email" required value="${state.regEmail}" placeholder="${state.regRole === "patient" ? "juan@email.com" : state.regRole === "staff" ? "maria@bhc.gov.ph" : "admin@pagadian.gov.ph"}" class="${inputCls}" style="border-color:var(--border)" /></div>
          <div><label class="${labelCls}">Phone <span class="text-red-500">*</span></label>
            <input id="reg-phone" type="tel" required value="${state.regPhone}" placeholder="09XX-XXX-XXXX" class="${inputCls}" style="border-color:var(--border)" /></div>
        </div>
        ${roleSpecific}
        <div class="pt-1 border-t" style="border-color:var(--border)">
          <div class="grid grid-cols-2 gap-3">
            <div><label class="${labelCls}">Password <span class="text-red-500">*</span></label>
              <input id="reg-password" type="password" required value="${state.regPassword}" placeholder="Min. 8 characters" class="${inputCls}" style="border-color:var(--border)" /></div>
            <div><label class="${labelCls}">Confirm <span class="text-red-500">*</span></label>
              <input id="reg-confirm" type="password" required value="${state.regConfirm}" placeholder="Re-enter" class="${inputCls}" style="border-color:var(--border)" /></div>
          </div>
        </div>
        ${state.regError ? `<div class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">${state.regError}</div>` : ""}
        <button type="submit" class="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors mt-1">Submit Registration</button>
      </form>
    </div>`;
}

function renderSuccess() {
  const msg = state.regRole === "patient"
    ? "Your patient account has been created and is ready to use. You can sign in right away."
    : state.regRole === "staff"
    ? `Your Health Worker account at <span class="font-semibold text-slate-700">${state.regFacility}</span> has been created. You can sign in right away.`
    : "Your Administrator account has been created. You can sign in right away.";
  return `
    <div class="text-center py-6">
      <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg viewBox="0 0 24 24" class="w-9 h-9 fill-emerald-600"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>
      <span class="text-xs font-bold px-3 py-1 rounded-full border ${ROLE_CONFIG[state.regRole].badge} inline-block mb-3">${ROLE_CONFIG[state.regRole].icon} ${ROLE_CONFIG[state.regRole].label}</span>
      <h3 class="font-['Outfit'] font-bold text-xl text-slate-800 mb-2">Account Created!</h3>
      <p class="text-sm text-slate-500 mb-5">${msg}</p>
      <button id="go-signin" class="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors">Continue to Sign In</button>
    </div>`;
}

export function renderLoginPage() {
  let inner;
  if (state.mode === "login") inner = renderLoginForm();
  else if (state.regStep === "choose-role") inner = renderChooseRole();
  else if (state.regStep === "fill-form") inner = renderFillForm();
  else inner = renderSuccess();

  return `
    <div class="login-screen min-h-screen flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        ${renderLogoHeader()}
        <div class="bg-white rounded-xl shadow-sm p-6" style="border:1px solid var(--border)">
          ${state.mode === "login" || state.regStep === "success" ? "" : renderModeTabs()}
          ${inner}
        </div>
      </div>
    </div>`;
}

export function attachLoginEvents({ onLogin }) {
  function rerender() {
    const app = document.getElementById("app");
    if (app) { app.innerHTML = renderLoginPage(); attachLoginEvents({ onLogin }); }
  }

  // Mode switching
  document.getElementById("mode-login")?.addEventListener("click", () => { state.mode = "login"; state.loginError = ""; resetReg(); rerender(); });
  document.getElementById("mode-register")?.addEventListener("click", () => { state.mode = "register"; resetReg(); rerender(); });
  document.getElementById("go-register")?.addEventListener("click", () => { state.mode = "register"; resetReg(); rerender(); });
  document.getElementById("go-login-from-role")?.addEventListener("click", () => { state.mode = "login"; state.loginError = ""; resetReg(); rerender(); });
  document.getElementById("go-signin")?.addEventListener("click", () => { state.mode = "login"; state.loginError = ""; resetReg(); rerender(); });

  // Demo accounts
  document.querySelectorAll(".demo-btn").forEach(btn => btn.addEventListener("click", () => {
    state.email = btn.dataset.demoEmail; state.password = btn.dataset.demoPassword; rerender();
  }));

  // Login form
  document.getElementById("login-email")?.addEventListener("input", e => { state.email = e.target.value; });
  document.getElementById("login-password")?.addEventListener("input", e => { state.password = e.target.value; });
  document.getElementById("login-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = USERS.find(u => u.email === state.email && u.password === state.password && u.active);
    if (user) { onLogin(user); }
    else { state.loginError = "Invalid email or password. Please try again."; rerender(); }
  });

  // Choose role
  document.querySelectorAll("[data-role]").forEach(btn => btn.addEventListener("click", () => { state.regRole = btn.dataset.role; rerender(); }));
  document.getElementById("continue-role")?.addEventListener("click", () => { state.regStep = "fill-form"; rerender(); });

  // Fill form
  document.getElementById("back-to-role")?.addEventListener("click", () => { state.regStep = "choose-role"; rerender(); });
  const bind = (id, key) => document.getElementById(id)?.addEventListener("input", e => { state[key] = e.target.value; });
  bind("reg-name", "regName"); bind("reg-email", "regEmail"); bind("reg-phone", "regPhone");
  bind("reg-dob", "regDOB"); bind("reg-barangay", "regBarangay"); bind("reg-address", "regAddress");
  bind("reg-facility", "regFacility"); bind("reg-employee-id", "regEmployeeId"); bind("reg-position", "regPosition");
  bind("reg-department", "regDepartment"); bind("reg-admin-code", "regAdminCode");
  bind("reg-password", "regPassword"); bind("reg-confirm", "regConfirm");
  document.getElementById("reg-sex")?.addEventListener("change", e => { state.regSex = e.target.value; });
  document.getElementById("reg-barangay")?.addEventListener("change", e => { state.regBarangay = e.target.value; });
  document.getElementById("reg-facility")?.addEventListener("change", e => { state.regFacility = e.target.value; });

  document.getElementById("reg-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    state.regError = "";
    if (!state.regName || !state.regEmail || !state.regPhone || !state.regPassword) { state.regError = "Please fill in all required fields."; rerender(); return; }
    if (state.regPassword !== state.regConfirm) { state.regError = "Passwords do not match."; rerender(); return; }
    if (state.regPassword.length < 8) { state.regError = "Password must be at least 8 characters."; rerender(); return; }
    if (USERS.find(u => u.email === state.regEmail)) { state.regError = "An account with this email already exists."; rerender(); return; }
    if (state.regRole === "staff" && !state.regFacility) { state.regError = "Please select an assigned facility."; rerender(); return; }
    if (state.regRole === "admin" && state.regAdminCode !== "PAGADIAN2025") { state.regError = "Invalid administrator registration code."; rerender(); return; }

    const newUser = {
      id: `u${Date.now()}`, name: state.regName, email: state.regEmail, password: state.regPassword,
      role: state.regRole, phone: state.regPhone, address: state.regAddress || "",
      active: true, verified: true, createdAt: new Date().toISOString().split("T")[0],
    };
    if (state.regRole === "patient") { newUser.barangay = state.regBarangay; newUser.dateOfBirth = state.regDOB; newUser.sex = state.regSex; }
    if (state.regRole === "staff") {
      const facilityIdMap = { "BHC Dao": "f1", "Pagadian City Health Office": "f2", "RHU Lourdes Norte": "f3", "Pagadian City Medical Center": "f4", "BHC Tuburan": "f5", "BHC San Pedro": "f6" };
      newUser.facilityId = facilityIdMap[state.regFacility];
      newUser.barangay = "";
    }
    USERS.push(newUser);

    state.regStep = "success";
    rerender();
  });
}
