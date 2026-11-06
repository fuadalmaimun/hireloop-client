import { SignUpForm } from "@/components/auth-forms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — HireLoop",
};

export default function SignUpPage() {
  return <SignUpForm />;
}