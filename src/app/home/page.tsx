"use client";
import axios from "axios";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Badge,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { toast } from "react-hot-toast/headless";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    username: "",
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

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("logout sucesfull");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const goToProfile = () => {
    router.push("/i");
  };

  useEffect(() => {
    getUserDetails(); // Call the function when the component mounts or updates
  }, []);

  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">Starlab RPL</p>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <Badge
            content="5"
            color="danger"
            size="lg"
            placement="bottom-left"
            variant="faded"
          >
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                radius="sm"
                className="transition-transform"
                color="default"
                name={user.username}
                size="sm"
                src=""
              />
            </DropdownTrigger>
          </Badge>
          <DropdownMenu aria-label="Profile Actions" variant="faded">
            <DropdownItem
              key="profile"
              className="h-14 gap-2"
              color="default"
              onClick={goToProfile}
            >
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user.email}</p>
            </DropdownItem>

            <DropdownItem key="logout" color="danger" onClick={logout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
