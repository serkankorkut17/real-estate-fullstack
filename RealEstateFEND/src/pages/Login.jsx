import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Card,
	Button,
	Label,
	TextInput,
	Alert,
	Checkbox,
	Spinner,
} from "flowbite-react";
import {
	HiEye,
	HiEyeOff,
	HiMail,
	HiLockClosed,
	HiExclamationCircle,
	HiHome,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/Auth";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const Login = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const { login } = useAuthContext();
	const { t } = useTranslation("auth", "validation");

	const loginSchema = z.object({
		email: z
			.string()
			.min(1, t("validation:email.required"))
			.email(t("validation:email.invalid"))
			.max(50, t("validation:email.max")),
		password: z
			.string()
			.min(1, t("validation:password.required"))
			.min(8, t("validation:password.min"))
			.max(32, t("validation:password.max")),
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
	});

	const onSubmit = async (data) => {
		try {
			setIsLoading(true);
			setError("");

			const response = await login(data.email, data.password, rememberMe);

			if (response && response.data) {
				reset();
				console.log("Login başarılı:", response.data);
			} else {
				setError(t("auth:login.error"));
			}
		} catch (error) {
			console.error("Login error:", error);
			setError(t("auth:login.serverError"));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo and Title */}
				<div className="text-center mb-8">
					<div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
						<HiHome className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						{t("auth:login.title")}
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-2">
						{t("auth:login.subtitle")}
					</p>
				</div>

				<Card className="w-full">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{/* Email Field */}
						<div>
							<Label
								htmlFor="email"
								value="Email Adresi"
								className="mb-2 block"
							/>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
									<HiMail className="w-5 h-5 text-gray-400" />
								</div>
								<TextInput
									id="email"
									type="email"
									placeholder="johndoe@example.com"
									className="pl-10 pr-10"
									color={errors.email ? "failure" : "gray"}
									{...register("email")}
								/>
							</div>
							<div className="h-4 mt-1">
								{errors.email && (
									<p className="text-sm text-red-600 dark:text-red-400">
										{errors.email.message}
									</p>
								)}
							</div>
						</div>

						{/* Password Field */}
						<div>
							<Label
								htmlFor="password"
								value="Şifre"
								className="mb-2 block"
							/>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
									<HiLockClosed className="w-5 h-5 text-gray-400" />
								</div>
								<TextInput
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									className="pl-10 pr-10"
									color={errors.password ? "failure" : "gray"}
									{...register("password")}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 flex items-center pr-3"
									onClick={() =>
										setShowPassword(!showPassword)
									}
								>
									{showPassword ? (
										<HiEyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
									) : (
										<HiEye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
									)}
								</button>
							</div>
							<div className="h-4 mt-1">
								{errors.password && (
									<p className="text-sm text-red-600 dark:text-red-400">
										{errors.password.message}
									</p>
								)}
							</div>
						</div>

						{/* Remember Me & Forgot Password */}
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<Checkbox
									id="remember"
									checked={rememberMe}
									onChange={(e) => setRememberMe(e.target.checked)}
								/>
								<Label
									htmlFor="remember"
									className="ml-2 text-sm"
								>
									{t("auth:login.rememberMe")}
								</Label>
							</div>
							<Link
								to="/forgot-password"
								className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
							>
								{t("auth:login.forgotPassword")}
							</Link>
						</div>

						{/* Error Alert */}
						{error && (
							<Alert color="failure" icon={HiExclamationCircle}>
								<span className="font-medium">
									{t("auth:errorAlert")}
								</span>{" "}
								{error}
							</Alert>
						)}

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full"
							disabled={isLoading || isSubmitting}
							size="lg"
						>
							{isLoading ? (
								<div className="flex items-center">
									<Spinner size="sm" className="mr-2" />
									{t("auth:login.loading")}
								</div>
							) : (
								t("auth:login.submit")
							)}
						</Button>

						{/* Register Link */}
						<div className="text-center text-sm text-gray-600 dark:text-gray-400">
							{t("auth:login.noAccount")}{" "}
							<Link
								to="/signup"
								className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
							>
								{t("auth:login.signup")}
							</Link>
						</div>
					</form>
				</Card>

				{/* Footer */}
				<div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
					{t("auth:footer")}
				</div>
			</div>
		</div>
	);
};

export default Login;
