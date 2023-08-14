"use client";

import React from "react";
import axios from "axios";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Button, Input, Link } from "@nextui-org/react";

export default function SignUpPage() {
  const router = useRouter();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });

  const [loading, setLoading] = React.useState(false);

  const loadingState = React.useMemo(() => {
    if (loading == true) return "primary";
    return "default";
  }, [loading]);

  // valida Email
  const validateEmail = (mail: String) =>
    mail.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{1,4}$/i);

  const emailValidationState = React.useMemo(() => {
    if (user.email === "") return undefined;

    return validateEmail(user.email) ? "valid" : "invalid";
  }, [user.email]);

  // valida Username
  const validateUsername = (username: String) =>
    username.length >= 3 && username.length < 16;

  const usernameValidationState = React.useMemo(() => {
    if (user.username === "") return undefined;

    return validateUsername(user.username) ? "valid" : "invalid";
  }, [user.username]);

  // valida Password
  const validatePassword = (password: String) =>
    password.length >= 8 && password.length < 16;

  const passwordValidationState = React.useMemo(() => {
    if (user.password === "") return undefined;

    return validatePassword(user.password) ? "valid" : "invalid";
  }, [user.password]);

  // Validate Whole Form
  const validateForm = () => {
    const emailValid = validateEmail(user.email);
    const usernameValid = validateUsername(user.username);
    const passwordValid = validatePassword(user.password);

    return emailValid && usernameValid && passwordValid;
  };

  const onSignUp = async () => {
    setLoading(true);
    try {
      const response = await axios.post("api/users/signup", user);
      console.log(response.data);
      router.push("/login");
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-zinc-900 rounded-lg shadow-md p-8 space-y-6 max-w-md w-full">
        <div className="space-y-3">
          <Input
            isRequired
            color={emailValidationState === "invalid" ? "danger" : "default"}
            errorMessage={
              emailValidationState === "invalid" && "Please enter a valid email"
            }
            validationState={emailValidationState}
            id="email"
            value={user.email}
            onChange={(e) =>
              setUser((prevUser) => ({ ...prevUser, email: e.target.value }))
            }
            size="sm"
            variant="faded"
            type="email"
            label="Email"
          />

          <Input
            isRequired
            color={usernameValidationState === "invalid" ? "danger" : "default"}
            errorMessage={
              usernameValidationState === "invalid" &&
              "Please enter a valid username, (Min: 3, Max: 16)"
            }
            validationState={usernameValidationState}
            id="username"
            value={user.username}
            onChange={(e) =>
              setUser((prevUser) => ({ ...prevUser, username: e.target.value }))
            }
            size="sm"
            variant="faded"
            type="text"
            label="Username"
          />

          <Input
            isRequired
            color={passwordValidationState === "invalid" ? "danger" : "default"}
            errorMessage={
              passwordValidationState === "invalid" &&
              "Please enter a valid password, (Min: 8, Max: 16)"
            }
            validationState={passwordValidationState}
            id="password"
            value={user.password}
            onChange={(e) =>
              setUser((prevUser) => ({ ...prevUser, password: e.target.value }))
            }
            size="sm"
            variant="faded"
            type="password"
            label="Password"
          />
        </div>
        <div className="flex justify-between">
          <Button
            isDisabled={!validateForm()}
            isLoading={loading}
            color={loading ? "primary" : "default"}
            variant="bordered"
            onClick={onSignUp}
          >
            {loading ? "Loading" : "Sign Up"}
          </Button>
          <Link href="/login" underline="always" size="sm">
            Go To Login
          </Link>
        </div>
      </div>
    </div>
  );
}
