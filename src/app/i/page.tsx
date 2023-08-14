"use client";
import { Button, Chip, Divider, User, Link } from "@nextui-org/react";
import axios from "axios";
import React from "react";

export default function MePage() {
  const [user, setUser] = React.useState({
    email: "",
    username: "",
    isVerified: false,
  });

  const getUserDetails = async () => {
    try {
      const response = await axios.get("/api/users/info");
      console.log(response.data);
      setUser(response.data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  React.useEffect(() => {
    getUserDetails(); // Call the function when the component mounts or updates
    console.log(user.isVerified);
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-zinc-900 rounded-lg shadow-md p-8 space-y-6 max-w-md w-full">
        <div className="flex justify-between">
          <User
            name={user.username}
            description={user.email}
            avatarProps={{
              name: user.username,
              src: "",
            }}
          />
          <Chip
            color={user.isVerified ? "success" : "danger"}
            variant="flat"
            size="sm"
          >
            {user.isVerified ? "Verified" : "Unverified"}
          </Chip>
        </div>
        <Divider className="my-4" />
        <div className="flex justify-between">
          {!user.isVerified && (
            <Button color="success" radius="sm" variant="flat">
              VERIFY ACCOUNT
            </Button>
          )}
          <Link href="/" underline="always" size="sm">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
