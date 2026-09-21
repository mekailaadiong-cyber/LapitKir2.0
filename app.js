// app.js — root of the app. Owns state, renders the current page, re-renders on changes.
// Mirrors App.tsx's role in the original React version.

import {
  FACILITIES, USERS, INITIAL_APPOINTMENTS, INITIAL_NOTIFICATIONS,
  INITIAL_RESOURCE_UPDATES, INITIAL_FEEDBACK, INITIAL_ACTIVITY_LOGS,
} from "./data.js";
import { renderLoginPage, attachLoginEvents } from "./loginPage.js";
import { renderLayout, attachLayoutEvents, showToast } from "./layout.js";
import { renderDashboardPage, mountDashboardMap } from "./dashboardPage.js";
import { renderFacilityDirectoryPage, attachFacilityDirectoryEvents } from "./facilityDirectoryPage.js";
import { renderBedAvailabilityPage, attachBedAvailabilityEvents } from "./bedAvailabilityPage.js";
import { renderEquipmentPage, attachEquipmentEvents } from "./equipmentPage.js";
import { renderServiceAvailabilityPage, attachServiceAvailabilityEvents } from "./serviceAvailabilityPage.js";
import { renderAppointmentBookingPage, attachAppointmentBookingEvents, resetBookingWizard } from "./appointmentBookingPage.js";
import { renderAppointmentStatusPage, attachAppointmentStatusEvents } from "./appointmentStatusPage.js";
import { renderNotificationsPage, attachNotificationsEvents } from "./notificationsPage.js";
import { renderProfilePage, attachProfileEvents } from "./profilePage.js";
import { renderStaffDashboardPage, attachStaffDashboardEvents } from "./staffDashboardPage.js";
import { renderResourceHistoryPage, attachResourceHistoryEvents } from "./resourceHistoryPage.js";
import { renderReportsPage, mountReportsCharts } from "./reportsPage.js";
import { renderFeedbackPage, attachFeedbackEvents } from "./feedbackPage.js";
import { renderAdminPage, attachAdminEvents } from "./adminPage.js";
import { renderActivityLogsPage, attachActivityLogsEvents } from "./activityLogsPage.js";

const state = {
  currentUser: null,
  currentPage: "dashboard",
  facilities: FACILITIES,
  users: USERS,
  appointments: INITIAL_APPOINTMENTS,
  notifications: INITIAL_NOTIFICATIONS,
  resourceUpdates: INITIAL_RESOURCE_UPDATES,
  feedbacks: INITIAL_FEEDBACK,
  activityLogs: INITIAL_ACTIVITY_LOGS,
};

const root = document.getElementById("app");

function addLog(user, action, module, details, success = true) {
  state.activityLogs = [{
    id: `al${Date.now()}`, userId: user.id, userName: user.name, role: user.role,
    action, module, details, ipAddress: "192.168.1.x", timestamp: new Date().toISOString(), success,
  }, ...state.activityLogs];
}

function addNotification(userId, title, message, type) {
  state.notifications = [{ id: `n${Date.now()}`, userId, title, message, type, read: false, createdAt: new Date().toISOString() }, ...state.notifications];
}

function navigate(page) {
  if (!state.currentUser) return;
  const staffPages = ["staff-dashboard", "resource-history", "reports"];
  const adminPages = ["admin", "activity-logs"];
  if (adminPages.includes(page) && state.currentUser.role !== "admin") return;
  if (staffPages.includes(page) && state.currentUser.role === "patient") return;
  state.currentPage = page;
  render();
}

function login(user) {
  state.currentUser = user;
  state.currentPage = "dashboard";
  addLog(user, "Login", "Authentication", "Successful login");
  render();
  showToast(`Welcome back, ${user.name}!`, "success");
}

function logout() {
  if (state.currentUser) addLog(state.currentUser, "Logout", "Authentication", "User logged out");
  state.currentUser = null;
  state.currentPage = "dashboard";
  render();
}

function unreadCount() {
  if (!state.currentUser) return 0;
  return state.notifications.filter(n => n.userId === state.currentUser.id && !n.read).length;
}

// ── Handlers (mirroring App.tsx) ──

function handleUpdateFacility(facilityId, changes, note) {
  const fac = state.facilities.find(f => f.id === facilityId);
  if (!fac) return;
  const previousStatus = fac.operationalStatus;
  Object.assign(fac, changes);
  state.resourceUpdates = [{
    id: `ru${Date.now()}`, facilityId, facilityName: fac.name, resourceType: "Facility", resourceName: fac.name,
    field: "Status", previousValue: previousStatus, newValue: changes.operationalStatus ?? previousStatus,
    updatedById: state.currentUser.id, updatedByName: state.currentUser.name, timestamp: new Date().toISOString(), notes: note,
  }, ...state.resourceUpdates];
  addLog(state.currentUser, "Update Facility", "Facilities", note);
  render();
  showToast("Facility status updated.", "success");
}

function handleUpdateCurrentUser(updates) {
  if (!state.currentUser) return;
  Object.assign(state.currentUser, updates);
  const u = state.users.find(u => u.id === state.currentUser.id);
  if (u) Object.assign(u, updates);
  addLog(state.currentUser, "Update Profile", "Account", "Updated profile information");
  render();
}

function handleToggleUser(userId) {
  const u = state.users.find(u => u.id === userId);
  if (!u) return;
  const wasActive = u.active;
  u.active = !u.active;
  addLog(state.currentUser, wasActive ? "Deactivate User" : "Activate User", "Admin", `${wasActive ? "Deactivated" : "Activated"} user ${u.name}`);
  render();
  showToast("User account updated.", "success");
}

function handleBookAppointment(appt) {
  state.appointments = [appt, ...state.appointments];
  addNotification(appt.userId, "Appointment Submitted", `Your appointment at ${appt.facilityName} on ${appt.date} at ${appt.time} is now pending review.`, "appointment");
  addLog(state.currentUser, "Book Appointment", "Appointments", `Booked appointment at ${appt.facilityName} for ${appt.serviceName} on ${appt.date}`);
  showToast("Appointment booked successfully!", "success");
  // The booking page shows its own success screen; navigation to "my-appointments"
  // happens when the user clicks through, matching the wizard's own flow.
}

function handleUpdateAppointment(id, status, staffNotes) {
  const appt = state.appointments.find(a => a.id === id);
  if (!appt) return;
  appt.status = status;
  if (staffNotes !== undefined) appt.staffNotes = staffNotes;
  appt.updatedAt = new Date().toISOString().split("T")[0];
  const msgs = {
    Pending: "Your appointment is pending review.",
    Approved: `Your appointment at ${appt.facilityName} on ${appt.date} has been approved. ${staffNotes ?? ""}`,
    Completed: `Your appointment at ${appt.facilityName} has been marked as completed.`,
    Cancelled: `Your appointment at ${appt.facilityName} on ${appt.date} has been cancelled. ${staffNotes ?? ""}`,
  };
  addNotification(appt.userId, `Appointment ${status}`, msgs[status], "appointment");
  addLog(state.currentUser, `${status} Appointment`, "Appointments", `${status} appointment for ${appt.userName} – ${appt.serviceName}`);
  render();
  showToast(`Appointment marked as ${status}.`, status === "Cancelled" ? "info" : "success");
}

function handleReschedule(id, date, time) {
  const appt = state.appointments.find(a => a.id === id);
  if (!appt) return;
  appt.date = date; appt.time = time; appt.status = "Pending"; appt.updatedAt = new Date().toISOString().split("T")[0];
  addNotification(appt.userId, "Appointment Rescheduled", `Your appointment at ${appt.facilityName} has been rescheduled to ${date} at ${time}.`, "appointment");
  addLog(state.currentUser, "Reschedule Appointment", "Appointments", `Rescheduled appointment to ${date} at ${time}`);
  render();
  showToast("Appointment rescheduled.", "success");
}

function handleMarkNotifRead(id) {
  const n = state.notifications.find(n => n.id === id);
  if (n) n.read = true;
  render();
}

function handleMarkAllRead() {
  if (!state.currentUser) return;
  state.notifications.forEach(n => { if (n.userId === state.currentUser.id) n.read = true; });
  render();
  showToast("All notifications marked as read.", "info");
}

function handleUpdateResource(update) {
  state.resourceUpdates = [update, ...state.resourceUpdates];
  addLog(state.currentUser, "Update Resource", "Resources", `Updated ${update.resourceName} at ${update.facilityName}: ${update.field} from ${update.previousValue} to ${update.newValue}`);
  render();
  showToast("Resource updated successfully.", "success");
}

function handleSubmitFeedback(fb) {
  state.feedbacks = [fb, ...state.feedbacks];
  addLog(state.currentUser, "Submit Feedback", "Feedback", `Submitted feedback for ${fb.facilityName}, rating: ${fb.rating}/5`);
  showToast("Feedback submitted. Thank you!", "success");
}

function handleRespondFeedback(id, response) {
  const fb = state.feedbacks.find(f => f.id === id);
  if (fb) { fb.response = response; fb.status = "Reviewed"; }
  addLog(state.currentUser, "Respond Feedback", "Feedback", `Responded to feedback ${id}`);
  render();
  showToast("Response submitted.", "success");
}

// ── Rendering ──

function renderPageContent() {
  const cu = state.currentUser;
  switch (state.currentPage) {
    case "dashboard":
      return renderDashboardPage({ currentUser: cu, facilities: state.facilities });
    case "facilities":
      return renderFacilityDirectoryPage({ facilities: state.facilities });
    case "beds":
      return renderBedAvailabilityPage();
    case "equipment":
      return renderEquipmentPage();
    case "services":
      return renderServiceAvailabilityPage();
    case "book-appointment":
      return renderAppointmentBookingPage({ currentUser: cu });
    case "my-appointments":
      return renderAppointmentStatusPage({ currentUser: cu, appointments: state.appointments });
    case "notifications":
      return renderNotificationsPage({ currentUser: cu, notifications: state.notifications });
    case "profile":
      return renderProfilePage({ currentUser: cu });
    case "staff-dashboard":
      return renderStaffDashboardPage({ currentUser: cu, appointments: state.appointments, resourceUpdates: state.resourceUpdates, facilities: state.facilities });
    case "resource-history":
      return renderResourceHistoryPage();
    case "reports":
      return renderReportsPage({ appointments: state.appointments });
    case "feedback":
      return renderFeedbackPage({ currentUser: cu, feedbacks: state.feedbacks });
    case "admin":
      return renderAdminPage({ currentUser: cu, facilities: state.facilities, users: state.users });
    case "activity-logs":
      return renderActivityLogsPage({ logs: state.activityLogs });
    default:
      return `
        <div class="bg-white rounded-xl p-8 text-center shadow-sm" style="border:1px solid var(--border)">
          <p class="text-slate-500 text-sm">Page not found.</p>
        </div>`;
  }
}

function attachPageEvents() {
  const cu = state.currentUser;
  switch (state.currentPage) {
    case "dashboard":
      if (cu.role === "patient") mountDashboardMap(state.facilities);
      break;
    case "facilities":
      attachFacilityDirectoryEvents();
      break;
    case "beds":
      attachBedAvailabilityEvents();
      break;
    case "equipment":
      attachEquipmentEvents();
      break;
    case "services":
      attachServiceAvailabilityEvents();
      break;
    case "book-appointment":
      attachAppointmentBookingEvents({ currentUser: cu, onBook: handleBookAppointment });
      break;
    case "my-appointments":
      attachAppointmentStatusEvents({ currentUser: cu, appointments: state.appointments, onUpdate: handleUpdateAppointment, onReschedule: handleReschedule, onNavigate: navigate });
      break;
    case "notifications":
      attachNotificationsEvents({ currentUser: cu, notifications: state.notifications, onMarkRead: handleMarkNotifRead, onMarkAllRead: handleMarkAllRead });
      break;
    case "profile":
      attachProfileEvents({ currentUser: cu, onUpdate: handleUpdateCurrentUser });
      break;
    case "staff-dashboard":
      attachStaffDashboardEvents({ currentUser: cu, appointments: state.appointments, resourceUpdates: state.resourceUpdates, facilities: state.facilities, onUpdateAppointment: handleUpdateAppointment, onUpdateMedicineStatus: handleUpdateResource, onUpdateFacility: handleUpdateFacility });
      break;
    case "resource-history":
      attachResourceHistoryEvents({ resourceUpdates: state.resourceUpdates });
      break;
    case "reports":
      mountReportsCharts({ appointments: state.appointments });
      break;
    case "feedback":
      attachFeedbackEvents({ currentUser: cu, feedbacks: state.feedbacks, onSubmit: handleSubmitFeedback, onRespond: handleRespondFeedback });
      break;
    case "admin":
      attachAdminEvents({ currentUser: cu, facilities: state.facilities, users: state.users, onUpdateFacility: handleUpdateFacility, onToggleUser: handleToggleUser });
      break;
    case "activity-logs":
      attachActivityLogsEvents({ logs: state.activityLogs });
      break;
  }
}

function render() {
  if (!state.currentUser) {
    root.innerHTML = renderLoginPage();
    attachLoginEvents({ onLogin: login });
    return;
  }

  const pageHtml = renderPageContent();
  root.innerHTML = renderLayout({
    currentPage: state.currentPage,
    currentUser: state.currentUser,
    unreadCount: unreadCount(),
    pageHtml,
  });
  attachLayoutEvents({ onNavigate: navigate, onLogout: logout });
  attachPageEvents();
}

render();
