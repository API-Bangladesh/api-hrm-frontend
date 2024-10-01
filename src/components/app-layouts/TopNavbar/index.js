"use client";

import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Burger, Avatar, Indicator } from "@mantine/core";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Dropdown from "react-bootstrap/Dropdown";
import { useSidebar } from "@/components/contexts/SidebarContext";
import { logout } from "../../../lib/auth";
import { getFullName, getStoragePath } from "@/lib/helper";
import { authTokenKey, authUserKey } from "../../../lib/config";
import Link from "next/link";
import Image from "next/image";
import Logo from "public/logo.png";
import profileImg from "public/default-profile.png";
import { useUser } from "@/components/contexts/UserContext";

const Navbar = () => {
  // const { logout } = useAuth();
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const res = await logout();

      if (res) {
        // localStorage.removeItem("user");
        Cookies.remove(authUserKey);
        Cookies.remove(authTokenKey);
      }

      // Redirect to the login page or any other desired page
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const [opened, { toggle }] = useDisclosure();

  const { toggleSidebar } = useSidebar();

  return (
    <div className="topbar d-flex">
      <div className="logoBox">
        <div className="toggle ms-3 forPhone">
          <Burger
            classNames={{
              burger: "toggleIcon",
            }}
            opened={opened}
            // onClick={toggle}
            onClick={() => {
              toggle();
              toggleSidebar();
            }}
            aria-label="Toggle navigation"
          />
        </div>
        <Link
          href="/dashboard"
          className="main_logo text-decoration-none d-flex justify-content-start align-items-center"
        >
          <Image src={Logo} className="logo" alt="logo" />
        </Link>
      </div>

      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="toggle ms-3 forDesktop">
          <Burger
            classNames={{
              burger: "toggleIcon",
            }}
            opened={opened}
            // onClick={toggle}
            onClick={() => {
              toggle();
              toggleSidebar();
            }}
            aria-label="Toggle navigation"
          />
        </div>
        <div className="profileBox">
          <Dropdown>
            <Dropdown.Toggle className="border-0 me-4 d-flex align-items-center">
              <Indicator
                // inline
                withBorder
                size={12}
                // processing
                offset={5}
                position="bottom-end"
                color="green"
              >
                <Image
                  className="profile_img"
                  // src={profileImg}
                  src={user?.photo ? getStoragePath(user?.photo) : profileImg}
                  alt="Picture"
                />
              </Indicator>
              <span className="ms-2">
                {getFullName(user?.first_name, user?.last_name)}
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="profile_item rounded-1">
              <Dropdown.Item>
                <Link
                  className="text-decoration-none text-reset"
                  href={`/profile/${userId}`}
                >
                  My Profile
                </Link>
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={(e) => handleLogout(e)}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
