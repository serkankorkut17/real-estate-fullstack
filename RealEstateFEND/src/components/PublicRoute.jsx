import { useAuthContext } from "../context/Auth";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
	const { isLoggedIn } = useAuthContext();

	return isLoggedIn() ? <Navigate to="/login" replace /> : <Outlet />;
};

export default PublicRoute;
