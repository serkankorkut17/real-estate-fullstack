import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import {
	HiMail,
	HiExclamationCircle,
	HiHome,
	HiArrowLeft,
	HiCheckCircle,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/Auth";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const { resetPasswordRequest } = useAuthContext();
	const { t } = useTranslation(["auth", "validation"]);

	const forgotPasswordSchema = z.object({
		email: z
			.string()
			.min(1, t("validation:email.required"))
			.email(t("validation:email.invalid"))
			.max(50, t("validation:email.max")),
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm({
		resolver: zodResolver(forgotPasswordSchema),
		mode: "onChange",
	});

	const onSubmit = async (data) => {
		try {
			setIsLoading(true);
			setError("");

			const response = await resetPasswordRequest(data.email);

			if (response && response.status === 200) {
				setSuccess(true);
				reset();
			} else {
				setError(t("auth:forgotPassword.error"));
			}
		} catch (error) {
			console.error("Forgot password error:", error);
			setError(t("auth:forgotPassword.serverError"));
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
								{t("auth:forgotPassword.successTitle")}
							</h2>
							<p className="text-gray-600 dark:text-gray-400 mb-6">
								{t("auth:forgotPassword.successMessage")}
							</p>
							<Link to="/login">
								<Button className="w-full">
									<HiArrowLeft className="w-4 h-4 mr-2" />
									{t("auth:forgotPassword.backToLogin")}
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
						{t("auth:forgotPassword.title")}
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-2">
						{t("auth:forgotPassword.subtitle")}
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
								value={t("auth:forgotPassword.emailLabel")}
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
							{errors.email && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{t(errors.email.message)}
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
							disabled={isLoading || isSubmitting}
							size="lg"
						>
							{isLoading ? (
								<div className="flex items-center">
									<Spinner size="sm" className="mr-2" />
									{t("auth:forgotPassword.loading")}
								</div>
							) : (
								t("auth:forgotPassword.submit")
							)}
						</Button>

						{/* Back to Login Link */}
						<div className="text-center">
							<Link
								to="/login"
								className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium inline-flex items-center"
							>
								<HiArrowLeft className="w-4 h-4 mr-1" />
								{t("auth:forgotPassword.backToLogin")}
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

export default ForgotPassword;
