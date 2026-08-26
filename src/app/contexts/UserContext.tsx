import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types/user';

/**
 * Client-side-only auth/role state. THERE IS NO BACKEND BEHIND THIS.
 *
 * The seeded "user" below is a placeholder so the role-gated pages
 * (AdminDashboard, ProviderDashboard, SupportDashboard, AccessDenied) have
 * something to render during review. Wiring this to real authentication is
 * separate work — this context must not be mistaken for a real session.
 */

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  canAccessPHI: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Mock user — no auth backend exists yet. Replace with a real session once
  // one does.
  const [user, setUser] = useState<User | null>({
    id: 'demo-user',
    role: 'patient',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
  });

  const hasRole = (role: UserRole | UserRole[]) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const canAccessPHI = () => {
    if (!user) return false;
    // Only patients (own data), providers, and admins can access PHI.
    // Support staff CANNOT access PHI per HIPAA requirements.
    return ['patient', 'provider', 'admin'].includes(user.role);
  };

  return (
    <UserContext.Provider value={{ user, setUser, hasRole, canAccessPHI }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
