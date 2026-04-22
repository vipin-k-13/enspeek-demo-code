import { useEffect, useRef, useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router";
import ICON from "../../assets/icons/icon.png";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { setMessages } from "../../store/ChatSlice";
import DropDown from "./DropDown";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { name } = useSelector((state: RootState) => state.study);
  const { firstName } = useSelector((state: RootState) => state.user);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "RESET_STORE" });
    dispatch(setMessages([]));
    setDropdownOpen(false);
    window.location.href = "/login";
  };

  const DropdownData = [
    {
      Title: "Logout",
      Icon: FaSignOutAlt,
      onClick: () => {
        handleLogout();
      },
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#e9eaf5] bg-white px-4 py-2 text-2xl">
      <div className="flex items-center">
        <Link to={"/"}>
          <img src={ICON} alt="Insights Curry" className="h-8 w-auto" />
        </Link>
        <div className="ml-2 text-[24px] font-bold text-login-primary">
          Enspeek
        </div>
        {name !== "" && (
          <>
            <div className="text-lg font-medium text-blue-900 mx-3">|</div>
            <div className="font-semibold text-[20px] text-blue-900">
              {name}
            </div>
          </>
        )}
      </div>
      <div className="relative items-center" ref={dropdownRef}>
        <div className="flex items-center gap-2">
          {firstName && (
            <span className="text-sm font-medium text-[#2f3251] capitalize">
              {firstName}
            </span>
          )}
          <FaUserCircle
            data-test-id="PROFILE"
            className="cursor-pointer text-login-primary"
            onClick={toggleDropdown}
            size={28}
          />
        </div>
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2">
            <DropDown Data={DropdownData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
