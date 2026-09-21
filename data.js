// Mock data — converted from data/index.ts
// NOTE: first pass includes USERS + FACILITIES (enough for login, dashboard, map).
// Medicines/Beds/Equipment/Services/Appointments/Notifications/etc. will be added
// when those pages are converted in a follow-up.

export const USERS = [
  { id: "u1", name: "Administrator", email: "admin@pagadiancity.gov.ph", password: "admin123", role: "admin", phone: "09171234567", address: "City Hall, Pagadian City", barangay: "Poblacion", active: true, verified: true, createdAt: "2024-01-01" },
  { id: "u2", name: "Maria Santos", email: "maria@bhc.gov.ph", password: "staff123", role: "staff", phone: "09281234567", address: "Barangay Dao, Pagadian City", barangay: "Dao", facilityId: "f1", active: true, verified: true, createdAt: "2024-01-15" },
  { id: "u3", name: "Roberto Cruz", email: "roberto@cho.gov.ph", password: "staff123", role: "staff", phone: "09391234567", address: "Pagadian City Health Office", barangay: "Poblacion", facilityId: "f2", active: true, verified: true, createdAt: "2024-01-15" },
  { id: "u4", name: "Juan dela Cruz", email: "juan@email.com", password: "patient123", role: "patient", phone: "09501234567", address: "123 Rizal St., Barangay Dao, Pagadian City", barangay: "Dao", dateOfBirth: "1990-05-12", sex: "Male", active: true, verified: true, createdAt: "2024-02-01" },
  { id: "u5", name: "Ana Reyes", email: "ana@email.com", password: "patient123", role: "patient", phone: "09611234567", address: "456 Mabini Ave., Barangay Tuburan, Pagadian City", barangay: "Tuburan", dateOfBirth: "1995-08-22", sex: "Female", active: true, verified: true, createdAt: "2024-02-10" },
  { id: "u6", name: "Dr. Lourdes Bautista", email: "lourdes@rhu.gov.ph", password: "staff123", role: "staff", phone: "09721234567", address: "RHU Lourdes Norte, Pagadian City", barangay: "Lourdes Norte", facilityId: "f3", active: true, verified: true, createdAt: "2024-01-20" },
  { id: "u7", name: "Carlo Mendoza", email: "carlo@pcmc.gov.ph", password: "staff123", role: "staff", phone: "09831234567", address: "Pagadian City Medical Center", barangay: "Poblacion", facilityId: "f4", active: true, verified: true, createdAt: "2024-01-20" },
];

export const FACILITIES = [
  { id: "f1", name: "BHC Dao", type: "Barangay Health Center", address: "Purok 3, Barangay Dao, Pagadian City", barangay: "Dao", city: "Pagadian City", phone: "(062) 215-1001", email: "bhc.dao@pagadiancity.gov.ph", hours: "Mon–Fri 8:00 AM – 5:00 PM", services: ["Consultation", "Vaccination", "Maternal Care", "Family Planning", "Dental"], specialties: ["Primary Care", "Maternal Health", "Immunization"], operationalStatus: "Open", emergency: false, active: true, verified: true, staffCount: 8, queueCount: 12, estimatedWaitMinutes: 45, lat: 7.8350, lng: 123.4310 },
  { id: "f2", name: "Pagadian City Health Office", type: "City Health Office", address: "City Hall Compound, Pagadian City", barangay: "Poblacion", city: "Pagadian City", phone: "(062) 215-2002", email: "cho@pagadiancity.gov.ph", hours: "Mon–Fri 8:00 AM – 5:00 PM", services: ["Consultation", "Laboratory", "Vaccination", "TB-DOTS", "Family Planning", "Maternal Care"], specialties: ["Primary Care", "Communicable Disease", "Immunization", "Laboratory"], operationalStatus: "Open", emergency: false, active: true, verified: true, staffCount: 35, queueCount: 28, estimatedWaitMinutes: 90, lat: 7.8279, lng: 123.4366 },
  { id: "f3", name: "RHU Lourdes Norte", type: "Rural Health Unit", address: "Barangay Lourdes Norte, Pagadian City", barangay: "Lourdes Norte", city: "Pagadian City", phone: "(062) 215-3003", email: "rhu.lourdes@pagadiancity.gov.ph", hours: "Mon–Sat 7:00 AM – 6:00 PM", services: ["Consultation", "Prenatal Care", "Immunization", "TB-DOTS", "Laboratory"], specialties: ["Primary Care", "Maternal Health", "Communicable Disease"], operationalStatus: "Limited", emergencyNote: "Reduced staffing today – doctor available until 12 PM only.", emergency: false, active: true, verified: true, staffCount: 12, queueCount: 7, estimatedWaitMinutes: 30, lat: 7.8420, lng: 123.4280 },
  { id: "f4", name: "Pagadian City Medical Center", type: "District Hospital", address: "San Pedro, Pagadian City", barangay: "San Pedro", city: "Pagadian City", phone: "(062) 215-4004", email: "pcmc@pagadiancity.gov.ph", hours: "24/7", services: ["Emergency Care", "Inpatient", "Outpatient", "Laboratory", "X-Ray", "Pharmacy", "Pediatrics", "OB-GYN", "Surgery"], specialties: ["Emergency Medicine", "Pediatrics", "OB-GYN", "Surgery", "Internal Medicine"], operationalStatus: "Open", emergency: true, emergencyNote: "High patient volume in ER – expect extended wait times.", active: true, verified: true, staffCount: 95, queueCount: 45, estimatedWaitMinutes: 120, lat: 7.8220, lng: 123.4400 },
  { id: "f5", name: "BHC Tuburan", type: "Barangay Health Center", address: "Purok 5, Barangay Tuburan, Pagadian City", barangay: "Tuburan", city: "Pagadian City", phone: "(062) 215-5005", email: "bhc.tuburan@pagadiancity.gov.ph", hours: "Mon–Fri 8:00 AM – 5:00 PM", services: ["Consultation", "Vaccination", "Maternal Care", "Family Planning"], specialties: ["Primary Care", "Maternal Health", "Immunization"], operationalStatus: "Open", emergency: false, active: true, verified: true, staffCount: 6, queueCount: 5, estimatedWaitMinutes: 20, lat: 7.8180, lng: 123.4450 },
  { id: "f6", name: "BHC San Pedro", type: "Barangay Health Center", address: "Purok 2, Barangay San Pedro, Pagadian City", barangay: "San Pedro", city: "Pagadian City", phone: "(062) 215-6006", email: "bhc.sanpedro@pagadiancity.gov.ph", hours: "Mon–Fri 8:00 AM – 5:00 PM", services: ["Consultation", "Vaccination", "Family Planning"], specialties: ["Primary Care", "Immunization"], operationalStatus: "Closed", emergencyNote: "Closed for facility repair. Patients redirected to BHC Dao.", emergency: false, active: true, verified: true, staffCount: 5, queueCount: 0, estimatedWaitMinutes: 0, lat: 7.8240, lng: 123.4330 },
];

export const MEDICINES = [
  { id: "m1", name: "Amoxicillin 500mg", generic: "Amoxicillin", category: "Antibiotic", unit: "capsule", facilities: [
    { facilityId: "f1", quantity: 240, status: "Available", lastUpdated: "2025-08-29", updatedBy: "Maria Santos" },
    { facilityId: "f2", quantity: 1800, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Roberto Cruz" },
    { facilityId: "f3", quantity: 45, status: "Low Stock", lastUpdated: "2025-08-28", updatedBy: "Dr. Lourdes Bautista" },
    { facilityId: "f5", quantity: 0, status: "Unavailable", lastUpdated: "2025-08-25", updatedBy: "Maria Santos" },
    { facilityId: "f4", quantity: 3200, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Carlo Mendoza" },
  ]},
  { id: "m2", name: "Paracetamol 500mg", generic: "Paracetamol", category: "Analgesic/Antipyretic", unit: "tablet", facilities: [
    { facilityId: "f1", quantity: 500, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Maria Santos" },
    { facilityId: "f2", quantity: 2400, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Roberto Cruz" },
    { facilityId: "f3", quantity: 120, status: "Available", lastUpdated: "2025-08-29", updatedBy: "Dr. Lourdes Bautista" },
    { facilityId: "f5", quantity: 60, status: "Low Stock", lastUpdated: "2025-08-28", updatedBy: "Maria Santos" },
    { facilityId: "f4", quantity: 5000, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Carlo Mendoza" },
  ]},
  { id: "m3", name: "Metformin 500mg", generic: "Metformin HCl", category: "Antidiabetic", unit: "tablet", facilities: [
    { facilityId: "f1", quantity: 0, status: "Unavailable", lastUpdated: "2025-08-20", updatedBy: "Maria Santos" },
    { facilityId: "f2", quantity: 600, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Roberto Cruz" },
    { facilityId: "f3", quantity: 30, status: "Low Stock", lastUpdated: "2025-08-27", updatedBy: "Dr. Lourdes Bautista" },
    { facilityId: "f4", quantity: 1200, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Carlo Mendoza" },
  ]},
  { id: "m4", name: "Amlodipine 5mg", generic: "Amlodipine Besylate", category: "Antihypertensive", unit: "tablet", facilities: [
    { facilityId: "f1", quantity: 180, status: "Available", lastUpdated: "2025-08-29", updatedBy: "Maria Santos" },
    { facilityId: "f2", quantity: 900, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Roberto Cruz" },
    { facilityId: "f3", quantity: 200, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Dr. Lourdes Bautista" },
    { facilityId: "f5", quantity: 40, status: "Low Stock", lastUpdated: "2025-08-27", updatedBy: "Maria Santos" },
    { facilityId: "f4", quantity: 1800, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Carlo Mendoza" },
  ]},
  { id: "m5", name: "Salbutamol 100mcg Inhaler", generic: "Salbutamol Sulfate", category: "Bronchodilator", unit: "inhaler", facilities: [
    { facilityId: "f1", quantity: 12, status: "Low Stock", lastUpdated: "2025-08-28", updatedBy: "Maria Santos" },
    { facilityId: "f2", quantity: 80, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Roberto Cruz" },
    { facilityId: "f3", quantity: 0, status: "Unavailable", lastUpdated: "2025-08-21", updatedBy: "Dr. Lourdes Bautista" },
    { facilityId: "f4", quantity: 150, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Carlo Mendoza" },
  ]},
  { id: "m6", name: "Co-amoxiclav 625mg", generic: "Amoxicillin + Clavulanate", category: "Antibiotic", unit: "tablet", facilities: [
    { facilityId: "f2", quantity: 360, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Roberto Cruz" },
    { facilityId: "f3", quantity: 20, status: "Low Stock", lastUpdated: "2025-08-26", updatedBy: "Dr. Lourdes Bautista" },
    { facilityId: "f4", quantity: 800, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Carlo Mendoza" },
  ]},
  { id: "m7", name: "Cetirizine 10mg", generic: "Cetirizine HCl", category: "Antihistamine", unit: "tablet", facilities: [
    { facilityId: "f1", quantity: 200, status: "Available", lastUpdated: "2025-08-29", updatedBy: "Maria Santos" },
    { facilityId: "f2", quantity: 500, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Roberto Cruz" },
    { facilityId: "f3", quantity: 90, status: "Available", lastUpdated: "2025-08-28", updatedBy: "Dr. Lourdes Bautista" },
    { facilityId: "f5", quantity: 80, status: "Available", lastUpdated: "2025-08-27", updatedBy: "Maria Santos" },
    { facilityId: "f4", quantity: 1000, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Carlo Mendoza" },
  ]},
  { id: "m8", name: "Oral Rehydration Salts", generic: "ORS", category: "Rehydration", unit: "sachet", facilities: [
    { facilityId: "f1", quantity: 400, status: "Available", lastUpdated: "2025-08-29", updatedBy: "Maria Santos" },
    { facilityId: "f2", quantity: 1200, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Roberto Cruz" },
    { facilityId: "f3", quantity: 350, status: "Available", lastUpdated: "2025-08-28", updatedBy: "Dr. Lourdes Bautista" },
    { facilityId: "f5", quantity: 100, status: "Available", lastUpdated: "2025-08-27", updatedBy: "Maria Santos" },
    { facilityId: "f4", quantity: 2000, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Carlo Mendoza" },
  ]},
  { id: "m9", name: "Atorvastatin 20mg", generic: "Atorvastatin Calcium", category: "Antilipemic", unit: "tablet", facilities: [
    { facilityId: "f1", quantity: 120, status: "Available", lastUpdated: "2025-08-29", updatedBy: "Maria Santos" },
    { facilityId: "f2", quantity: 600, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Roberto Cruz" },
    { facilityId: "f3", quantity: 50, status: "Low Stock", lastUpdated: "2025-08-27", updatedBy: "Dr. Lourdes Bautista" },
    { facilityId: "f4", quantity: 1500, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Carlo Mendoza" },
  ]},
  { id: "m10", name: "Insulin Glargine 100U/mL", generic: "Insulin Glargine", category: "Antidiabetic", unit: "vial", facilities: [
    { facilityId: "f2", quantity: 24, status: "Low Stock", lastUpdated: "2025-08-30", updatedBy: "Roberto Cruz" },
    { facilityId: "f4", quantity: 60, status: "Available", lastUpdated: "2025-08-30", updatedBy: "Carlo Mendoza" },
  ]},
];

export const BEDS = [
  { id: "b1", facilityId: "f2", ward: "General Observation Ward", type: "Adult", total: 15, available: 6, occupied: 8, reserved: 1, lastUpdated: "2025-08-31" },
  { id: "b2", facilityId: "f2", ward: "Maternal Ward", type: "Maternity", total: 10, available: 3, occupied: 6, reserved: 1, lastUpdated: "2025-08-31" },
  { id: "b3", facilityId: "f4", ward: "General Ward A", type: "Adult", total: 40, available: 10, occupied: 27, reserved: 3, lastUpdated: "2025-08-31" },
  { id: "b4", facilityId: "f4", ward: "General Ward B", type: "Adult", total: 40, available: 14, occupied: 23, reserved: 3, lastUpdated: "2025-08-31" },
  { id: "b5", facilityId: "f4", ward: "Pediatric Ward", type: "Pediatric", total: 25, available: 8, occupied: 15, reserved: 2, lastUpdated: "2025-08-31" },
  { id: "b6", facilityId: "f4", ward: "ICU", type: "Intensive Care", total: 10, available: 2, occupied: 8, reserved: 0, lastUpdated: "2025-08-31" },
  { id: "b7", facilityId: "f4", ward: "OB Ward", type: "Maternity", total: 20, available: 5, occupied: 13, reserved: 2, lastUpdated: "2025-08-31" },
  { id: "b8", facilityId: "f4", ward: "Emergency Room", type: "Emergency", total: 20, available: 3, occupied: 16, reserved: 1, lastUpdated: "2025-08-31" },
  { id: "b9", facilityId: "f3", ward: "Observation Ward", type: "Observation", total: 8, available: 5, occupied: 3, reserved: 0, lastUpdated: "2025-08-30" },
];

export const EQUIPMENT = [
  { id: "e1", name: "Blood Pressure Monitor", category: "Diagnostic", facilities: [
    { facilityId: "f1", total: 3, available: 3, status: "Available", lastMaintenance: "2025-07-15", nextMaintenance: "2025-10-15", updatedBy: "Maria Santos" },
    { facilityId: "f2", total: 8, available: 7, status: "Available", lastMaintenance: "2025-08-01", nextMaintenance: "2025-11-01", updatedBy: "Roberto Cruz" },
    { facilityId: "f3", total: 4, available: 4, status: "Available", lastMaintenance: "2025-07-20", nextMaintenance: "2025-10-20", updatedBy: "Dr. Lourdes Bautista" },
    { facilityId: "f5", total: 2, available: 1, status: "Available", lastMaintenance: "2025-06-10", nextMaintenance: "2025-09-10", updatedBy: "Maria Santos" },
    { facilityId: "f4", total: 20, available: 18, status: "Available", lastMaintenance: "2025-08-15", nextMaintenance: "2025-11-15", updatedBy: "Carlo Mendoza" },
  ]},
  { id: "e2", name: "X-Ray Machine", category: "Imaging", facilities: [
    { facilityId: "f2", total: 2, available: 1, status: "Available", lastMaintenance: "2025-08-01", nextMaintenance: "2025-11-01", updatedBy: "Roberto Cruz" },
    { facilityId: "f3", total: 1, available: 0, status: "Under Maintenance", lastMaintenance: "2025-08-25", nextMaintenance: "2025-09-10", updatedBy: "Dr. Lourdes Bautista" },
    { facilityId: "f4", total: 4, available: 3, status: "Available", lastMaintenance: "2025-08-10", nextMaintenance: "2025-11-10", updatedBy: "Carlo Mendoza" },
  ]},
  { id: "e3", name: "Ultrasound Machine", category: "Imaging", facilities: [
    { facilityId: "f2", total: 2, available: 2, status: "Available", lastMaintenance: "2025-07-20", nextMaintenance: "2025-10-20", updatedBy: "Roberto Cruz" },
    { facilityId: "f4", total: 5, available: 4, status: "Available", lastMaintenance: "2025-08-12", nextMaintenance: "2025-11-12", updatedBy: "Carlo Mendoza" },
  ]},
  { id: "e4", name: "Pulse Oximeter", category: "Monitoring", facilities: [
    { facilityId: "f1", total: 4, available: 4, status: "Available", lastMaintenance: "2025-08-01", nextMaintenance: "2025-11-01", updatedBy: "Maria Santos" },
    { facilityId: "f2", total: 10, available: 9, status: "Available", lastMaintenance: "2025-08-15", nextMaintenance: "2025-11-15", updatedBy: "Roberto Cruz" },
    { facilityId: "f3", total: 4, available: 3, status: "Available", lastMaintenance: "2025-08-10", nextMaintenance: "2025-11-10", updatedBy: "Dr. Lourdes Bautista" },
    { facilityId: "f5", total: 2, available: 0, status: "Unavailable", lastMaintenance: "2025-05-01", nextMaintenance: "2025-08-01", updatedBy: "Maria Santos" },
    { facilityId: "f4", total: 25, available: 22, status: "Available", lastMaintenance: "2025-08-20", nextMaintenance: "2025-11-20", updatedBy: "Carlo Mendoza" },
  ]},
  { id: "e5", name: "Nebulizer", category: "Respiratory", facilities: [
    { facilityId: "f1", total: 2, available: 2, status: "Available", lastMaintenance: "2025-07-15", nextMaintenance: "2025-10-15", updatedBy: "Maria Santos" },
    { facilityId: "f2", total: 6, available: 5, status: "Available", lastMaintenance: "2025-08-01", nextMaintenance: "2025-11-01", updatedBy: "Roberto Cruz" },
    { facilityId: "f3", total: 2, available: 2, status: "Available", lastMaintenance: "2025-07-20", nextMaintenance: "2025-10-20", updatedBy: "Dr. Lourdes Bautista" },
    { facilityId: "f4", total: 12, available: 10, status: "Available", lastMaintenance: "2025-08-15", nextMaintenance: "2025-11-15", updatedBy: "Carlo Mendoza" },
  ]},
];

export const SERVICES = [
  { id: "s1", name: "General Consultation", category: "Outpatient", description: "General medical consultation with a licensed physician or health officer.", facilities: [
    { facilityId: "f1", status: "Available", schedule: "Mon–Fri, 8 AM – 4 PM", personnel: "Dr. Ana Fuentes", notes: "" },
    { facilityId: "f2", status: "Available", schedule: "Mon–Fri, 8 AM – 5 PM", personnel: "Multiple Physicians", notes: "" },
    { facilityId: "f3", status: "Limited", schedule: "Mon–Sat, 7 AM – 12 PM", personnel: "Dr. Lourdes Bautista", notes: "Doctor available until noon only today." },
    { facilityId: "f5", status: "Available", schedule: "Mon–Fri, 8 AM – 4 PM", personnel: "Dr. Ramon Ocampo", notes: "" },
    { facilityId: "f4", status: "Available", schedule: "Daily, 24/7", personnel: "Multiple Physicians", notes: "" },
  ]},
  { id: "s2", name: "Vaccination / Immunization", category: "Preventive", description: "Administration of vaccines per the national immunization program.", facilities: [
    { facilityId: "f1", status: "Available", schedule: "Mon, Wed, Fri – 8 AM – 12 PM", personnel: "RN Maria Santos", notes: "BCG, Hepatitis B, Pentavalent, OPV, Measles" },
    { facilityId: "f2", status: "Available", schedule: "Mon–Fri, 8 AM – 4 PM", personnel: "Nursing Staff", notes: "" },
    { facilityId: "f3", status: "Available", schedule: "Tue, Thu – 8 AM – 3 PM", personnel: "RN Staff", notes: "Bring immunization card" },
    { facilityId: "f5", status: "Limited", schedule: "Wed only – 8 AM – 12 PM", personnel: "RN Staff", notes: "Limited vaccine supply this week" },
  ]},
  { id: "s3", name: "Maternal & Child Care", category: "Reproductive Health", description: "Prenatal, postnatal, and child health services including growth monitoring.", facilities: [
    { facilityId: "f1", status: "Available", schedule: "Tue & Thu – 8 AM – 4 PM", personnel: "Midwife Carla Reyes", notes: "" },
    { facilityId: "f2", status: "Available", schedule: "Mon–Fri, 8 AM – 5 PM", personnel: "OB-GYN Team", notes: "" },
    { facilityId: "f3", status: "Available", schedule: "Mon–Sat, 7 AM – 5 PM", personnel: "Midwife Staff", notes: "" },
    { facilityId: "f5", status: "Available", schedule: "Mon, Wed, Fri – 8 AM – 4 PM", personnel: "Midwife Santos", notes: "" },
    { facilityId: "f4", status: "Available", schedule: "Daily, 24/7", personnel: "OB-GYN Dept.", notes: "" },
  ]},
  { id: "s4", name: "Laboratory Services", category: "Diagnostic", description: "Diagnostic laboratory tests including blood, urine, stool, and other specimens.", facilities: [
    { facilityId: "f2", status: "Available", schedule: "Mon–Fri, 7 AM – 5 PM", personnel: "Medical Technologists", notes: "CBC, Urinalysis, FBS, Lipid Profile" },
    { facilityId: "f3", status: "Limited", schedule: "Mon–Fri, 7 AM – 12 PM", personnel: "MedTech Staff", notes: "Basic tests only" },
    { facilityId: "f4", status: "Available", schedule: "Daily, 24/7", personnel: "Laboratory Dept.", notes: "Full panel available" },
  ]},
  { id: "s5", name: "TB-DOTS Program", category: "Communicable Disease", description: "Tuberculosis detection and directly observed treatment, short-course.", facilities: [
    { facilityId: "f2", status: "Available", schedule: "Mon–Fri, 8 AM – 4 PM", personnel: "TB Coordinator", notes: "" },
    { facilityId: "f3", status: "Available", schedule: "Mon–Fri, 8 AM – 4 PM", personnel: "RN Staff", notes: "Free sputum exam and medicines" },
    { facilityId: "f4", status: "Available", schedule: "Mon–Fri, 8 AM – 5 PM", personnel: "TB Team", notes: "" },
  ]},
  { id: "s6", name: "Family Planning", category: "Reproductive Health", description: "Counseling and services on natural and modern family planning methods.", facilities: [
    { facilityId: "f1", status: "Available", schedule: "Every Wednesday, 1 PM – 5 PM", personnel: "FP Coordinator", notes: "" },
    { facilityId: "f2", status: "Available", schedule: "Mon–Fri, 9 AM – 4 PM", personnel: "FP Team", notes: "" },
    { facilityId: "f3", status: "Available", schedule: "Mon & Thu – 8 AM – 4 PM", personnel: "Midwife Hernandez", notes: "" },
    { facilityId: "f5", status: "Unavailable", schedule: "—", personnel: "—", notes: "Currently no FP coordinator" },
  ]},
  { id: "s7", name: "Dental Services", category: "Dental", description: "Basic dental consultation, extraction, oral prophylaxis, and restoration.", facilities: [
    { facilityId: "f1", status: "Available", schedule: "Mon & Wed – 8 AM – 4 PM", personnel: "Dr. Ignacio (Dentist)", notes: "" },
    { facilityId: "f2", status: "Available", schedule: "Mon–Fri, 8 AM – 5 PM", personnel: "Dental Team", notes: "" },
    { facilityId: "f4", status: "Available", schedule: "Mon–Fri, 8 AM – 5 PM", personnel: "Dental Dept.", notes: "" },
  ]},
  { id: "s8", name: "Emergency Care", category: "Emergency", description: "24/7 emergency medical services for critical and life-threatening conditions.", facilities: [
    { facilityId: "f4", status: "Available", schedule: "24/7", personnel: "Emergency Dept.", notes: "High volume – expect wait" },
  ]},
];

export const INITIAL_APPOINTMENTS = [
  { id: "a1", userId: "u4", userName: "Juan dela Cruz", userPhone: "09501234567", facilityId: "f1", facilityName: "BHC Dao", serviceId: "s1", serviceName: "General Consultation", date: "2025-09-05", time: "09:00 AM", status: "Approved", notes: "Recurring cough and fever for 3 days.", staffNotes: "Confirmed. Please bring a valid ID.", createdAt: "2025-08-28", updatedAt: "2025-08-29" },
  { id: "a2", userId: "u4", userName: "Juan dela Cruz", userPhone: "09501234567", facilityId: "f2", facilityName: "Pagadian City Health Office", serviceId: "s4", serviceName: "Laboratory Services", date: "2025-09-10", time: "07:30 AM", status: "Pending", notes: "Fasting blood sugar and CBC.", createdAt: "2025-08-30", updatedAt: "2025-08-30" },
  { id: "a3", userId: "u5", userName: "Ana Reyes", userPhone: "09611234567", facilityId: "f3", facilityName: "RHU Lourdes Norte", serviceId: "s3", serviceName: "Maternal & Child Care", date: "2025-09-03", time: "10:00 AM", status: "Completed", notes: "4th prenatal checkup.", staffNotes: "All vitals normal. Schedule next visit in 4 weeks.", createdAt: "2025-08-20", updatedAt: "2025-09-03" },
  { id: "a4", userId: "u5", userName: "Ana Reyes", userPhone: "09611234567", facilityId: "f1", facilityName: "BHC Dao", serviceId: "s2", serviceName: "Vaccination / Immunization", date: "2025-08-20", time: "08:30 AM", status: "Cancelled", notes: "Child immunization – 2nd dose.", staffNotes: "Cancelled by patient.", createdAt: "2025-08-10", updatedAt: "2025-08-19" },
  { id: "a5", userId: "u4", userName: "Juan dela Cruz", userPhone: "09501234567", facilityId: "f4", facilityName: "Pagadian City Medical Center", serviceId: "s7", serviceName: "Dental Services", date: "2025-09-15", time: "02:00 PM", status: "Pending", notes: "Tooth extraction – lower right molar.", createdAt: "2025-08-31", updatedAt: "2025-08-31" },
];

export const INITIAL_NOTIFICATIONS = [
  { id: "n1", userId: "u4", title: "Appointment Approved", message: "Your appointment at BHC Dao on Sep 5, 2025 at 9:00 AM has been approved. Please bring a valid ID.", type: "appointment", read: false, createdAt: "2025-08-29T10:30:00" },
  { id: "n2", userId: "u4", title: "Appointment Reminder", message: "Reminder: You have an appointment at BHC Dao tomorrow, Sep 5, 2025 at 9:00 AM for General Consultation.", type: "appointment", read: false, createdAt: "2025-09-04T08:00:00" },
  { id: "n3", userId: "u4", title: "Facility Status Update", message: "BHC San Pedro is temporarily closed for facility repairs. Patients are redirected to BHC Dao.", type: "resource", read: true, createdAt: "2025-08-25T14:00:00" },
  { id: "n4", userId: "u4", title: "Emergency Status Alert", message: "ALERT: Pagadian City Medical Center ER is experiencing high patient volume. Expect extended wait times.", type: "emergency", read: false, createdAt: "2025-08-31T07:00:00" },
  { id: "n5", userId: "u5", title: "Appointment Completed", message: "Your prenatal checkup at RHU Lourdes Norte on Sep 3, 2025 has been completed. All vitals are normal.", type: "appointment", read: true, createdAt: "2025-09-03T12:00:00" },
  { id: "n6", userId: "u5", title: "Appointment Cancelled", message: "Your vaccination appointment at BHC Dao on Aug 20, 2025 has been cancelled.", type: "appointment", read: true, createdAt: "2025-08-19T09:00:00" },
  { id: "n7", userId: "u5", title: "Limited Service Notice", message: "RHU Lourdes Norte is operating with reduced staffing today. General Consultation available until 12 PM only.", type: "resource", read: false, createdAt: "2025-08-30T07:00:00" },
];

export const INITIAL_RESOURCE_UPDATES = [
  { id: "ru1", resourceType: "Medicine", resourceName: "Amoxicillin 500mg", facilityId: "f5", facilityName: "BHC Tuburan", field: "Status", previousValue: "Low Stock", newValue: "Unavailable", updatedById: "u2", updatedByName: "Maria Santos", notes: "Supply depleted. Requisition filed.", timestamp: "2025-08-25T13:45:00" },
  { id: "ru2", resourceType: "Equipment", resourceName: "X-Ray Machine", facilityId: "f3", facilityName: "RHU Lourdes Norte", field: "Status", previousValue: "Available", newValue: "Under Maintenance", updatedById: "u6", updatedByName: "Dr. Lourdes Bautista", notes: "Scheduled preventive maintenance.", timestamp: "2025-08-25T09:00:00" },
  { id: "ru3", resourceType: "Bed", resourceName: "Emergency Room", facilityId: "f4", facilityName: "Pagadian City Medical Center", field: "Available", previousValue: "6", newValue: "3", updatedById: "u7", updatedByName: "Carlo Mendoza", notes: "Surge in ER admissions.", timestamp: "2025-08-31T06:30:00" },
  { id: "ru4", resourceType: "Facility", resourceName: "BHC San Pedro", facilityId: "f6", facilityName: "BHC San Pedro", field: "Operational Status", previousValue: "Open", newValue: "Closed", updatedById: "u1", updatedByName: "Administrator", notes: "Closed for facility repair. Patients redirected to BHC Dao.", timestamp: "2025-08-28T08:00:00" },
  { id: "ru5", resourceType: "Facility", resourceName: "RHU Lourdes Norte", facilityId: "f3", facilityName: "RHU Lourdes Norte", field: "Operational Status", previousValue: "Open", newValue: "Limited", updatedById: "u6", updatedByName: "Dr. Lourdes Bautista", notes: "Reduced staffing. Doctor available until noon only.", timestamp: "2025-08-30T07:00:00" },
  { id: "ru6", resourceType: "Medicine", resourceName: "Paracetamol 500mg", facilityId: "f5", facilityName: "BHC Tuburan", field: "Quantity", previousValue: "200", newValue: "60", updatedById: "u2", updatedByName: "Maria Santos", notes: "Regular update after stock count.", timestamp: "2025-08-28T09:30:00" },
  { id: "ru7", resourceType: "Bed", resourceName: "ICU", facilityId: "f4", facilityName: "Pagadian City Medical Center", field: "Available", previousValue: "4", newValue: "2", updatedById: "u7", updatedByName: "Carlo Mendoza", notes: "Two admissions from ER.", timestamp: "2025-08-31T11:00:00" },
];

export const INITIAL_FEEDBACK = [
  { id: "fb1", userId: "u4", userName: "Juan dela Cruz", facilityId: "f1", facilityName: "BHC Dao", appointmentId: "a1", rating: 5, category: "Service Quality", comment: "Very attentive staff. Doctor took time to explain my condition clearly.", status: "Reviewed", response: "Thank you for your kind feedback!", createdAt: "2025-09-05" },
  { id: "fb2", userId: "u5", userName: "Ana Reyes", facilityId: "f3", facilityName: "RHU Lourdes Norte", appointmentId: "a3", rating: 4, category: "Staff Attitude", comment: "Midwife was very helpful. Wait time was a bit long.", status: "Reviewed", createdAt: "2025-09-03" },
  { id: "fb3", userId: "u4", userName: "Juan dela Cruz", facilityId: "f4", facilityName: "Pagadian City Medical Center", rating: 2, category: "Wait Time", comment: "Waited over 3 hours in the ER. Better signage needed.", status: "Pending", createdAt: "2025-08-31" },
];

export const INITIAL_ACTIVITY_LOGS = [
  { id: "al1", userId: "u4", userName: "Juan dela Cruz", role: "patient", action: "Login", module: "Authentication", details: "Successful login", ipAddress: "192.168.1.45", timestamp: "2025-08-31T08:15:00", success: true },
  { id: "al2", userId: "u4", userName: "Juan dela Cruz", role: "patient", action: "Book Appointment", module: "Appointments", details: "Booked appointment at Pagadian City Health Office for Laboratory Services on Sep 10", ipAddress: "192.168.1.45", timestamp: "2025-08-30T16:02:00", success: true },
  { id: "al3", userId: "u2", userName: "Maria Santos", role: "staff", action: "Update Resource", module: "Resources", details: "Updated Amoxicillin 500mg at BHC Tuburan: Low Stock → Unavailable", ipAddress: "10.0.0.12", timestamp: "2025-08-25T13:45:00", success: true },
  { id: "al4", userId: "u2", userName: "Maria Santos", role: "staff", action: "Approve Appointment", module: "Appointments", details: "Approved appointment for Juan dela Cruz – General Consultation on Sep 5", ipAddress: "10.0.0.12", timestamp: "2025-08-29T10:28:00", success: true },
  { id: "al5", userId: "u1", userName: "Administrator", role: "admin", action: "Update Facility Status", module: "Admin", details: "Set BHC San Pedro to Closed for facility repair", ipAddress: "10.0.0.1", timestamp: "2025-08-28T08:00:00", success: true },
  { id: "al6", userId: "u7", userName: "Carlo Mendoza", role: "staff", action: "Update Queue", module: "Resources", details: "Updated ER queue at Pagadian City Medical Center: 45 patients, ~120 min wait", ipAddress: "10.0.0.15", timestamp: "2025-08-31T06:30:00", success: true },
  { id: "al7", userId: "u5", userName: "Ana Reyes", role: "patient", action: "Login", module: "Authentication", details: "Successful login from mobile", ipAddress: "192.168.1.88", timestamp: "2025-08-31T07:45:00", success: true },
  { id: "al8", userId: "u6", userName: "Dr. Lourdes Bautista", role: "staff", action: "Update Facility Status", module: "Resources", details: "Set RHU Lourdes Norte to Limited – reduced staffing", ipAddress: "10.0.0.20", timestamp: "2025-08-30T07:00:00", success: true },
  { id: "al9", userId: "u6", userName: "Dr. Lourdes Bautista", role: "staff", action: "Update Resource", module: "Resources", details: "Updated X-Ray Machine at RHU Lourdes Norte to Under Maintenance", ipAddress: "10.0.0.20", timestamp: "2025-08-25T09:00:00", success: true },
  { id: "al10", userId: "u3", userName: "Roberto Cruz", role: "staff", action: "Login Failed", module: "Authentication", details: "Failed login – incorrect password", ipAddress: "10.0.0.15", timestamp: "2025-08-30T07:55:00", success: false },
];

export const APPOINTMENT_SLOTS = {
  s1: ["08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM"],
  s2: ["08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"],
  s3: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "01:00 PM", "01:30 PM", "02:00 PM"],
  s4: ["07:30 AM", "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM"],
  s5: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM"],
  s6: ["01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"],
  s7: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"],
  s8: ["No appointment needed – Walk-in only"],
};
