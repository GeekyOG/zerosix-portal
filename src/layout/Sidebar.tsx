import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { DecodedData } from "../types/DecodedDataType";
import SidebarTab from "./SidebarTab";
import {
  ArrowLeftRight,
  CalendarRange,
  File,
  LayoutGrid,
  LogOutIcon,
  ReceiptText,
  Settings,
  Store,
  UserCheck,
  Users,
} from "lucide-react";
import Button from "../ui/Button";

export const mainMenuOptions = [
  { text: "Overview", url: "/dashboard", icon: <LayoutGrid size={16} /> },
  {
    text: "Brands",
    url: "/dashboard/brands",
    icon: <ArrowLeftRight size={16} />,
  },

  {
    text: "Videos",
    url: "/dashboard/portfolio",
    icon: <Store size={16} />,
  },

  {
    text: "Images",
    url: "/dashboard/images",
    icon: <Store size={16} />,
  },
  ,
  {
    text: "Settings",
    url: "/dashboard/settings",
    icon: <Settings size={16} />,
  },
];

function Sidebar() {
  const [user] = useState(Cookies.get("authToken"));

  const [decodedData, setDecodedData] = useState<DecodedData>();

  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    if (user) {
      setDecodedData(jwtDecode(user));
    }
  }, [decodedData?.roles, user]);

  return (
    <div className=" hidden h-[100vh] w-[280px]  flex-none border-r-[1px] lg:block">
      <div className="fixed bottom-0 top-0 w-[280px] bg-[#282830]">
        <div className="border-b-[1px] px-[28px] pb-[20px] pt-[24px]"></div>

        <div className="border-b-[1px] px-[20px] py-[17px]">
          <div className="flex h-[76px] w-[100%] items-center gap-[8px] rounded-[12px] px-[12px]">
            <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[50%] bg-[#fff]">
              <p className="text-[1.25rem] font-[700] text-[#000]">ZS</p>
            </div>
            <div>
              <p className="text-[0.75rem] font-[500] text-[#fff]">Zerosix</p>
            </div>
          </div>
        </div>
        <div className="border-b-[1px] pb-[10px] text-neutral-100">
          <div className="px-[28px] py-[14px]">
            <p className="text-[0.625rem] font-[700]">MAIN MENU</p>
          </div>
          {mainMenuOptions.map((item: any) => (
            <SidebarTab
              key={item.text}
              item={item.text}
              activeOption={pathname}
              url={item.url}
              icon={item.icon}
            />
          ))}
        </div>

        <div className="absolute bottom-5 ml-[24px] mt-auto text-[#fff]">
          <Button className="flex items-center gap-[10px] bg-transparent">
            <LogOutIcon size={16} />
            <p className="text-[0.813rem] leading-[22.4px]">Logout</p>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
