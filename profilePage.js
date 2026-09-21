const BARANGAYS = ["Dao", "Tuburan", "Lourdes Norte", "Lourdes Sur", "Poblacion", "San Pedro", "Baloyboan", "Bandera", "Bantal", "Datagan", "Dumagoc", "Kagawasan", "Lumbia", "Muricay", "Napolan", "Olutanga", "San Francisco", "Santa Lucia", "Santiago", "Tawagan Norte", "Tawagan Sur", "Tiguma", "Upper Sibul", "White Beach"];
const ROLE_DISPLAY = { patient: "Patient", staff: "Health Worker", admin: "Administrator" };
const ROLE_COLOR = { patient: "bg-sky-100 text-sky-800", staff: "bg-emerald-100 text-emerald-800", admin: "bg-purple-100 text-purple-800" };

let state = { activeTab: "profile", editing: false, saved: false, pwSaved: false, pwError: "", form: null };

function initForm(currentUser) {
  if (!state.form) {
    state.form = { name: currentUser.name, phone: currentUser.phone, address: currentUser.address, barangay: currentUser.barangay ?? "", dateOfBirth: currentUser.dateOfBirth ?? "", sex: currentUser.sex ?? "Prefer not to say" };
  }
}

function render({ currentUser }) {
  initForm(currentUser);
  const f = state.form;
  const disabled = !state.editing;

  return `
    <div class="max-w-xl space-y-5">
      <div class="bg-white rounded-xl shadow-sm p-6 flex items-center gap-5 flex-wrap" style="border:1px solid var(--border)">
        <div class="w-16 h-16 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold text-2xl font-['Outfit'] flex-shrink-0">${currentUser.name.charAt(0)}</div>
        <div>
          <h2 class="font-['Outfit'] font-bold text-xl text-slate-800">${currentUser.name}</h2>
          <p class="text-sm text-slate-500">${currentUser.email}</p>
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${ROLE_COLOR[currentUser.role]}">${ROLE_DISPLAY[currentUser.role]}</span>
        </div>
        <div class="ml-auto text-right flex-shrink-0">
          <p class="text-xs text-slate-400">Member since</p>
          <p class="text-xs font-mono text-slate-600">${currentUser.createdAt}</p>
          <div class="flex items-center gap-1 mt-1 justify-end"><span class="w-2 h-2 rounded-full bg-emerald-500"></span><span class="text-xs text-emerald-600 font-medium">Verified</span></div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden" style="border:1px solid var(--border)">
        <div class="flex border-b" style="border-color:var(--border)">
          <button data-ptab="profile" class="px-5 py-3.5 text-sm font-medium border-b-2 capitalize transition-colors ${state.activeTab === "profile" ? "border-sky-600 text-sky-700" : "border-transparent text-slate-500 hover:text-slate-700"}">👤 Personal Info</button>
          <button data-ptab="security" class="px-5 py-3.5 text-sm font-medium border-b-2 capitalize transition-colors ${state.activeTab === "security" ? "border-sky-600 text-sky-700" : "border-transparent text-slate-500 hover:text-slate-700"}">🔒 Security</button>
        </div>

        ${state.activeTab === "profile" ? `
          <div class="p-5">
            ${state.saved ? `<div class="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3 flex items-center gap-2"><span>✓</span> Profile updated successfully.</div>` : ""}
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2"><label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Full Name</label>
                  <input id="pf-name" value="${f.name}" ${disabled ? "disabled" : ""} class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500" style="border-color:var(--border)" /></div>
                <div class="col-span-2"><label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Email Address</label>
                  <input value="${currentUser.email}" disabled class="w-full px-3 py-2.5 border rounded-lg text-sm bg-slate-50 text-slate-400 cursor-not-allowed" style="border-color:var(--border)" />
                  <p class="text-xs text-slate-400 mt-1">Email cannot be changed. Contact admin if needed.</p></div>
                <div><label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Phone Number</label>
                  <input id="pf-phone" value="${f.phone}" ${disabled ? "disabled" : ""} class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500" style="border-color:var(--border)" /></div>
                <div><label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Date of Birth</label>
                  <input id="pf-dob" type="date" value="${f.dateOfBirth}" ${disabled ? "disabled" : ""} class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500" style="border-color:var(--border)" /></div>
                <div><label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Sex</label>
                  <select id="pf-sex" ${disabled ? "disabled" : ""} class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white disabled:bg-slate-50 disabled:text-slate-500" style="border-color:var(--border)">
                    ${["Male", "Female", "Prefer not to say"].map(s => `<option ${f.sex === s ? "selected" : ""}>${s}</option>`).join("")}
                  </select></div>
                <div><label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Barangay</label>
                  <select id="pf-barangay" ${disabled ? "disabled" : ""} class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white disabled:bg-slate-50 disabled:text-slate-500" style="border-color:var(--border)">
                    <option value="">Select barangay...</option>${BARANGAYS.map(b => `<option ${f.barangay === b ? "selected" : ""}>${b}</option>`).join("")}
                  </select></div>
                <div class="col-span-2"><label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Home Address</label>
                  <input id="pf-address" value="${f.address}" ${disabled ? "disabled" : ""} class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500" style="border-color:var(--border)" /></div>
              </div>
              <div class="pt-3 border-t flex gap-3" style="border-color:var(--border)">
                ${state.editing ? `
                  <button id="pf-save" class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors">Save Changes</button>
                  <button id="pf-cancel" class="px-4 py-2.5 border text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50" style="border-color:var(--border)">Cancel</button>` : `
                  <button id="pf-edit" class="px-5 py-2.5 border border-sky-300 text-sky-700 hover:bg-sky-50 text-sm font-semibold rounded-lg transition-colors">Edit Profile</button>`}
              </div>
            </div>
          </div>` : `
          <div class="p-5">
            ${state.pwSaved ? `<div class="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3 flex items-center gap-2"><span>✓</span> Password changed successfully.</div>` : ""}
            <form id="pw-form" class="space-y-4">
              <div><label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Current Password</label><input id="pw-current" type="password" required class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" placeholder="••••••••" /></div>
              <div><label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">New Password</label><input id="pw-new" type="password" required class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" placeholder="Minimum 8 characters" /></div>
              <div><label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Confirm New Password</label><input id="pw-confirm" type="password" required class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" style="border-color:var(--border)" placeholder="Re-enter new password" /></div>
              ${state.pwError ? `<div class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">${state.pwError}</div>` : ""}
              <button type="submit" class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors">Update Password</button>
            </form>
            <div class="mt-6 pt-5 border-t" style="border-color:var(--border)">
              <h4 class="text-sm font-semibold text-slate-700 mb-3">Account Security</h4>
              <div class="space-y-2">
                ${[["Account Status", currentUser.active ? "Active" : "Inactive", currentUser.active], ["Email Verified", currentUser.verified ? "Verified" : "Unverified", currentUser.verified], ["Role", ROLE_DISPLAY[currentUser.role], true], ["Account Created", currentUser.createdAt, true]]
                  .map(([label, value, ok]) => `<div class="flex items-center justify-between text-sm"><span class="text-slate-500">${label}</span><span class="font-medium ${ok ? "text-emerald-700" : "text-red-600"}">${value}</span></div>`).join("")}
              </div>
            </div>
          </div>`}
      </div>
    </div>`;
}

export function renderProfilePage(ctx) { return render(ctx); }

export function attachProfileEvents(ctx) {
  const { currentUser, onUpdate } = ctx;
  function rerender() {
    const el = document.getElementById("page-content");
    if (el) { el.innerHTML = render(ctx); attachProfileEvents(ctx); }
  }
  document.querySelectorAll("[data-ptab]").forEach(btn => btn.addEventListener("click", () => { state.activeTab = btn.dataset.ptab; state.saved = false; state.pwSaved = false; rerender(); }));
  document.getElementById("pf-edit")?.addEventListener("click", () => { state.editing = true; rerender(); });
  document.getElementById("pf-cancel")?.addEventListener("click", () => { state.form = null; state.editing = false; rerender(); });
  document.getElementById("pf-save")?.addEventListener("click", () => {
    state.form.name = document.getElementById("pf-name").value;
    state.form.phone = document.getElementById("pf-phone").value;
    state.form.address = document.getElementById("pf-address").value;
    state.form.barangay = document.getElementById("pf-barangay").value;
    state.form.dateOfBirth = document.getElementById("pf-dob").value;
    state.form.sex = document.getElementById("pf-sex").value;
    onUpdate({ ...state.form });
    state.editing = false;
    state.saved = true;
    rerender();
    setTimeout(() => { state.saved = false; rerender(); }, 3000);
  });
  document.getElementById("pw-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    state.pwError = "";
    const cur = document.getElementById("pw-current").value;
    const next = document.getElementById("pw-new").value;
    const confirm = document.getElementById("pw-confirm").value;
    if (cur !== currentUser.password) { state.pwError = "Current password is incorrect."; rerender(); return; }
    if (next.length < 8) { state.pwError = "New password must be at least 8 characters."; rerender(); return; }
    if (next !== confirm) { state.pwError = "Passwords do not match."; rerender(); return; }
    onUpdate({ password: next });
    state.pwSaved = true;
    rerender();
    setTimeout(() => { state.pwSaved = false; rerender(); }, 3000);
  });
}
