import { FACILITIES } from "./data.js";
import { statusBadge } from "./statusBadge.js";

const CATEGORIES = ["Service Quality", "Staff Attitude", "Facility Cleanliness", "Wait Time", "Medicine Availability", "General"];
let state = { activeTab: "submit", facilityId: "", rating: 0, category: CATEGORIES[0], comment: "", submitted: false, errors: [], respondingId: null, responseText: "" };

function stars(value, interactive) {
  return `<div class="flex gap-1">${[1,2,3,4,5].map(s => `<button type="button" ${interactive ? `data-star="${s}"` : "disabled"} class="text-2xl transition-colors ${s <= value ? "text-amber-400" : "text-slate-200"} ${interactive ? "hover:text-amber-300 cursor-pointer" : "cursor-default"}">★</button>`).join("")}</div>`;
}
const RATING_LABEL = { 1: "Very Poor", 2: "Poor", 3: "Satisfactory", 4: "Good", 5: "Excellent" };

function render({ currentUser, feedbacks }) {
  const userFeedbacks = feedbacks.filter(f => currentUser.role === "patient" ? f.userId === currentUser.id : true)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const tabs = `
    <div class="flex border-b" style="border-color:var(--border)">
      <button data-fbtab="submit" class="px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${state.activeTab === "submit" ? "border-sky-600 text-sky-700" : "border-transparent text-slate-500 hover:text-slate-700"}">📝 Submit Feedback</button>
      <button data-fbtab="history" class="px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${state.activeTab === "history" ? "border-sky-600 text-sky-700" : "border-transparent text-slate-500 hover:text-slate-700"}">📋 Feedback History (${userFeedbacks.length})</button>
    </div>`;

  let body = "";
  if (state.activeTab === "submit") {
    body = state.submitted ? `
      <div class="text-center py-6">
        <div class="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg viewBox="0 0 24 24" class="w-8 h-8 fill-emerald-600"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>
        <h3 class="font-['Outfit'] font-bold text-lg text-slate-800 mb-2">Feedback Submitted!</h3>
        <p class="text-sm text-slate-500 mb-4">Thank you for your feedback. It will be reviewed by the facility staff.</p>
        <div class="flex gap-3 justify-center">
          <button id="fb-submit-another" class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg">Submit Another</button>
          <button data-fbtab="history" class="px-5 py-2.5 border text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50" style="border-color:var(--border)">View History</button>
        </div>
      </div>` : `
      <form id="fb-form" class="space-y-4">
        <div><label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Health Facility</label>
          <select id="fb-facility" class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white" style="border-color:var(--border)">
            <option value="">Select a facility...</option>${FACILITIES.filter(f => f.active).map(f => `<option value="${f.id}" ${state.facilityId === f.id ? "selected" : ""}>${f.name}</option>`).join("")}
          </select></div>
        <div><label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Category</label>
          <select id="fb-category" class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white" style="border-color:var(--border)">${CATEGORIES.map(c => `<option ${state.category === c ? "selected" : ""}>${c}</option>`).join("")}</select></div>
        <div><label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Rating</label>
          <div id="fb-stars">${stars(state.rating, true)}</div>
          ${state.rating > 0 ? `<p class="text-xs text-slate-400 mt-1">${RATING_LABEL[state.rating]}</p>` : ""}</div>
        <div><label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Your Comments</label>
          <textarea id="fb-comment" rows="4" placeholder="Share your experience with this health facility..." class="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" style="border-color:var(--border)">${state.comment}</textarea></div>
        ${state.errors.length > 0 ? `<div class="bg-red-50 border border-red-200 rounded-lg px-4 py-3">${state.errors.map(e => `<p class="text-xs text-red-700">${e}</p>`).join("")}</div>` : ""}
        <button type="submit" class="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors">Submit Feedback</button>
      </form>`;
  } else {
    body = userFeedbacks.length === 0 ? `<div class="p-12 text-center text-slate-400 text-sm">No feedback submitted yet.</div>` : `
      <div class="divide-y" style="border-color:var(--border)">
        ${userFeedbacks.map(fb => `
          <div class="p-5">
            <div class="flex items-start justify-between gap-4 mb-2">
              <div><p class="font-semibold text-slate-800 text-sm">${fb.facilityName}</p><p class="text-xs text-slate-500">${fb.category} · ${fb.createdAt}</p>${currentUser.role !== "patient" ? `<p class="text-xs text-slate-400">By: ${fb.userName}</p>` : ""}</div>
              <div class="flex items-center gap-2 flex-shrink-0">${statusBadge(fb.status)}</div>
            </div>
            ${stars(fb.rating, false)}
            <p class="text-sm text-slate-600 mt-2">${fb.comment}</p>
            ${fb.response ? `<div class="mt-3 bg-sky-50 border border-sky-200 rounded-lg px-4 py-3"><p class="text-xs font-semibold text-sky-700 mb-0.5">Staff Response:</p><p class="text-xs text-sky-800">${fb.response}</p></div>` : ""}
            ${(currentUser.role === "staff" || currentUser.role === "admin") && fb.status === "Pending" ? `
              <div class="mt-3">
                ${state.respondingId === fb.id ? `
                  <div class="space-y-2">
                    <textarea id="fb-response-input" rows="2" placeholder="Write a response..." class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none resize-none bg-white" style="border-color:var(--border)">${state.responseText}</textarea>
                    <div class="flex gap-2">
                      <button data-fb-respond-confirm="${fb.id}" class="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg">Submit Response</button>
                      <button id="fb-respond-cancel" class="px-3 py-1.5 border rounded-lg text-xs text-slate-600" style="border-color:var(--border)">Cancel</button>
                    </div>
                  </div>` : `<button data-fb-respond-open="${fb.id}" class="text-xs text-sky-600 hover:underline font-medium">Respond to feedback</button>`}
              </div>` : ""}
          </div>`).join("")}
      </div>`;
  }

  return `<div class="space-y-5 max-w-2xl"><div class="bg-white rounded-xl shadow-sm overflow-hidden" style="border:1px solid var(--border)">${tabs}<div class="p-5">${body}</div></div></div>`;
}

export function renderFeedbackPage(ctx) { return render(ctx); }

export function attachFeedbackEvents(ctx) {
  const { currentUser, onSubmit, onRespond } = ctx;
  function rerender() {
    const el = document.getElementById("page-content");
    if (el) { el.innerHTML = render(ctx); attachFeedbackEvents(ctx); }
  }
  document.querySelectorAll("[data-fbtab]").forEach(btn => btn.addEventListener("click", () => { state.activeTab = btn.dataset.fbtab; rerender(); }));
  document.getElementById("fb-facility")?.addEventListener("change", e => { state.facilityId = e.target.value; });
  document.getElementById("fb-category")?.addEventListener("change", e => { state.category = e.target.value; });
  document.getElementById("fb-comment")?.addEventListener("input", e => { state.comment = e.target.value; });
  document.querySelectorAll("#fb-stars [data-star]").forEach(btn => btn.addEventListener("click", () => { state.rating = Number(btn.dataset.star); rerender(); }));
  document.getElementById("fb-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const errs = [];
    if (!state.facilityId) errs.push("Please select a facility.");
    if (state.rating === 0) errs.push("Please select a rating.");
    if (!state.comment.trim()) errs.push("Please write a comment.");
    state.errors = errs;
    if (errs.length > 0) { rerender(); return; }
    const fb = {
      id: `fb${Date.now()}`, userId: currentUser.id, userName: currentUser.name, facilityId: state.facilityId,
      facilityName: FACILITIES.find(f => f.id === state.facilityId)?.name ?? "", rating: state.rating, category: state.category,
      comment: state.comment, status: "Pending", createdAt: new Date().toISOString().split("T")[0],
    };
    onSubmit(fb);
    state.submitted = true;
    rerender();
  });
  document.getElementById("fb-submit-another")?.addEventListener("click", () => {
    state = { activeTab: "submit", facilityId: "", rating: 0, category: CATEGORIES[0], comment: "", submitted: false, errors: [], respondingId: null, responseText: "" };
    rerender();
  });
  document.querySelectorAll("[data-fb-respond-open]").forEach(btn => btn.addEventListener("click", () => { state.respondingId = btn.dataset.fbRespondOpen; state.responseText = ""; rerender(); }));
  document.getElementById("fb-respond-cancel")?.addEventListener("click", () => { state.respondingId = null; rerender(); });
  document.getElementById("fb-response-input")?.addEventListener("input", e => { state.responseText = e.target.value; });
  document.querySelectorAll("[data-fb-respond-confirm]").forEach(btn => btn.addEventListener("click", () => { onRespond(btn.dataset.fbRespondConfirm, state.responseText); state.respondingId = null; }));
}
