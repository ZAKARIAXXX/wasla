import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('authToken', data.token);
                toast.success("Account created!", {
                    description: "Welcome to Wasla."
                });
                navigate("/dashboard");
            } else {
                toast.error("Error", {
                    description: data.error || "Failed to create account"
                });
            }
        } catch (error) {
            toast.error("Error", {
                description: "Network error. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Sign Up | Wasla</title>
            </Helmet>
            <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
                <Card className="w-full max-w-md border-border/50 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                        <CardDescription className="text-center">
                            Enter your information to get started
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSignup}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-background/50 focus:bg-background transition-colors"
                                />
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
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-background/50 focus:bg-background transition-colors"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary hover:underline font-medium">
                                    Log in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </>
    );
};

export default Signup;
