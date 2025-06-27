// src/components/Navbar.jsx
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "./../context/LanguageContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Navbar({ className }) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const userName = userData?.user?.first_name+ " " + userData?.user?.last_name || userData?.user?.full_name || "";
  const userInitials = userName
    ? userName.split(" ").slice(0, 2).map((word) => word[0]).join("")
    : "AD";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className={`w-full h-20 flex items-center justify-between px-6 font-cairo ${className}`}>
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-white shadow-md hover:shadow-lg transition-shadow duration-200"> 
        <SidebarTrigger className="text-bg-primary hover:bg-teal-50 rounded-md" />
        </div>
        <div className="flex items-center gap-2 text-bg-primary font-semibold text-lg">
          {/* <Avatar className="w-8 h-8 bg-bg-primary text-white font-bold">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar> */}
         Hello {userName || "Admin"}
        </div>
        </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-bg-primary font-bold hover:bg-bg-primary hover:text-bg-tertiary flex items-center gap-2"
        >
          <LogOut className="w-4 h-4 font-bold" />
          Logout
        </Button>
      </div>
    </header>
  );
}