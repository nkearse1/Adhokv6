'use client';
import { ForgotPassword } from "@clerk/nextjs";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="h-8 w-8 text-[#2E3A8C] font-bold text-2xl">💼</div>
            <h1 className="text-3xl font-bold text-[#2F2F2F]">Adhok</h1>
          </div>
          <p className="text-sm text-[#00A499] font-medium">Reset your password</p>
        </div>

        <ForgotPassword
          appearance={{
            elements: {
              formButtonPrimary: "bg-[#2E3A8C] hover:bg-[#2E3A8C]/90",
              card: "shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formFieldLabel: "text-gray-700",
              formFieldInput: "border border-gray-300 rounded-md",
              footerActionLink: "text-[#2E3A8C] hover:text-[#2E3A8C]/90"
            }
          }}
          redirectUrl="/sign-in"
        />
      </div>
    </main>
  );
}
