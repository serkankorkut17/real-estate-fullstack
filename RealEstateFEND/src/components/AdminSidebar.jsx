import {
	Sidebar,
	SidebarItems,
	SidebarItem,
	SidebarItemGroup,
	ToggleSwitch,
} from "flowbite-react";
import {
	HiHome,
	HiViewGrid,
	HiPlus,
	HiMap,
	HiLogout,
	HiCurrencyDollar,
	HiFire,
	HiOfficeBuilding,
	HiFlag,
	HiMoon,
	HiSun,
	HiGlobeAlt,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../context/Auth";
import { useTheme } from "../context/Theme";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
	const location = useLocation();
	const [currentLanguage, setCurrentLanguage] = useState("tr");
	const { i18n } = useTranslation();
	const { t } = useTranslation("sidebar");
	const { logout } = useAuthContext();

	const { darkMode, toggleDarkMode } = useTheme();

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
		setCurrentLanguage(lng);
	};

	const handleLanguageToggle = (checked) => {
		const newLang = checked ? "en" : "tr";
		changeLanguage(newLang);
	};

	return (
		<div
			className={`fixed inset-y-0 left-0 pt-[60px] z-40 w-64 transform ${
				sidebarOpen ? "translate-x-0" : "-translate-x-full"
			} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:pt-[60px]`}
		>
			<div className="h-full bg-white border-r border-gray-200">
				<Sidebar
					aria-label="Sidebar"
					className="h-full [&>div]:h-full [&>div]:flex [&>div]:flex-col [&>div]:rounded-none"
				>
					<SidebarItems className="flex-1 overflow-y-auto">
						<SidebarItemGroup>
							<SidebarItem
								as={Link}
								to="/admin/dashboard"
								icon={HiHome}
								active={
									location.pathname === "/admin/dashboard" ||
									location.pathname === "/admin"
								}
							>
								{t("dashboard")}
							</SidebarItem>

							<SidebarItem
								as={Link}
								to="/admin/properties"
								icon={HiViewGrid}
								active={location.pathname === "/admin/properties"}
							>
								{t("properties")}
							</SidebarItem>

							<SidebarItem
								as={Link}
								to="/admin/properties/new"
								icon={HiPlus}
								active={location.pathname === "/admin/properties/new"}
							>
								{t("new_property")}
							</SidebarItem>

							<SidebarItem
								as={Link}
								to="/admin/map"
								icon={HiMap}
								active={location.pathname === "/admin/map"}
							>
								{t("map_view")}
							</SidebarItem>
						</SidebarItemGroup>

						{/* <SidebarItemGroup title="Parametreler">
							<SidebarItem
								as={Link}
								to="/parameters/property-types"
								icon={HiOfficeBuilding}
								active={
									location.pathname ===
									"/parameters/property-types"
								}
							>
								{t("property_types")}
							</SidebarItem>

							<SidebarItem
								as={Link}
								to="/parameters/property-status"
								icon={HiFlag}
								active={
									location.pathname ===
									"/parameters/property-status"
								}
							>
								{t("property_status")}
							</SidebarItem>

							<SidebarItem
								as={Link}
								to="/parameters/currencies"
								icon={HiCurrencyDollar}
								active={
									location.pathname ===
									"/parameters/currencies"
								}
							>
								{t("currencies")}
							</SidebarItem>

							<SidebarItem
								as={Link}
								to="/parameters/heating-types"
								icon={HiFire}
								active={
									location.pathname ===
									"/parameters/heating-types"
								}
							>
								{t("heating_types")}
							</SidebarItem>
						</SidebarItemGroup> */}

						<SidebarItemGroup title="Ayarlar">
							<SidebarItem
								icon={HiGlobeAlt}
								className="cursor-pointer"
							>
								<div className="flex items-center justify-between w-full">
									<span>{t("language")}</span>
									<div className="flex items-center space-x-2">
										<span
											className={`text-xs font-medium ${
												currentLanguage === "tr"
													? "text-blue-600 dark:text-blue-400"
													: "text-gray-500 dark:text-gray-400"
											}`}
										>
											TR
										</span>
										<ToggleSwitch
											checked={currentLanguage === "en"}
											onChange={handleLanguageToggle}
											color="blue"
											size="sm"
										/>
										<span
											className={`text-xs font-medium ${
												currentLanguage === "en"
													? "text-blue-600 dark:text-blue-400"
													: "text-gray-500 dark:text-gray-400"
											}`}
										>
											EN
										</span>
									</div>
								</div>
							</SidebarItem>
							<SidebarItem
								icon={darkMode ? HiSun : HiMoon}
								className="cursor-pointer"
								onClick={toggleDarkMode}
							>
								{darkMode ? t("light_mode") : t("dark_mode")}
							</SidebarItem>
							<SidebarItem
								icon={HiLogout}
								className="text-red-600 hover:bg-red-50 cursor-pointer"
								onClick={logout}
							>
								{t("logout")}
							</SidebarItem>
						</SidebarItemGroup>
					</SidebarItems>
				</Sidebar>
			</div>
		</div>
	);
};

export default AdminSidebar;
