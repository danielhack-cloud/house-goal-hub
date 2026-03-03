import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Lock, Bell, LogOut, Trash2 } from "lucide-react";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Notification prefs (local state for now)
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: displayName })
        .eq("user_id", user.id);
      if (error) throw error;
      toast.success("Profile updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      toast.error(e.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteAccount = () => {
    toast.error("Please contact support to delete your account.");
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Please sign in to access settings.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-heading text-2xl font-bold">Settings</h1>

        {/* Profile */}
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold mb-4">
            <User className="h-5 w-5 text-primary" /> Profile
          </h2>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <Input value={user.email || ""} disabled className="mt-1 bg-muted" />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Display Name</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="mt-1"
              />
            </div>
            <Button onClick={handleUpdateProfile} disabled={saving || !displayName.trim()}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </Card>

        {/* Password */}
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold mb-4">
            <Lock className="h-5 w-5 text-primary" /> Change Password
          </h2>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="mt-1"
              />
            </div>
            <Button onClick={handleChangePassword} disabled={changingPassword || !newPassword}>
              {changingPassword ? "Updating…" : "Update Password"}
            </Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold mb-4">
            <Bell className="h-5 w-5 text-primary" /> Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Receive push notifications on your device</p>
              </div>
              <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-destructive/30">
          <h2 className="font-heading text-lg font-semibold mb-4">Account</h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
            <Separator />
            <Button variant="destructive" className="w-full justify-start gap-2" onClick={handleDeleteAccount}>
              <Trash2 className="h-4 w-4" /> Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
