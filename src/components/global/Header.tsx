import { useEffect, useRef, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { LuChevronDown } from "react-icons/lu";
import { Link } from "react-router";
import ICON from "../../assets/icons/icon.png";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { setMessages } from "../../store/ChatSlice";
import DropDown from "./DropDown";
import Modal from "../ui/Modal";
import { Tooltip } from "../ui/Tooltip";
import { getFullName, getInitials } from "../../utils";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { name } = useSelector((state: RootState) => state.study);
  const { firstName, lastName } = useSelector((state: RootState) => state.user);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const dispatch = useDispatch<AppDispatch>();
  const fullName = getFullName(firstName, lastName) || firstName || "User";
  const initials = getInitials(fullName, "U");

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "RESET_STORE" });
    dispatch(setMessages([]));
    setDropdownOpen(false);
    setLogoutModalOpen(false);
    window.location.href = "/login";
  };

  const DropdownData = [
    {
      Title: "Logout",
      Icon: FaSignOutAlt,
      onClick: () => {
        setDropdownOpen(false);
        setLogoutModalOpen(true);
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
      <div className="flex items-center gap-3">
        <Link to={"/"}>
          <img src={ICON} alt="Enspeek" className="h-11 w-auto" />
        </Link>
        <div className="text-[23px] font-extrabold tracking-[-0.03em] text-login-primary">
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
          {fullName && (
            <span className="home-heading text-[14px] font-semibold capitalize">
              {fullName}
            </span>
          )}
          <Tooltip content={fullName} position="bottom">
            <div
              data-test-id="PROFILE"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-login-primary text-sm font-semibold text-white"
            >
              {initials}
            </div>
          </Tooltip>
          <LuChevronDown className="home-muted" size={18} />
        </div>
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2">
            <DropDown Data={DropdownData} />
          </div>
        )}
      </div>
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        className="max-w-md"
      >
        <div className="p-6">
          <h3 className="home-heading text-[22px] font-bold">Confirm Logout</h3>
          <p className="home-muted mt-3 text-[15px] leading-6">
            Are you sure you want to log out from your Enspeek account?
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setLogoutModalOpen(false)}
              className="report-toolbar-btn rounded-[16px] border home-border px-5 py-2.5 home-heading"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="report-toolbar-btn rounded-[16px] bg-login-primary px-5 py-2.5 text-white hover:bg-login-primary-hover"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
