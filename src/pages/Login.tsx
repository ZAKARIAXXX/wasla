import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("admin@wasla.com");
    const [password, setPassword] = useState("admin123");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Forgot Password Flow State
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);
    
    // Reset Flow State
    const [resetToken, setResetToken] = useState(""); // If populated, show reset form
    const [newPassword, setNewPassword] = useState("");

    // Read token from URL on mount
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setResetToken(token);
            setShowForgotModal(true);
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            let result;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                result = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text ? `Server Error: ${text.substring(0, 100)}...` : 'Server is not responding. Did you restart the dev server?');
            }

            if (!response.ok) {
                throw new Error(result.message || 'Login failed');
            }

            // Success
            localStorage.setItem("authToken", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            localStorage.setItem("isAuthenticated", "true");

            toast.success("Welcome back!", {
                description: "You have successfully logged in.",
            });
            navigate("/dashboard");
        } catch (error) {
            toast.error("Login failed", {
                description: error instanceof Error ? error.message : "Please check your credentials and try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!forgotEmail) return;
        setForgotLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                if (data.mockToken) {
                    setResetToken(data.mockToken); // In dev, we just jump to the reset step
                    toast.info("Mock token received. Please enter a new password.", { duration: 5000 });
                } else {
                    setShowForgotModal(false);
                }
            } else {
                toast.error(data.error || "Failed to process request");
            }
        } catch {
            toast.error("Network error");
        } finally {
            setForgotLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword || !resetToken) return;
        setForgotLoading(true);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: resetToken, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setShowForgotModal(false);
                setResetToken("");
                setForgotEmail("");
                setNewPassword("");
            } else {
                toast.error(data.error || "Failed to reset password");
            }
        } catch {
            toast.error("Network error");
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Login | Wasla</title>
            </Helmet>
            <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
                <Card className="w-full max-w-md border-border/50 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                        <CardDescription className="text-center">
                            Sign in to your Wasla CRM account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4">
                            <div className="rounded-md bg-muted/50 border border-border/50 px-3 py-2 text-xs text-muted-foreground">
                                <span className="font-medium">Demo credentials:</span>{" "}
                                admin@wasla.com / admin123
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-background/50 focus:bg-background transition-colors"
                                    autoComplete="email"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowForgotModal(true)} 
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-background/50 focus:bg-background transition-colors"
                                    autoComplete="current-password"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-primary hover:underline font-medium">
                                    Sign up
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
                    <Card className="w-full max-w-sm border-border shadow-2xl animate-in fade-in zoom-in duration-200">
                        <CardHeader>
                            <CardTitle className="text-xl">{resetToken ? "Reset Password" : "Forgot Password"}</CardTitle>
                            <CardDescription>
                                {resetToken ? "Enter your new password below." : "Enter your email to receive a reset link."}
                            </CardDescription>
                        </CardHeader>
                        {!resetToken ? (
                            <form onSubmit={handleForgotPassword}>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Label htmlFor="forgotEmail">Email</Label>
                                        <Input
                                            id="forgotEmail"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button type="button" variant="ghost" onClick={() => setShowForgotModal(false)}>Cancel</Button>
                                    <Button type="submit" disabled={forgotLoading}>
                                        {forgotLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Link"}
                                    </Button>
                                </CardFooter>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Reset Token</Label>
                                            <Input value={resetToken} disabled className="bg-muted text-xs font-mono" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button type="button" variant="ghost" onClick={() => { setShowForgotModal(false); setResetToken(""); }}>Cancel</Button>
                                    <Button type="submit" disabled={forgotLoading}>
                                        {forgotLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
                                    </Button>
                                </CardFooter>
                            </form>
                        )}
                    </Card>
                </div>
            )}
        </>
    );
};

export default Login;
