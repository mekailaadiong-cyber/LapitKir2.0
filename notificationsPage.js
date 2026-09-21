let state = { typeFilter: "all" };
const TYPE_ICONS = { appointment: "📅", resource: "💊", system: "⚙️", emergency: "🚨" };
const TYPE_COLORS = { appointment: "bg-blue-50 border-blue-100", resource: "bg-emerald-50 border-emerald-100", system: "bg-slate-50 border-slate-100", emergency: "bg-red-50 border-red-200" };
const TYPE_ICON_BG = { appointment: "bg-blue-100 text-blue-700", resource: "bg-emerald-100 text-emerald-700", system: "bg-slate-200 text-slate-600", emergency: "bg-red-100 text-red-700" };

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) + " · " + d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
}

function render({ currentUser, notifications }) {
  const userNotifs = notifications.filter(n => n.userId === currentUser.id)
    .filter(n => state.typeFilter === "all" || n.type === state.typeFilter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.read).length;

  const filterBar = `
    <div class="flex items-center justify-between">
      <div class="flex rounded-lg overflow-hidden border" style="border-color:var(--border)">
        ${["all", "appointment", "resource", "emergency", "system"].map(t => `
          <button data-type="${t}" class="notif-type-btn px-3 py-2 text-xs font-medium capitalize transition-colors ${state.typeFilter === t ? "bg-sky-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}">${t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}</button>`).join("")}
      </div>
      ${unreadCount > 0 ? `<button id="notif-mark-all" class="text-xs text-sky-600 hover:underline font-medium">Mark all as read (${unreadCount})</button>` : ""}
    </div>`;

  const list = userNotifs.length === 0
    ? `<div class="bg-white rounded-xl p-12 text-center shadow-sm" style="border:1px solid var(--border)"><p class="text-4xl mb-3">🔔</p><p class="text-slate-500 text-sm">No notifications yet.</p></div>`
    : `<div class="space-y-2">${userNotifs.map(n => `
        <div data-mark="${n.id}" class="notif-item flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${TYPE_COLORS[n.type]} ${!n.read ? "ring-1 ring-sky-200" : ""}">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${TYPE_ICON_BG[n.type]}">${TYPE_ICONS[n.type]}</div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-sm font-semibold ${!n.read ? "text-slate-900" : "text-slate-700"}">${n.title}</p>
              ${!n.read ? `<span class="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0 inline-block"></span>` : ""}
            </div>
            <p class="text-xs mt-0.5 leading-relaxed ${!n.read ? "text-slate-700" : "text-slate-500"}">${n.message}</p>
            <p class="text-xs text-slate-400 mt-1 font-mono">${formatTime(n.createdAt)}</p>
          </div>
          ${!n.read ? `<button data-mark-btn="${n.id}" class="text-xs text-sky-600 hover:underline font-medium flex-shrink-0">Mark read</button>` : ""}
        </div>`).join("")}</div>`;

  return `<div class="space-y-5 max-w-2xl">${filterBar}${list}</div>`;
}

export function renderNotificationsPage(ctx) { return render(ctx); }

export function attachNotificationsEvents(ctx) {
  const { onMarkRead, onMarkAllRead } = ctx;
  function rerender() {
    const el = document.getElementById("page-content");
    if (el) { el.innerHTML = render(ctx); attachNotificationsEvents(ctx); }
  }
  document.querySelectorAll(".notif-type-btn").forEach(btn => btn.addEventListener("click", () => { state.typeFilter = btn.dataset.type; rerender(); }));
  document.getElementById("notif-mark-all")?.addEventListener("click", onMarkAllRead);
  document.querySelectorAll(".notif-item").forEach(el => el.addEventListener("click", () => { if (el.dataset.mark) onMarkRead(el.dataset.mark); }));
  document.querySelectorAll("[data-mark-btn]").forEach(btn => btn.addEventListener("click", (e) => { e.stopPropagation(); onMarkRead(btn.dataset.markBtn); }));
}
