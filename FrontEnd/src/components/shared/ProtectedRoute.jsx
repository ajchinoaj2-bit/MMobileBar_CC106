import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../../utils/auth';

export default function ProtectedRoute({ role, children }) {
  const currentUser = getCurrentUser();

  if (!currentUser || currentUser.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}