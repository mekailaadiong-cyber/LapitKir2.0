// Layout — mounts Sidebar + Header around page content.

import { renderSidebar, attachSidebarEvents } from "./sidebar.js";
import { renderHeader, attachHeaderEvents } from "./header.js";

let sidebarOpen = false;

export function renderLayout({ currentPage, currentUser, unreadCount, pageHtml }) {
  return `
    ${renderSidebar({ currentPage, currentUser, unreadCount, isOpen: sidebarOpen })}
    ${renderHeader({ currentPage, currentUser, unreadCount })}
    <main class="app-main lg-ml-60 pt-14 min-h-screen">
      <div class="p-5 max-w-[1400px]">
        <div id="page-content">${pageHtml}</div>
      </div>
    </main>
    <div id="toast-container" class="fixed bottom-5 right-5 flex flex-col gap-2 z-50"></div>`;
}

export function attachLayoutEvents({ onNavigate, onLogout }) {
  attachSidebarEvents({
    onNavigate,
    onLogout,
    onClose: () => { sidebarOpen = false; document.getElementById("sidebar-overlay")?.classList.remove("sidebar-overlay-visible"); document.querySelector(".app-sidebar")?.classList.replace("sidebar-open", "sidebar-closed"); },
  });
  attachHeaderEvents({
    onNavigate,
    onMenuToggle: () => {
      sidebarOpen = true;
      document.getElementById("sidebar-overlay")?.classList.add("sidebar-overlay-visible");
      document.querySelector(".app-sidebar")?.classList.replace("sidebar-closed", "sidebar-open");
    },
  });
}

export function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
  const colorClass = type === "success" ? "toast-success" : type === "error" ? "toast-error" : "toast-info";
  const el = document.createElement("div");
  el.className = `toast-enter flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm ${colorClass}`;
  el.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}
