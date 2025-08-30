import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Card,
	Button,
	Label,
	TextInput,
	Alert,
	Spinner,
	Progress,
} from "flowbite-react";
import {
	HiEye,
	HiEyeOff,
	HiMail,
	HiLockClosed,
	HiExclamationCircle,
	HiHome,
	HiUser,
	HiCheckCircle,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { z } from "zod";
// import { registerSchema } from "../schemas/authSchemas";
import { useAuthContext } from "../context/Auth";
import { useTranslation } from "react-i18next";
import Loading from "../components/Loading";

const Signup = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const { signup } = useAuthContext();
	const { t } = useTranslation("auth", "validation");

	const registerSchema = z
		.object({
			firstName: z
				.string()
				.min(1, t("validation:firstName.required"))
				.min(2, t("validation:firstName.min"))
				.max(50, t("validation:firstName.max"))
				.regex(
					/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/,
					t("validation:firstName.regex")
				),
			lastName: z
				.string()
				.min(1, t("validation:lastName.required"))
				.min(2, t("validation:lastName.min"))
				.max(50, t("validation:lastName.max"))
				.regex(
					/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/,
					t("validation:lastName.regex")
				),
			email: z
				.string()
				.min(1, t("validation:email.required"))
				.email(t("validation:email.invalid"))
				.max(50, t("validation:email.max")),
			password: z
				.string()
				.min(1, t("validation:password.required"))
				.min(8, t("validation:password.min"))
				.max(32, t("validation:password.max"))
				.regex(
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
					t("validation:password.regex")
				),
			confirmPassword: z
				.string()
				.min(1, t("validation:confirmPassword.required")),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t("validation:confirmPassword.match"),
			path: ["confirmPassword"],
		});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		watch,
		reset,
	} = useForm({
		resolver: zodResolver(registerSchema),
		mode: "onChange",
	});

	const watchPassword = watch("password", "");

	const getPasswordStrength = (password) => {
		let strength = 0;
		if (password.length >= 8) strength += 25;
		if (/[a-z]/.test(password)) strength += 25;
		if (/[A-Z]/.test(password)) strength += 25;
		if (/\d/.test(password)) strength += 25;
		return strength;
	};

	const passwordStrength = getPasswordStrength(watchPassword);

	const getPasswordStrengthColor = (strength) => {
		if (strength < 50) return "red";
		if (strength < 75) return "yellow";
		return "green";
	};

	const getPasswordStrengthText = (strength) => {
		if (strength < 50) return t("auth:signup.passwordStrengthWeak");
		if (strength < 75) return t("auth:signup.passwordStrengthMedium");
		if (strength < 100) return t("auth:signup.passwordStrengthStrong");
		return t("auth:signup.passwordStrengthStronger");
	};

	const onSubmit = async (data) => {
		try {
			setIsLoading(true);
			setError("");
			setSuccess("");

			const response = await signup(
				data.firstName,
				data.lastName,
				data.email,
				data.password,
				data.confirmPassword
			);

			if (response && response.status === 201) {
				setSuccess(t("auth:signup.success"));
				reset();
			} else {
				setError(t("auth:signup.error"));
			}
		} catch (error) {
			console.error("Register error:", error);
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				setError(error.response.data.message);
			} else {
				setError(t("auth:signup.serverError"));
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
				<div className="w-full max-w-lg">
					{/* Logo ve Başlık */}
					<div className="text-center mb-8">
						<div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
							<HiHome className="w-8 h-8 text-white" />
						</div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							{t("auth:signup.title")}
						</h1>
						<p className="text-gray-600 dark:text-gray-400 mt-2">
							{t("auth:signup.subtitle")}
						</p>
					</div>

					<Card className="w-full">
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-6"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* First Name */}
								<div>
									<Label
										htmlFor="firstName"
										value="Ad"
										className="mb-2 block"
									/>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
											<HiUser className="w-5 h-5 text-gray-400" />
										</div>
										<TextInput
											id="firstName"
											type="text"
											placeholder={t(
												"auth:signup.firstNamePlaceholder"
											)}
											className="pl-10 pr-10 md:pr-2"
											color={
												errors.firstName
													? "failure"
													: "gray"
											}
											{...register("firstName")}
										/>
									</div>
									<div className="h-4 mt-1">
										{errors.firstName && (
											<p className="text-sm text-red-600 dark:text-red-400">
												{errors.firstName.message}
											</p>
										)}
									</div>
								</div>

								{/* Last Name */}
								<div>
									<Label
										htmlFor="lastName"
										value="Soyad"
										className="mb-2 block"
									/>
									<div className="relative">
										<div className="absolute md:hidden inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
											<HiUser className="w-5 h-5 text-gray-400" />
										</div>
										<TextInput
											id="lastName"
											type="text"
											placeholder={t(
												"auth:signup.lastNamePlaceholder"
											)}
											className="pl-10 pr-10 md:pl-2"
											color={
												errors.lastName
													? "failure"
													: "gray"
											}
											{...register("lastName")}
										/>
									</div>
									<div className="h-4 mt-1">
										{errors.lastName && (
											<p className="text-sm text-red-600 dark:text-red-400">
												{errors.lastName.message}
											</p>
										)}
									</div>
								</div>
							</div>

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
										placeholder={t(
											"auth:signup.emailPlaceholder"
										)}
										className="pl-10 pr-10"
										color={
											errors.email ? "failure" : "gray"
										}
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
										type={
											showPassword ? "text" : "password"
										}
										placeholder="••••••••"
										className="pl-10 pr-10"
										color={
											errors.password ? "failure" : "gray"
										}
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

							{/* Confirm Password Field */}
							<div>
								<Label
									htmlFor="confirmPassword"
									value="Şifre Onayı"
									className="mb-2 block"
								/>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
										<HiLockClosed className="w-5 h-5 text-gray-400" />
									</div>
									<TextInput
										id="confirmPassword"
										type={
											showConfirmPassword
												? "text"
												: "password"
										}
										placeholder="••••••••"
										className="pl-10 pr-10"
										color={
											errors.confirmPassword
												? "failure"
												: "gray"
										}
										{...register("confirmPassword")}
									/>
									<button
										type="button"
										className="absolute inset-y-0 right-0 flex items-center pr-3"
										onClick={() =>
											setShowConfirmPassword(
												!showConfirmPassword
											)
										}
									>
										{showConfirmPassword ? (
											<HiEyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
										) : (
											<HiEye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
										)}
									</button>
								</div>
								<div className="h-4 mt-1">
									{errors.confirmPassword && (
										<p className="text-sm text-red-600 dark:text-red-400">
											{errors.confirmPassword.message}
										</p>
									)}
								</div>

								{/* Password Strength Indicator */}
								<div className="mt-3">
									<div className="flex justify-between text-sm mb-2">
										<span className="text-gray-600 dark:text-gray-400">
											{t("auth:signup.passwordStrength") + ":"}
										</span>
										<span
											className={`font-medium ${
												passwordStrength < 50
													? "text-red-600"
													: passwordStrength < 75
													? "text-yellow-600"
													: "text-green-600"
											}`}
										>
											{getPasswordStrengthText(passwordStrength)}
										</span>
									</div>
									<Progress
										progress={passwordStrength}
										color={getPasswordStrengthColor(passwordStrength)}
										size="sm"
									/>
								</div>
							</div>

							{/* Success Alert */}
							{success && (
								<Alert color="success" icon={HiCheckCircle}>
									<span className="font-medium">
										{t("auth:SuccessAlert")}
									</span>{" "}
									{success}
								</Alert>
							)}

							{/* Error Alert */}
							{error && (
								<Alert
									color="failure"
									icon={HiExclamationCircle}
								>
									<span className="font-medium">
										{t("auth:errorAlert")}
									</span>{" "}
									{error}
								</Alert>
							)}

							{/* Submit Button */}
							<Button
								type="submit"
								className="w-full dark:bg-green-600 hover:bg-green-700"
								disabled={isLoading || isSubmitting}
								size="lg"
								color="success"
							>
								{isLoading ? (
									<div className="flex items-center">
										<Spinner size="sm" className="mr-2" />
										{t("auth:signup.loading")}
									</div>
								) : (
									t("auth:signup.submit")
								)}
							</Button>

							{/* Login Link */}
							<div className="text-center text-sm text-gray-600 dark:text-gray-400">
								{t("auth:signup.haveAccount")}{" "}
								<Link
									to="/login"
									className="text-green-600 hover:text-green-800 dark:text-green-400 font-medium"
								>
									{t("auth:signup.login")}
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
			{isLoading && <Loading message={t("auth:signup.loading")} />}
		</>
	);
};

export default Signup;
