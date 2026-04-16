import { useState, useEffect } from "react";
import { User, Bell, Building2, Plug, Save, Users, Mail, Plus, Shield, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function SettingsView() {
    // User Profile
    const [userName, setUserName] = useState("Kliyan Zwin");
    const [userEmail, setUserEmail] = useState("admin@wasla.com");
    const [businessName, setBusinessName] = useState("Wasla Store");
    const [businessPhone, setBusinessPhone] = useState("+212 600000000");

    // Notification Settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [desktopNotifications, setDesktopNotifications] = useState(true);
    const [orderAlerts, setOrderAlerts] = useState(true);

    // Business Settings
    const [currency, setCurrency] = useState("MAD");
    const [timezone, setTimezone] = useState("Africa/Casablanca");
    const [language, setLanguage] = useState("en");

    const [isLoading, setIsLoading] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState("Agent");

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const parts = token.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(atob(parts[1]));
                    if (payload && payload.role) setCurrentUserRole(payload.role);
                }
            } catch (err) {
                console.error("Token decoding error:", err);
            }
        }

        // Authenticated Backend Fetch
        fetch('/api/settings', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        })
            .then(res => {
                if(!res.ok) throw new Error("Could not fetch");
                return res.json();
            })
            .then(data => {
                if(data.user) {
                    setUserName(data.user.name || "");
                    setUserEmail(data.user.email || "");
                }
                setBusinessName(data.businessName || "");
                setBusinessPhone(data.businessPhone || "");
                setCurrency(data.currency || "MAD");
                setTimezone(data.timezone || "Africa/Casablanca");
                setLanguage(data.language || "en");
                setEmailNotifications(data.emailNotifications ?? true);
                setSmsNotifications(data.smsNotifications ?? false);
                setDesktopNotifications(data.desktopNotifications ?? true);
                setOrderAlerts(data.orderAlerts ?? true);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);


    const handleSave = async () => {
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    userName,
                    businessName,
                    businessPhone,
                    currency,
                    timezone,
                    language,
                    emailNotifications,
                    smsNotifications,
                    desktopNotifications,
                    orderAlerts
                })
            });
            if (!res.ok) throw new Error("Failed to save");
            toast.success("Settings saved successfully!");
        } catch (e) {
            console.error(e);
            toast.error("Error saving settings");
        }
    };

    return (
        <div className="flex h-screen w-full flex-col bg-background">
            {/* Header */}
            <div className="border-b border-border px-6 py-4">
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your account and preferences
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="mx-auto max-w-4xl px-6 py-8">
                    {/* User Profile Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Profile</h2>
                                <p className="text-sm text-muted-foreground">Personal information</p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Name</label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Email</label>
                                <input
                                    type="email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator className="my-8" />

                    {/* Business Information */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Business Information</h2>
                                <p className="text-sm text-muted-foreground">Company details and formatting</p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Business Name</label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Phone Number</label>
                                <input
                                    type="tel"
                                    value={businessPhone}
                                    onChange={(e) => setBusinessPhone(e.target.value)}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Currency</label>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="MAD">Moroccan Dirham (MAD)</option>
                                    <option value="USD">US Dollar (USD)</option>
                                    <option value="EUR">Euro (EUR)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Timezone</label>
                                <select
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="Africa/Casablanca">Casablanca</option>
                                    <option value="Europe/London">London</option>
                                    <option value="Europe/Paris">Paris</option>
                                    <option value="America/New_York">New York</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-8" />

                    {/* Notifications */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Bell className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                                <p className="text-sm text-muted-foreground">Manage how you receive alerts</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                <div>
                                    <p className="font-medium text-foreground">Email Notifications</p>
                                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                </div>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        checked={emailNotifications}
                                        onChange={(e) => setEmailNotifications(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                <div>
                                    <p className="font-medium text-foreground">SMS Notifications</p>
                                    <p className="text-sm text-muted-foreground">Receive SMS for urgent updates</p>
                                </div>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        checked={smsNotifications}
                                        onChange={(e) => setSmsNotifications(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                <div>
                                    <p className="font-medium text-foreground">Desktop Notifications</p>
                                    <p className="text-sm text-muted-foreground">Show desktop notifications</p>
                                </div>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        checked={desktopNotifications}
                                        onChange={(e) => setDesktopNotifications(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                <div>
                                    <p className="font-medium text-foreground">New Order Alerts</p>
                                    <p className="text-sm text-muted-foreground">Get alerted for new orders</p>
                                </div>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        checked={orderAlerts}
                                        onChange={(e) => setOrderAlerts(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-8" />

                    {/* Integrations */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Plug className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Integrations</h2>
                                <p className="text-sm text-muted-foreground">Connect external services</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                { name: "WhatsApp Business API", status: "Connected", color: "text-green-600" },
                                { name: "Stripe Payment", status: "Not Connected", color: "text-muted-foreground" },
                                { name: "Google Calendar", status: "Not Connected", color: "text-muted-foreground" },
                            ].map((integration) => (
                                <div
                                    key={integration.name}
                                    className="flex items-center justify-between rounded-lg border border-border p-4"
                                >
                                    <div>
                                        <p className="font-medium text-foreground">{integration.name}</p>
                                        <p className={`text-sm ${integration.color}`}>{integration.status}</p>
                                    </div>
                                    <button className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover">
                                        {integration.status === "Connected" ? "Disconnect" : "Connect"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            <Save className="h-4 w-4" />
                            Save Changes
                        </button>
                    </div>

                    <Separator className="my-8" />
                    <TeamManagementSection currentUserRole={currentUserRole} />
                </div>
            </div>
        </div>
    );
}

function TeamManagementSection({ currentUserRole }: { currentUserRole: string }) {
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("Agent");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users', { headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } });
                if (res.ok) {
                    const data = await res.json();
                    setTeamMembers(data);
                }
            } catch (err) { console.error("Error fetching users:", err); }
        };
        fetchUsers();
    }, []);

    const handleInvite = async () => {
        if (!inviteEmail) return toast.error("Please enter an email");
        try {
            const res = await fetch('/api/users/invite', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('authToken')}` },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole })
            });

            if (res.ok) {
                const data = await res.json();
                toast.success("Invitation sent successfully! Mock link generated.");
                console.log("Mock invitation sent to:", data.tempPassword);
                setTeamMembers([...teamMembers, data.user]);
                setShowInviteModal(false);
                setInviteEmail("");
            } else {
                toast.error("Failed to invite member");
            }
        } catch(err) {
            toast.error("Error inviting member");
        }
    };

    const handleRemove = async (id: number) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem('authToken')}` }
            });
            if (res.ok) {
                toast.success("User removed");
                setTeamMembers(teamMembers.filter(m => m.id !== id));
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to remove user");
            }
        } catch(err) {
            toast.error("Error removing member");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Team Management</h2>
                        <p className="text-sm text-muted-foreground">Manage roles, agents, and access</p>
                    </div>
                </div>
                {currentUserRole === 'Admin' && (
                    <button 
                        onClick={() => setShowInviteModal(true)}
                        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Invite Member
                    </button>
                )}
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 font-semibold tracking-wider">Name</th>
                            <th className="px-6 py-4 font-semibold tracking-wider">Email</th>
                            <th className="px-6 py-4 font-semibold tracking-wider">Role</th>
                            <th className="px-6 py-4 text-right font-semibold tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                        {teamMembers.map(member => (
                            <tr key={member.id} className="hover:bg-muted/20">
                                <td className="px-6 py-4 font-medium text-foreground">{member.name}</td>
                                <td className="px-6 py-4 text-muted-foreground flex items-center gap-2"><Mail className="h-3 w-3" />{member.email}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                                        <Shield className="h-3 w-3" /> {member.role || 'Agent'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {currentUserRole === 'Admin' && (
                                        <button onClick={() => handleRemove(member.id)} className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-md transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-foreground">Invite New Team Member</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Email Address</label>
                                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none" placeholder="agent@wasla.com" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">Role</label>
                                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none">
                                    <option value="Admin">Admin</option>
                                    <option value="Agent">Agent</option>
                                    <option value="Viewer">Viewer</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setShowInviteModal(false)} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted font-semibold transition-colors">Cancel</button>
                            <button onClick={handleInvite} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Send Invitation</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
