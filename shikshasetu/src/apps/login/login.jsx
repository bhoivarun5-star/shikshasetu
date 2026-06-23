import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
    Mail,
    Lock,
    User,
    Phone,
    Eye,
    EyeOff,
    Sun,
    Moon,
    Loader2,
    CheckCircle2,
    AlertCircle,
    BookOpen,
    Target,
    Users,
} from "lucide-react";
import BridgeScene from "./BridgeScene";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const FEATURES = [
    { icon: BookOpen, label: "Skill Development" },
    { icon: Target, label: "Career Guidance" },
    { icon: Users, label: "Learning Community" },
];

function FormField({
    icon: Icon,
    type = "text",
    value,
    onChange,
    placeholder,
    required,
    dark,
    toggle,
}) {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (show ? "text" : "password") : type;

    return (
        <div className="relative">
            <Icon
                size={17}
                className={cx(
                    "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2",
                    dark ? "text-indigo-300/70" : "text-indigo-400/80"
                )}
            />
            <input
                type={inputType}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={cx(
                    "w-full rounded-xl border-2 py-3 pl-10 text-[0.92rem] outline-none transition-all duration-200",
                    isPassword && toggle ? "pr-10" : "pr-3.5",
                    dark
                        ? "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-400 focus:border-amber-300/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-amber-300/10"
                        : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/15"
                )}
            />
            {isPassword && toggle && (
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className={cx(
                        "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
                        dark ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
            )}
        </div>
    );
}
export default function Login({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const reduceMotion = useReducedMotion();

    const [fullName, setFullName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        if (!isLogin && password !== confirmPassword) {
            setMessage({ text: "Passwords do not match.", type: "error" });
            setLoading(false);
            return;
        }

        const endpoint = isLogin ? "/api/login/" : "/api/register/";
        const payload = isLogin
            ? { email, password }
            : { email, password, fullName, mobileNumber };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage({ text: data.message, type: "success" });
                if (isLogin) {
                    console.log("Logged in user:", data.user);
                    if (onLoginSuccess) {
                        onLoginSuccess(data.user);
                    }
                } else {
                    setFullName("");
                    setMobileNumber("");
                    setConfirmPassword("");
                    setIsLogin(true);
                }
            } else {
                setMessage({ text: data.message || "An error occurred.", type: "error" });
            }
        } catch (err) {
            console.error(err);
            setMessage({ text: "Failed to connect to the server.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin((v) => !v);
        setMessage(null);
    };

    return (
        <div
            className={cx(
                "relative flex min-h-screen items-center justify-center overflow-hidden p-4 transition-colors duration-500 sm:p-6",
                darkMode ? "bg-[#0E0D22]" : "bg-gradient-to-br from-[#EEF2FF] via-[#E5E9FB] to-[#FDF2E3]"
            )}
        >
            {/* ambient drifting glow, quiet motion behind the card */}
            {!reduceMotion && (
                <>
                    <motion.div
                        aria-hidden
                        className="pointer-events-none absolute -left-40 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
                        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        aria-hidden
                        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl"
                        animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
                        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                    />
                </>
            )}

            {/* theme toggle */}
            <motion.button
                onClick={() => setDarkMode((d) => !d)}
                aria-label="Toggle dark mode"
                whileTap={{ scale: 0.9 }}
                className={cx(
                    "absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full shadow-lg backdrop-blur transition-colors",
                    darkMode ? "bg-white/10 text-amber-200" : "bg-white text-indigo-600"
                )}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={darkMode ? "sun" : "moon"}
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex"
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </motion.span>
                </AnimatePresence>
            </motion.button>

            {/* card */}
            <motion.div
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={cx(
                    "relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-[28px] shadow-2xl lg:flex-row",
                    darkMode ? "shadow-black/40" : "shadow-indigo-950/10"
                )}
            >
                {/* hero / bridge panel */}
                <div className="relative flex h-44 shrink-0 flex-col justify-end overflow-hidden p-6 text-white sm:h-56 sm:p-8 lg:h-auto lg:w-[44%] lg:justify-center lg:p-10">
                    <BridgeScene className="absolute inset-0 h-full w-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/10 lg:to-transparent" />

                    <motion.div
                        initial={reduceMotion ? false : "hidden"}
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
                        }}
                        className="relative"
                    >
                        <motion.h1
                            variants={{
                                hidden: { opacity: 0, x: -16 },
                                visible: { opacity: 1, x: 0 },
                            }}
                            className="font-serif text-3xl font-semibold tracking-tight drop-shadow-sm sm:text-4xl lg:text-[2.6rem]"
                            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                        >
                            ShikshaSetu
                        </motion.h1>
                        <motion.p
                            variants={{
                                hidden: { opacity: 0, x: -16 },
                                visible: { opacity: 1, x: 0 },
                            }}
                            className="mt-2 max-w-xs text-sm leading-relaxed text-white/85 sm:text-[0.95rem]"
                        >
                            A bridge from where you are to where you're going — skills, mentorship, and opportunity, together.
                        </motion.p>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, x: -16 },
                                visible: { opacity: 1, x: 0 },
                            }}
                            className="mt-5 hidden flex-col gap-2.5 sm:flex"
                        >
                            {FEATURES.map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex w-fit items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-sm backdrop-blur-md transition-colors hover:bg-white/15"
                                >
                                    <Icon size={16} className="text-amber-200" />
                                    {label}
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* form panel */}
                <motion.div
                    layout
                    className={cx(
                        "flex flex-1 items-center justify-center px-6 py-8 sm:px-10 sm:py-10 transition-colors duration-500",
                        darkMode ? "bg-[#15132B]" : "bg-white"
                    )}
                >
                    <motion.div layout className="w-full max-w-sm">
                        <div className="relative mb-6 overflow-hidden min-h-[56px] sm:min-h-[64px]">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={isLogin ? "login-header" : "register-header"}
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h2
                                        className={cx(
                                            "text-2xl font-semibold",
                                            darkMode ? "text-white" : "text-slate-900"
                                        )}
                                        style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                                    >
                                        {isLogin ? "Welcome back" : "Create your account"}
                                    </h2>
                                    <p className={cx("mt-1 text-sm", darkMode ? "text-slate-400" : "text-slate-500")}>
                                        {isLogin
                                            ? "Pick up right where you left off."
                                            : "Takes less than a minute to get started."}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className={cx(
                                        "flex items-center gap-2 overflow-hidden rounded-xl px-3.5 py-2.5 text-sm font-medium",
                                        message.type === "success"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-rose-50 text-rose-700"
                                    )}
                                >
                                    {message.type === "success" ? (
                                        <CheckCircle2 size={16} className="shrink-0" />
                                    ) : (
                                        <AlertCircle size={16} className="shrink-0" />
                                    )}
                                    {message.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.form layout onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                            <AnimatePresence initial={false}>
                                {!isLogin && (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                        className="flex flex-col gap-3.5 overflow-hidden pb-1"
                                    >
                                        <FormField
                                            icon={User}
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Full name"
                                            required
                                            dark={darkMode}
                                        />
                                        <FormField
                                            icon={Phone}
                                            type="tel"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value)}
                                            placeholder="Mobile number"
                                            dark={darkMode}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <FormField
                                icon={Mail}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                required
                                dark={darkMode}
                            />
                            <FormField
                                icon={Lock}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                dark={darkMode}
                                toggle
                            />

                            <AnimatePresence initial={false}>
                                {!isLogin && (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                        className="overflow-hidden pt-1"
                                    >
                                        <FormField
                                            icon={Lock}
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm password"
                                            required
                                            dark={darkMode}
                                            toggle
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                layout
                                type="submit"
                                disabled={loading}
                                whileHover={loading ? {} : { scale: 1.015 }}
                                whileTap={loading ? {} : { scale: 0.98 }}
                                className={cx(
                                    "mt-1.5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E8773F] to-[#F2B345] py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-opacity",
                                    loading && "cursor-not-allowed opacity-70"
                                )}
                            >
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                {loading ? "Processing..." : isLogin ? "Log in" : "Register"}
                            </motion.button>
                        </motion.form>

                        <motion.p
                            layout
                            className={cx(
                                "mt-5 text-center text-sm",
                                darkMode ? "text-slate-400" : "text-slate-500"
                            )}
                        >
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                            <button
                                type="button"
                                onClick={switchMode}
                                className={cx(
                                    "font-semibold underline-offset-2 transition-colors hover:underline",
                                    darkMode ? "text-amber-300" : "text-indigo-600"
                                )}
                            >
                                {isLogin ? "Register" : "Log in"}
                            </button>
                        </motion.p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}