import type { Metadata } from "next";
import VerifyEmailForm from "./VerifyEmailForm";

export const metadata: Metadata = {
  title: "Set Password",
};

export default function VerifyEmailPage() {
  return <VerifyEmailForm />;
}
