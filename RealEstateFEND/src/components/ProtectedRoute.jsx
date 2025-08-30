import { useAuthContext } from "../context/Auth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
	const { isLoggedIn, isAdmin, loading } = useAuthContext();
	console.log(isLoggedIn(), isAdmin());

	if (loading) {
		return <div>Loading...</div>;
	}

	return (isLoggedIn() && isAdmin()) ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
