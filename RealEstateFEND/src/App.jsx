import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/Auth";
import { ThemeProvider } from "./context/Theme";
import { RealEstateProvider } from "./context/RealEstate";
import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import PropertyList from "./pages/Admin/PropertyList";
import PropertyForm from "./pages/Admin/PropertyForm";
import MapView from "./pages/Admin/MapView";
import UserLayout from "./pages/User/UserLayout";
import HomePage from "./pages/User/HomePage";
import MyProperties from "./pages/User/MyProperties";
import NewProperty from "./pages/User/NewProperty";
import PropertyMapView from "./pages/User/PropertyMapView";
import EditMyProperty from "./pages/User/EditMyProperty";
import Property from "./pages/User/Property";
import Properties from "./pages/User/Properties";
import Profile from "./pages/User/Profile";
import Favorites from "./pages/User/Favorites";
import Messages from "./pages/User/Messages";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { ChatProvider } from "./context/Chat";

function App() {
	return (
		<>
			<Router>
				<ThemeProvider>
					<AuthProvider>
						<RealEstateProvider>
							<ChatProvider>
							<Routes>
								<Route path="/" element={<UserLayout />}>
									<Route index element={<HomePage />} />
									<Route path="properties" element={<Properties />} />
									<Route path="properties/:id" element={<Property />} />
									<Route path="properties/new" element={<NewProperty />} />
									<Route path="map" element={<PropertyMapView />} />
									<Route
										path="/user/my-properties"
										element={<MyProperties />}
									/>
									<Route path="/user/profile" element={<Profile />} />
									<Route path="/user/favorites" element={<Favorites />} />
									<Route path="/user/messages" element={<Messages />} />
									<Route
										path="/user/edit-property/:id"
										element={<EditMyProperty />}
									/>
								</Route>
								{/* Auth Routes */}
								<Route element={<PublicRoute />}>
									<Route path="/" element={<UserLayout />}>
										<Route path="/login" element={<Login />} />
										<Route path="/signup" element={<Signup />} />
										<Route
											path="/forgot-password"
											element={<ForgotPassword />}
										/>
										<Route
											path="/reset-password/:token/:email"
											element={<ResetPasswordPage />}
										/>
									</Route>
								</Route>
								{/* Protected Routes */}
								<Route element={<ProtectedRoute />}>
									<Route path="/admin" element={<AdminLayout />}>
										<Route index element={<Dashboard />} />
										<Route path="dashboard" element={<Dashboard />} />
										<Route path="properties" element={<PropertyList />} />
										<Route path="properties/new" element={<PropertyForm />} />
										<Route path="properties/:id" element={<PropertyForm />} />
										<Route
											path="properties/:id/edit"
											element={<PropertyForm />}
										/>
										<Route path="map" element={<MapView />} />
									</Route>
								</Route>
							</Routes>
						</ChatProvider>
					</RealEstateProvider>
				</AuthProvider>
				</ThemeProvider>
			</Router>
			<ToastContainer position="top-right" autoClose={500} />
		</>
	);
}

export default App;
