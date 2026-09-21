// Header — fixed top bar. renderHeader() returns HTML; attachHeaderEvents() wires listeners.

const PAGE_TITLES = {
  dashboard: "Resource Availability Dashboard",
  facilities: "Facility Directory",
  beds: "Bed Availability",
  equipment: "Equipment Availability",
  services: "Service Availability",
  "book-appointment": "Book an Appointment",
  "my-appointments": "My Appointments",
  notifications: "Notifications & Reminders",
  "staff-dashboard": "Staff Dashboard",
  "resource-history": "Resource Update History",
  reports: "Reports & Analytics",
  feedback: "Feedback System",
  admin: "Admin Management",
  "activity-logs": "Activity Logs",
  profile: "My Profile",
};

export function renderHeader({ currentPage, currentUser, unreadCount }) {
  const title = PAGE_TITLES[currentPage] ?? "";
  const badge = unreadCount > 0
    ? `<span class="header-badge">${unreadCount > 9 ? "9+" : unreadCount}</span>`
    : "";

  return `
    <header class="app-header h-14 bg-white border-b z-10 flex items-center px-4 gap-4">
      <button id="menu-toggle-btn" class="lg-hide p-2 rounded-md hover:bg-gray-100">
        <svg viewBox="0 0 24 24" class="w-5 h-5 fill-gray-600"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
      </button>
      <h1 class="font-['Outfit'] font-semibold text-base text-slate-800 flex-1 truncate">${title}</h1>
      <div class="flex items-center gap-2">
        <button id="notif-bell-btn" class="relative p-2 rounded-md hover:bg-gray-100 transition-colors">
          <svg viewBox="0 0 24 24" class="w-5 h-5 fill-gray-600"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          ${badge}
        </button>
        <div class="flex items-center gap-2 pl-2 border-l">
          <div class="w-7 h-7 rounded-full bg-sky-600 flex items-center justify-center text-white font-semibold text-xs">${currentUser.name.charAt(0)}</div>
          <span class="text-sm font-medium text-slate-700 hidden sm:block max-w-[120px] truncate">${currentUser.name}</span>
        </div>
      </div>
    </header>`;
}

export function attachHeaderEvents({ onNavigate, onMenuToggle }) {
  document.getElementById("menu-toggle-btn")?.addEventListener("click", onMenuToggle);
  document.getElementById("notif-bell-btn")?.addEventListener("click", () => onNavigate("notifications"));
}
