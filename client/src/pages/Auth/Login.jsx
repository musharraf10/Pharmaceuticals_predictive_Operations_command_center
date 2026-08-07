import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
    Activity,
    ArrowRight,
    CheckCircle2,
    Dna,
    Eye,
    EyeOff,
    Info,
    Lock,
    Mail,
    Moon,
    ShieldCheck,
    Sparkles,
    Sun,
    UserCheck,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { useLayout } from "../../hooks/useLayout";
import getErrorMessage from "../../utils/getErrorMessage";

const DEMO_ACCOUNTS = [
    {
        role: "Admin",
        email: "admin@pharma.com",
        password: "Admin@123",
    },
    {
        role: "Operator",
        email: "moheet@gmail.com",
        password: "9182399196",
    },
    {
        role: "Analyst",
        email: "muqeet@gmail.com",
        password: "9182399196",
    },
];

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { theme, toggleTheme } = useLayout();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState(DEMO_ACCOUNTS[0]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (formData) => {
        try {
            setLoading(true);
            await login(formData);
            toast.success("Welcome to PharmaOps Command Center!");
            navigate("/dashboard");
        } catch (error) {
            toast.error(getErrorMessage(error, "Login failed"));
        } finally {
            setLoading(false);
        }
    };

    const fillCredentials = (acc) => {
        setSelectedRole(acc);
        setValue("email", acc.email, { shouldValidate: true });
        setValue("password", acc.password, { shouldValidate: true });
        toast.success(`${acc.role} credentials loaded!`);
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100/70 via-rose-50/60 to-indigo-100/50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-indigo-950/50 dark:to-slate-950 p-4 font-sans text-slate-900 dark:text-white transition-colors duration-300">
            {/* Top Floating Theme Switcher */}
            <div className="absolute right-4 top-4 sm:right-6 sm:top-6 z-20">
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-md backdrop-blur-md transition-all duration-200 hover:border-primary-500 hover:scale-105"
                    title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {theme === "dark" ? (
                        <>
                            <Sun size={16} className="text-amber-400" />
                            <span>Light Mode</span>
                        </>
                    ) : (
                        <>
                            <Moon size={16} className="text-primary-600" />
                            <span>Dark Mode</span>
                        </>
                    )}
                </button>
            </div>

            {/* Animated Ambient Gradient Orbs */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-[450px] w-[450px] rounded-full bg-sky-300/50 dark:bg-sky-500/25 blur-3xl filter animate-blob" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-[450px] w-[450px] rounded-full bg-pink-300/50 dark:bg-purple-500/25 blur-3xl filter animate-blob animation-delay-2000" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-300/40 dark:bg-indigo-500/20 blur-3xl filter animate-blob animation-delay-4000" />

            {/* Grid Pattern Overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
                    backgroundSize: "24px 24px",
                }}
            />

            {/* Main Centered Container */}
            <div className="relative z-10 grid w-full max-w-sm sm:max-w-md lg:max-w-5xl overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 shadow-2xl backdrop-blur-xl transition-all duration-300 lg:grid-cols-12">
                {/* Left Column: Concept & Branding */}
                <div className="relative hidden lg:flex lg:col-span-7 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 p-8 lg:p-12 text-white">
                    {/* Subtle DNA background watermark */}
                    <div className="pointer-events-none absolute right-4 top-12 opacity-5">
                        <Dna size={320} />
                    </div>

                    <div>
                        {/* Top Brand Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3.5 py-1.5 backdrop-blur-md">
                            <Sparkles size={16} className="text-primary-400" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary-300">
                                PharmaOps AI Engine
                            </span>
                        </div>

                        {/* Title & Tagline */}
                        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight">
                            Pharmaceutical Predictive Operations
                        </h1>
                        <p className="mt-3 text-base text-slate-300 sm:text-lg">
                            Next-generation AI command center for real-time supply chain intelligence, SKU forecasting, and quality assurance.
                        </p>

                        {/* Feature Highlights */}
                        <div className="mt-8 space-y-3.5">
                            {[
                                {
                                    title: "AI Demand & Inventory Telemetry",
                                    desc: "Predictive neural models for zero-stockout manufacturing.",
                                },
                                {
                                    title: "GMP & Quality Batch Triage",
                                    desc: "Automated defect signals and risk-level classification.",
                                },
                                {
                                    title: "End-to-End Delivery Fulfillment",
                                    desc: "Real-time order dispatch and supplier reliability metrics.",
                                },
                            ].map((feat, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3.5 backdrop-blur-sm transition-all duration-200 hover:border-primary-500/40 hover:bg-slate-800/50"
                                >
                                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-600/20 text-primary-400">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-200">{feat.title}</p>
                                        <p className="text-xs text-slate-400">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Live System Indicator */}
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            </span>
                            <span className="font-medium text-slate-300">Live AI Cluster Active</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                            <Activity size={14} className="text-primary-400" />
                            <span>v2.5-Flash Engine</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Interactive Login Form */}
                <div className="flex flex-col justify-center bg-white/95 dark:bg-slate-900/90 p-6 sm:p-8 lg:p-10 text-slate-900 dark:text-white transition-colors duration-300 lg:col-span-5">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign In to Command Center</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Enter your credentials to access operations dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Work Email
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="admin@pharma.com"
                                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:border-primary-600 dark:focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                    {...register("email", { required: "Email is required" })}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-rose-500 dark:text-rose-400">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-3 pl-10 pr-11 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:border-primary-600 dark:focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                    {...register("password", { required: "Password is required" })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-rose-500 dark:text-rose-400">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all duration-200 hover:from-primary-500 hover:to-blue-500 hover:shadow-primary-600/40 active:scale-[0.99] disabled:opacity-60"
                        >
                            {loading ? (
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    <span>Access Operations Center</span>
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Multi-Role Demo Credentials Selector */}
                    <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-primary-600 dark:text-primary-400" />
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Demo Environment Access
                                </span>
                            </div>
                            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <UserCheck size={11} /> {selectedRole.role}
                            </span>
                        </div>

                        {/* Role Pills */}
                        <div className="mt-3 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                            {DEMO_ACCOUNTS.map((acc) => (
                                <button
                                    key={acc.role}
                                    type="button"
                                    onClick={() => fillCredentials(acc)}
                                    className={`flex-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 ${selectedRole.role === acc.role
                                        ? "bg-primary-600 text-white shadow-sm"
                                        : "bg-slate-200/60 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                                        }`}
                                >
                                    {acc.role}
                                </button>
                            ))}
                        </div>

                        {/* Selected Role Display */}
                        <div className="mt-2.5 space-y-1 text-xs font-mono text-slate-600 dark:text-slate-400">
                            <p className="truncate">
                                <span className="text-slate-400 dark:text-slate-500 font-sans">Email:</span> {selectedRole.email}
                            </p>
                            <p>
                                <span className="text-slate-400 dark:text-slate-500 font-sans">Password:</span> {selectedRole.password}
                            </p>
                        </div>

                        {/* Implementation Note */}
                        <div className="mt-3 flex items-start gap-2 border-t border-slate-200 dark:border-slate-800/80 pt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <Info size={14} className="mt-0.5 shrink-0 text-primary-500" />
                            <p className="leading-tight">
                                <strong className="font-semibold text-slate-700 dark:text-slate-300">Note:</strong> I have Implemented RBAC before and also I have added search, Sort functionalities.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;