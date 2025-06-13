import { useAdmin } from '@/contexts/RoleContext';


// Simple hook to check if user is admin
export const useAdminCheck = () => {
  const { isAdmin } = useAdmin();
  return isAdmin;
};

// Hook to get current role
export const useCurrentRole = () => {
  const { currentRole } = useAdmin();
  return currentRole;
};

// Hook to check if user is on admin route
export const useIsAdminRoute = () => {
  const { currentRole } = useAdmin();
  return currentRole === 'admin';
}; 