// Sidebar — role-filtered navigation.

const NAV = [
  { title: "Overview", items: [
    { id: "dashboard", label: "Dashboard", icon: "⬛", roles: ["patient", "staff", "admin"] },
  ]},
  { title: "Resources", items: [
    { id: "facilities", label: "Facility Directory", icon: "🏥", roles: ["patient", "staff", "admin"] },
    { id: "beds", label: "Bed Availability", icon: "🛏", roles: ["patient", "staff", "admin"] },
    { id: "equipment", label: "Equipment", icon: "🔬", roles: ["patient", "staff", "admin"] },
    { id: "services", label: "Services", icon: "🩺", roles: ["patient", "staff", "admin"] },
  ]},
  { title: "Appointments", items: [
    { id: "book-appointment", label: "Book Appointment", icon: "📅", roles: ["patient", "staff", "admin"] },
    { id: "my-appointments", label: "My Appointments", icon: "📋", roles: ["patient", "staff", "admin"] },
  ]},
  { title: "Account", items: [
    { id: "profile", label: "My Profile", icon: "👤", roles: ["patient", "staff", "admin"] },
    { id: "notifications", label: "Notifications", icon: "🔔", roles: ["patient", "staff", "admin"] },
    { id: "feedback", label: "Feedback", icon: "💬", roles: ["patient", "staff", "admin"] },
  ]},
  { title: "Staff Tools", items: [
    { id: "staff-dashboard", label: "Health Worker Dashboard", icon: "🗂", roles: ["staff", "admin"] },
    { id: "resource-history", label: "Resource History", icon: "📜", roles: ["staff", "admin"] },
    { id: "reports", label: "Reports & Analytics", icon: "📊", roles: ["staff", "admin"] },
  ]},
  { title: "Administration", items: [
    { id: "admin", label: "Admin Management", icon: "⚙️", roles: ["admin"] },
    { id: "activity-logs", label: "Activity Logs", icon: "📝", roles: ["admin"] },
  ]},
];

const ROLE_LABEL = { patient: "Patient", staff: "Health Worker", admin: "Administrator" };
const ROLE_BADGE_COLOR = { patient: "sidebar-role-patient", staff: "sidebar-role-staff", admin: "sidebar-role-admin" };

export function renderSidebar({ currentPage, currentUser, unreadCount, isOpen }) {
  const sections = NAV.map(section => {
    const visible = section.items.filter(item => item.roles.includes(currentUser.role));
    if (visible.length === 0) return "";
    const links = visible.map(item => {
      const active = currentPage === item.id;
      const notifBadge = (item.id === "notifications" && unreadCount > 0)
        ? `<span class="sidebar-notif-badge">${unreadCount > 9 ? "9+" : unreadCount}</span>` : "";
      return `
        <button data-page="${item.id}" class="sidebar-link w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-0.5 text-left ${active ? "sidebar-link-active" : "sidebar-link-inactive"}">
          <span class="text-base leading-none">${item.icon}</span>
          <span class="flex-1">${item.label}</span>
          ${notifBadge}
        </button>`;
    }).join("");
    return `
      <div class="mb-4">
        <p class="text-white/40 text-xs font-semibold uppercase tracking-wider px-3 mb-1">${section.title}</p>
        ${links}
      </div>`;
  }).join("");

  return `
    <div id="sidebar-overlay" class="sidebar-overlay ${isOpen ? "sidebar-overlay-visible" : ""}"></div>
    <aside class="app-sidebar fixed top-0 left-0 h-full w-60 flex flex-col z-30 transition-transform duration-300 ${isOpen ? "sidebar-open" : "sidebar-closed"}">
      <div class="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <div class="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" class="w-5 h-5 fill-white"><rect x="10" y="5" width="4" height="14"/><rect x="5" y="10" width="14" height="4"/></svg>
        </div>
        <div>
          <p class="text-white font-bold text-sm font-['Outfit']">LapitCare</p>
          <p class="text-white/50 text-xs">Public Health System</p>
        </div>
      </div>

      <div class="px-4 py-3 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">${currentUser.name.charAt(0)}</div>
          <div class="min-w-0">
            <p class="text-white text-sm font-medium truncate">${currentUser.name}</p>
            <span class="text-xs text-white font-semibold px-1.5 py-0.5 rounded ${ROLE_BADGE_COLOR[currentUser.role]}">${ROLE_LABEL[currentUser.role]}</span>
          </div>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto py-3 px-2">${sections}</nav>

      <div class="p-3 border-t border-white/10">
        <button id="logout-btn" class="sidebar-link w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/60 hover:bg-white/10 hover:text-white">
          <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
          Sign Out
        </button>
      </div>
    </aside>`;
}

export function attachSidebarEvents({ onNavigate, onLogout, onClose }) {
  document.querySelectorAll(".sidebar-link[data-page]").forEach(btn => {
    btn.addEventListener("click", () => { onNavigate(btn.dataset.page); onClose(); });
  });
  document.getElementById("logout-btn")?.addEventListener("click", onLogout);
  document.getElementById("sidebar-overlay")?.addEventListener("click", onClose);
}
