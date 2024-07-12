"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import VerifyPhone from "./VerifyPhone";

function VerifyPhoneWrapper() {
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const role = searchParams.get("role");
  const token = searchParams.get("token");

  return (
    <VerifyPhone email={email} id={id} name={name} role={role} token={token} />
  );
}

export default function SearchParamsWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPhoneWrapper />
    </Suspense>
  );
}
