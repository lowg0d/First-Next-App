"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [token, setToken] = React.useState("");
  const [verified, setVerified] = React.useState(false);
  const [error, setError] = React.useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyEmail", { token: token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.response.data);
    }
  };

  React.useEffect(() => {
    if (verified === true) {
      router.push("/i");
    }
  }, [verified]);

  React.useEffect(() => {
    const tokenFromUrl = window.location.search.split("=")[1];
    setToken(tokenFromUrl);
  });

  React.useEffect(() => {
    try {
      if (token.length > 0) {
        verifyUserEmail();
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      {error && (
        <h1 className="text-red-700 text-2xl">Something went wrong :(</h1>
      )}
      {!verified && !error && <Spinner color="success" size="lg" />}
    </div>
  );
}
