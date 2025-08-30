import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import {
	HiLockClosed,
	HiEye,
	HiEyeOff,
	HiExclamationCircle,
	HiHome,
	HiCheckCircle,
} from "react-icons/hi";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/Auth";
import { useTranslation } from "react-i18next";

const ResetPasswordPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const { token, email } = useParams();
	const navigate = useNavigate();
	const { resetPassword } = useAuthContext();
	const { t } = useTranslation(["auth", "validation"]);

	const resetPasswordSchema = z
		.object({
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
		reset,
	} = useForm({
		resolver: zodResolver(resetPasswordSchema),
		mode: "onChange",
	});

	// Token ve email kontrolü
	useEffect(() => {
		if (!token || !email) {
			setError(t("auth:resetPassword.invalidLink"));
		}
	}, [token, email, t]);

	const onSubmit = async (data) => {
		try {
			setIsLoading(true);
			setError("");

			const response = await resetPassword(
				token,
				email,
				data.password,
				data.confirmPassword
			);

			if (response && response.status === 200) {
				setSuccess(true);
				reset();
			} else {
				setError(t("auth:resetPassword.error"));
			}
		} catch (error) {
			console.error("Reset password error:", error);
			setError(t("auth:resetPassword.serverError"));
		} finally {
			setIsLoading(false);
		}
	};

	if (success) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					<Card className="w-full text-center">
						<div className="p-6">
							<div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
								<HiCheckCircle className="w-8 h-8 text-green-600" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
								{t("auth:resetPassword.successTitle")}
							</h2>
							<p className="text-gray-600 dark:text-gray-400 mb-6">
								{t("auth:resetPassword.successMessage")}
							</p>
							<Link to="/login">
								<Button className="w-full">
									{t("auth:resetPassword.goToLogin")}
								</Button>
							</Link>
						</div>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo ve Başlık */}
				<div className="text-center mb-8">
					<div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
						<HiHome className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						{t("auth:resetPassword.title")}
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-2">
						{t("auth:resetPassword.subtitle")}
					</p>
				</div>

				<Card className="w-full">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{/* Email Display */}
						<div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
							<p className="text-sm text-gray-600 dark:text-gray-400">
								{t("auth:resetPassword.emailInfo")}:{" "}
								<strong>{email}</strong>
							</p>
						</div>

						{/* New Password Field */}
						<div>
							<Label
								htmlFor="password"
								value={t("auth:resetPassword.newPassword")}
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
							{errors.password && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{t(errors.password.message)}
								</p>
							)}
						</div>

						{/* Confirm Password Field */}
						<div>
							<Label
								htmlFor="confirmPassword"
								value={t("auth:resetPassword.confirmPassword")}
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
							{errors.confirmPassword && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{t(errors.confirmPassword.message)}
								</p>
							)}
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
							disabled={
								isLoading || isSubmitting || !token || !email
							}
							size="lg"
						>
							{isLoading ? (
								<div className="flex items-center">
									<Spinner size="sm" className="mr-2" />
									{t("auth:resetPassword.loading")}
								</div>
							) : (
								t("auth:resetPassword.submit")
							)}
						</Button>

						{/* Back to Login Link */}
						<div className="text-center">
							<Link
								to="/login"
								className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
							>
								{t("auth:resetPassword.backToLogin")}
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

export default ResetPasswordPage;
