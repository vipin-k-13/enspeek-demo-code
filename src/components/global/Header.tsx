import { useEffect, useRef, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { LuChevronDown } from "react-icons/lu";
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
    <div className="home-surface sticky top-0 z-40 flex h-[62px] items-center justify-between border-b home-border px-6">
      <div className="flex items-center gap-2">
        <Link to={"/"}>
          <img src={ICON} alt="Enspeek" className="h-9 w-auto" />
        </Link>
        <div className="text-[18px] font-semibold text-login-primary">
          Enspeek
        </div>
        {name !== "" && (
          <>
            <div className="home-muted mx-2 text-sm font-medium">|</div>
            <div className="home-heading max-w-[340px] truncate text-[16px] font-semibold">
              {name}
            </div>
          </>
        )}
      </div>
      <div className="relative flex items-center" ref={dropdownRef}>
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={toggleDropdown}
        >
          {firstName && (
            <span className="home-heading text-[14px] font-semibold capitalize">
              {firstName}
            </span>
          )}
          <div
            data-test-id="PROFILE"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-login-primary text-sm font-semibold text-white"
          >
            {(firstName || "U").slice(0, 2).toUpperCase()}
          </div>
          <LuChevronDown className="home-muted" size={18} />
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
