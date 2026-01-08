import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/api';

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
