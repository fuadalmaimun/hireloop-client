import type { Metadata } from "next";
import { SignInForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Sign In — HireLoop",
};

export default function SignInPage() {
  
  return <SignInForm />;
}
