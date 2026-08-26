export type UserRole = 'patient' | 'provider' | 'admin' | 'support';

export interface User {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  location?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  resourceType: 'PHI' | 'Profile' | 'Appointment' | 'Insurance' | 'Billing' | 'System';
  resourceId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface PHIData {
  type: 'insurance' | 'medical-record' | 'diagnosis' | 'prescription' | 'lab-result';
  encrypted: boolean;
  lastAccessed?: Date;
  accessCount: number;
}
