"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Moon, Sun, Lock, User as UserIcon, Settings } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  language: string;
  theme: string;
}

export default function AdminProfilePage() {
  const { theme: activeTheme, setTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Language state (local/sync)
  const [language, setLanguage] = useState("es");

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get<UserProfile>("/profile");
        setProfile(data);
        setLanguage(data.language ?? "es");
        if (data.theme) {
          setTheme(data.theme);
        }
      } catch (err) {
        toast.error("Error al cargar perfil");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [setTheme]);

  const translations = {
    es: {
      title: "Configuración de Perfil",
      description: "Administra tus preferencias de idioma, apariencia y seguridad.",
      accountDetails: "Detalles de la Cuenta",
      name: "Nombre",
      email: "Correo Electrónico",
      role: "Rol",
      preferences: "Preferencias del Sistema",
      languageLabel: "Idioma de Interfaz",
      themeLabel: "Tema Visual",
      savePreferences: "Guardar Preferencias",
      changePassword: "Cambiar Contraseña",
      currentPass: "Contraseña Actual",
      newPass: "Nueva Contraseña",
      confirmPass: "Confirmar Nueva Contraseña",
      updatePassBtn: "Actualizar Contraseña",
      loading: "Cargando configuración...",
      successPrefs: "Preferencias actualizadas con éxito",
      errorPrefs: "Ocurrió un error al guardar las preferencias",
      successPass: "Contraseña actualizada con éxito",
      errorPass: "Error al actualizar contraseña",
      passMismatch: "Las contraseñas nuevas no coinciden",
      passTooShort: "La nueva contraseña debe tener al menos 8 caracteres",
    },
    en: {
      title: "Profile Settings",
      description: "Manage your interface language, visual theme, and account security.",
      accountDetails: "Account Details",
      name: "Name",
      email: "Email Address",
      role: "Role",
      preferences: "System Preferences",
      languageLabel: "Interface Language",
      themeLabel: "Visual Theme",
      savePreferences: "Save Preferences",
      changePassword: "Change Password",
      currentPass: "Current Password",
      newPass: "New Password",
      confirmPass: "Confirm New Password",
      updatePassBtn: "Update Password",
      loading: "Loading settings...",
      successPrefs: "Preferences updated successfully",
      errorPrefs: "An error occurred while saving preferences",
      successPass: "Password updated successfully",
      errorPass: "Error updating password",
      passMismatch: "New passwords do not match",
      passTooShort: "New password must be at least 8 characters long",
    },
  }[language === "en" ? "en" : "es"];

  async function handleSavePreferences(selectedLang: string, selectedTheme: string) {
    setSavingSettings(true);
    try {
      const { data } = await api.patch("/profile", {
        language: selectedLang,
        theme: selectedTheme,
      });
      setLanguage(data.language);
      setTheme(selectedTheme);
      toast.success(translations.successPrefs);
    } catch {
      toast.error(translations.errorPrefs);
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(translations.passMismatch);
      return;
    }
    if (newPassword.length < 8) {
      toast.error(translations.passTooShort);
      return;
    }

    setSavingPassword(true);
    try {
      await api.patch("/profile", {
        currentPassword,
        newPassword,
      });
      toast.success(translations.successPass);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const errMsg = err?.response?.data?.error ?? translations.errorPass;
      toast.error(errMsg);
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground animate-pulse">{translations.loading}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {translations.title}
        </h1>
        <p className="text-muted-foreground text-sm">
          {translations.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Info card */}
        <Card className="border border-border/40 shadow-sm bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              {translations.accountDetails}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider font-semibold">
                {translations.name}
              </span>
              <span className="font-medium text-foreground">{profile?.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider font-semibold">
                {translations.email}
              </span>
              <span className="font-medium text-foreground">{profile?.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider font-semibold">
                {translations.role}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mt-1">
                {profile?.role}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Configurations and Preferences */}
        <div className="md:col-span-2 space-y-6">
          {/* Preferences Settings */}
          <Card className="border border-border/40 shadow-sm bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                {translations.preferences}
              </CardTitle>
              <CardDescription>
                Cambia la apariencia y el lenguaje de tu sesión de manera interactiva.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {translations.languageLabel}
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={language === "es" ? "default" : "outline"}
                    className="flex-1 transition-all"
                    onClick={() => handleSavePreferences("es", activeTheme ?? "light")}
                    disabled={savingSettings}
                  >
                    Español
                  </Button>
                  <Button
                    type="button"
                    variant={language === "en" ? "default" : "outline"}
                    className="flex-1 transition-all"
                    onClick={() => handleSavePreferences("en", activeTheme ?? "light")}
                    disabled={savingSettings}
                  >
                    English
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  {activeTheme === "dark" ? (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Sun className="h-4 w-4 text-muted-foreground" />
                  )}
                  {translations.themeLabel}
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={activeTheme === "light" ? "default" : "outline"}
                    className="flex-1 transition-all gap-2"
                    onClick={() => handleSavePreferences(language, "light")}
                    disabled={savingSettings}
                  >
                    <Sun className="h-4 w-4" />
                    Claro
                  </Button>
                  <Button
                    type="button"
                    variant={activeTheme === "dark" ? "default" : "outline"}
                    className="flex-1 transition-all gap-2"
                    onClick={() => handleSavePreferences(language, "dark")}
                    disabled={savingSettings}
                  >
                    <Moon className="h-4 w-4" />
                    Oscuro
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="border border-border/40 shadow-sm bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                {translations.changePassword}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{translations.currentPass}</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{translations.newPass}</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{translations.confirmPass}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={savingPassword} className="w-full">
                  {savingPassword ? "Actualizando..." : translations.updatePassBtn}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
