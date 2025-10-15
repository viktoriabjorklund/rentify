import * as React from "react";
import { useRouter } from "next/router";
import PrimaryButton from "@/components/PrimaryButton";
import AuthCard from "@/components/AuthCard";
import FormField from "@/components/FormField";
import { useAuth } from "../hooks/auth";

export default function CreateAccount() {
  const router = useRouter();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const { loading, errors, register } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const success = await register({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });
    if (success) {
      try {
        const { default: confetti } = await import("canvas-confetti");
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      } catch {}
      router.push("/login");
    }
  }

  return (
    <main
      className="relative flex items-center justify-center px-4 md:px-6 min-h-[calc(100vh-theme(height.14)-theme(spacing.20))] py-10 overflow-hidden"
      style={{ backgroundColor: "#F4F6F5" }}
    >
      {/* Gradient green blobs */}
      <div
        className="pointer-events-none absolute -top-12 right-1/6 h-[620px] w-[620px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(142,221,174,1.0), rgba(142,221,174,0.0))",
        }}
      />
      <div
        className="pointer-events-none absolute -left-10 top-1/3 h-[560px] w-[560px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(142,221,174,1.0), rgba(142,221,174,0.0))",
        }}
      />

      <AuthCard className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#174B33] mb-6">
          Create Account
        </h1>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {/* First name & Last name */}
          <div className="flex gap-4">
            <FormField
              id="firstname"
              label="First name"
              type="text"
              value={firstName}
              onChange={setFirstName}
              error={errors.firstName}
            />
            <FormField
              id="secondname"
              label="Last name"
              type="text"
              value={lastName}
              onChange={setLastName}
              error={errors.lastName}
            />
          </div>

          {/* Email */}
          <FormField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            error={errors.email}
          />

          {/* Password & Confirm Password */}
          <div className="flex gap-4">
            <FormField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              error={errors.password}
            />
            <FormField
              id="confirm-password"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              error={errors.confirmPassword}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <PrimaryButton type="submit" disabled={loading} size="md">
              {loading ? "Creating…" : "Create Account"}
            </PrimaryButton>
          </div>
        </form>
      </AuthCard>
    </main>
  );
}
