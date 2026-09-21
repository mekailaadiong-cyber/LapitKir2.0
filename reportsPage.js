// ReportsPage — charts converted from Recharts to Chart.js (loaded via CDN in index.html).
import { FACILITIES, SERVICES, MEDICINES } from "./data.js";

const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#a78bfa", "#f43f5e", "#06b6d4"];
let charts = {}; // keep references so we can destroy before re-creating

function destroyCharts() {
  Object.values(charts).forEach(c => c?.destroy());
  charts = {};
}

export function renderReportsPage({ appointments }) {
  const monthCounts = {};
  appointments.forEach(a => { const m = a.date.slice(0, 7); monthCounts[m] = (monthCounts[m] ?? 0) + 1; });
  const monthsSorted = Object.keys(monthCounts).sort();

  const statusData = ["Pending", "Approved", "Completed", "Cancelled"].map(status => appointments.filter(a => a.status === status).length);
  const serviceData = SERVICES.map(svc => ({ name: svc.name, count: appointments.filter(a => a.serviceId === svc.id).length })).filter(d => d.count > 0).sort((a, b) => b.count - a.count);
  const facilityData = FACILITIES.map(f => ({ name: f.name, count: appointments.filter(a => a.facilityId === f.id).length })).filter(d => d.count > 0);

  const medAvailSummary = {
    Available: MEDICINES.reduce((acc, m) => acc + m.facilities.filter(f => f.status === "Available").length, 0),
    "Low Stock": MEDICINES.reduce((acc, m) => acc + m.facilities.filter(f => f.status === "Low Stock").length, 0),
    Unavailable: MEDICINES.reduce((acc, m) => acc + m.facilities.filter(f => f.status === "Unavailable").length, 0),
  };
  const medTotal = Object.values(medAvailSummary).reduce((a, b) => a + b, 0);

  const completedCount = appointments.filter(a => a.status === "Completed").length;
  const cancelledCount = appointments.filter(a => a.status === "Cancelled").length;
  const reviewedCount = appointments.filter(a => a.status !== "Pending").length;
  const approvedOrCompleted = appointments.filter(a => a.status === "Approved" || a.status === "Completed").length;

  const statCard = (label, value, color) => `<div class="bg-white rounded-xl p-5 shadow-sm" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-3xl ${color}">${value}</p><p class="text-sm font-semibold text-slate-600 mt-1">${label}</p></div>`;

  const maxFacility = Math.max(1, ...facilityData.map(f => f.count));

  return `
    <div class="space-y-6">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        ${statCard("Total Appointments", appointments.length, "text-slate-800")}
        ${statCard("Completed", completedCount, "text-emerald-600")}
        ${statCard("Active Facilities", FACILITIES.filter(f => f.active).length, "text-sky-600")}
        ${statCard("Medicines Tracked", MEDICINES.length, "text-purple-600")}
      </div>

      <div class="grid lg:grid-cols-2 gap-5">
        <div class="bg-white rounded-xl shadow-sm p-5" style="border:1px solid var(--border)">
          <h3 class="font-['Outfit'] font-semibold text-slate-800 mb-4">Appointments Over Time</h3>
          ${monthsSorted.length > 0 ? `<div style="height:200px"><canvas id="chart-month"></canvas></div>` : `<div style="height:200px" class="flex items-center justify-center text-slate-400 text-sm">No data</div>`}
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5" style="border:1px solid var(--border)">
          <h3 class="font-['Outfit'] font-semibold text-slate-800 mb-4">Appointment Status Distribution</h3>
          <div style="height:200px"><canvas id="chart-status"></canvas></div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5" style="border:1px solid var(--border)">
          <h3 class="font-['Outfit'] font-semibold text-slate-800 mb-4">Most Requested Services</h3>
          ${serviceData.length > 0 ? `<div style="height:200px"><canvas id="chart-services"></canvas></div>` : `<div style="height:200px" class="flex items-center justify-center text-slate-400 text-sm">No data</div>`}
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5" style="border:1px solid var(--border)">
          <h3 class="font-['Outfit'] font-semibold text-slate-800 mb-4">Medicine Availability Summary</h3>
          <div class="space-y-3 mb-4">
            ${Object.entries(medAvailSummary).map(([status, count]) => {
              const pct = medTotal > 0 ? Math.round((count / medTotal) * 100) : 0;
              const barColor = status === "Available" ? "bg-emerald-500" : status === "Low Stock" ? "bg-amber-500" : "bg-red-500";
              return `<div><div class="flex justify-between text-xs mb-1"><span class="font-medium text-slate-700">${status}</span><span class="text-slate-500 font-mono">${count} records (${pct}%)</span></div><div class="h-2 bg-slate-100 rounded-full overflow-hidden"><div class="h-full ${barColor} rounded-full" style="width:${pct}%"></div></div></div>`;
            }).join("")}
          </div>
          <h3 class="font-['Outfit'] font-semibold text-slate-800 mb-3 mt-5">Appointments by Facility</h3>
          <div class="space-y-2">
            ${facilityData.map(f => `<div class="flex items-center gap-3 text-xs"><span class="text-slate-500 w-32 truncate flex-shrink-0">${f.name}</span><div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-sky-500 rounded-full" style="width:${(f.count / maxFacility) * 100}%"></div></div><span class="text-slate-700 font-mono font-semibold w-4 text-right">${f.count}</span></div>`).join("") || `<p class="text-xs text-slate-400">No data</p>`}
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5" style="border:1px solid var(--border)">
        <h3 class="font-['Outfit'] font-semibold text-slate-800 mb-1">System Usage Summary</h3>
        <p class="text-xs text-slate-400 mb-4">Generated: ${new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}</p>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${[
            [`${appointments.length > 0 ? Math.round((completedCount / appointments.length) * 100) : 0}%`, "Completion Rate", "of appointments completed"],
            [`${appointments.length > 0 ? Math.round((cancelledCount / appointments.length) * 100) : 0}%`, "Cancellation Rate", "of appointments cancelled"],
            [`${reviewedCount > 0 ? Math.round((approvedOrCompleted / reviewedCount) * 100) : 0}%`, "Approval Rate", "of reviewed appointments approved"],
            ["< 24h", "Avg. Turnaround", "appointment review time"],
          ].map(([value, label, note]) => `<div class="bg-slate-50 rounded-xl p-4" style="border:1px solid var(--border)"><p class="font-['Outfit'] font-bold text-2xl text-slate-800">${value}</p><p class="text-xs font-semibold text-slate-600 mt-0.5">${label}</p><p class="text-xs text-slate-400">${note}</p></div>`).join("")}
        </div>
      </div>
    </div>`;
}

export function mountReportsCharts({ appointments }) {
  destroyCharts();
  if (typeof Chart === "undefined") return;

  const monthCounts = {};
  appointments.forEach(a => { const m = a.date.slice(0, 7); monthCounts[m] = (monthCounts[m] ?? 0) + 1; });
  const monthsSorted = Object.keys(monthCounts).sort();
  const monthLabels = monthsSorted.map(m => new Date(m + "-01").toLocaleDateString("en-PH", { month: "short", year: "numeric" }));

  const monthEl = document.getElementById("chart-month");
  if (monthEl && monthsSorted.length > 0) {
    charts.month = new Chart(monthEl, {
      type: "bar",
      data: { labels: monthLabels, datasets: [{ label: "Appointments", data: monthsSorted.map(m => monthCounts[m]), backgroundColor: "#0ea5e9", borderRadius: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
    });
  }

  const statusEl = document.getElementById("chart-status");
  if (statusEl) {
    const statusLabels = ["Pending", "Approved", "Completed", "Cancelled"];
    charts.status = new Chart(statusEl, {
      type: "pie",
      data: { labels: statusLabels, datasets: [{ data: statusLabels.map(s => appointments.filter(a => a.status === s).length), backgroundColor: COLORS }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } } },
    });
  }

  const serviceData = SERVICES.map(svc => ({ name: svc.name, count: appointments.filter(a => a.serviceId === svc.id).length })).filter(d => d.count > 0).sort((a, b) => b.count - a.count);
  const servicesEl = document.getElementById("chart-services");
  if (servicesEl && serviceData.length > 0) {
    charts.services = new Chart(servicesEl, {
      type: "bar",
      data: { labels: serviceData.map(d => d.name), datasets: [{ label: "Appointments", data: serviceData.map(d => d.count), backgroundColor: "#22c55e", borderRadius: 4 }] },
      options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true } } },
    });
  }
}
