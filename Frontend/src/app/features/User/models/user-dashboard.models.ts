// TypeScript interfaces matching backend models

export interface Vehicle {
  id: number;
  name: string;
  model: string;
  year: number;
  regNumber: string;
  type: string;
  color?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  basePriceLkr: number;
  finalPriceLkr: number;
}

export interface CreateAppointmentDto {
  customerName: string;
  phoneNumber: string;
  specialInstructions?: string | null;
  vehicleId?: number | null;
  vehicleName?: string | null;
  vehicleModel?: string | null;
  vehicleYear?: number | null;
  vehicleRegNumber?: string | null;
  vehicleType?: string | null;
  services: ServiceItem[];
  totalPriceLkr: number;
}

export interface Appointment {
  id: number;
  customerName: string;
  phoneNumber: string;
  status: string; // "Requested", "Accepted", "Completed", "Rejected"
  specialInstructions?: string | null;
  vehicleId?: number | null;
  vehicleName?: string | null;
  vehicleModel?: string | null;
  vehicleYear?: number | null;
  vehicleRegNumber?: string | null;
  vehicleType?: string | null;
  selectedServicesJson: string; // JSON string of ServiceItem[]
  totalPriceLkr: number;
  createdAtUtc: string; // ISO date string
}

export interface UpdateStatusDto {
  status: string;
}

