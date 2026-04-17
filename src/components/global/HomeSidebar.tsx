import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { StudyCard } from "./card";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../services/apiService";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { cn } from "../../utils";
import NewDropdown from "./NewDropDown";
import { setFilterStudys, setStudys } from "../../store/CrosstabStudySlice";
import Input from "../ui/Input";
import { HiSearch } from "react-icons/hi";
import DeleteModel from "../common/list/DeleteModel";
import ListingCopyModel from "./ListingCopyModal";

const HomeSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "myactive" | "allactive" | "isarchived"
  >("myactive");
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const { apiToken } = useSelector((state: RootState) => state.user);
  const { Studys, FilterStudys } = useSelector(
    (state: RootState) => state.study
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const dispatch = useDispatch<AppDispatch>();
  const { data: studyList = {}, isLoading: isListLoading } = useQuery({
    queryKey: ["studyList", activeTab],
    queryFn: async () => {
      try {
        const res = await apiRequest("post", "study/listing", {
          apiToken: apiToken,
          selection: activeTab,
          page: 1,
        });
        dispatch(setStudys(res.response.data));
        dispatch(setFilterStudys(res.response.data));
        return res.response;
      } catch (error: any) {
        console.log(error.message);
      }
    },
    enabled: !!apiToken,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filtered = searchTerm.trim()
        ? Studys.filter((banner) =>
            banner.studyname.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : Studys;

      dispatch(setFilterStudys(filtered));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, Studys, dispatch]);

  useEffect(() => {
    const calculateLimit = () => {
      if (!sidebarRef.current) return;

      const sidebarHeight = sidebarRef.current.offsetHeight;

      const headerHeight = 120; // title + search
      const paginationHeight = 60;
      const availableHeight = sidebarHeight - headerHeight - paginationHeight;

      const singleCardHeight = 90; // approx height of StudyCard

      const newLimit = Math.max(
        1,
        Math.floor(availableHeight / singleCardHeight)
      );

      setLimit(newLimit);
    };

    calculateLimit();

    window.addEventListener("resize", calculateLimit);

    return () => window.removeEventListener("resize", calculateLimit);
  }, []);

  const start = (page - 1) * limit;
  const currentItems = FilterStudys?.slice(start, start + limit) ?? [];

  const totalPages = FilterStudys ? Math.ceil(FilterStudys.length / limit) : 0;
  const dropdownItems = [
    {
      id: "myactive",
      label: "My Active",
      onClick: () => setActiveTab("myactive"),
    },
    {
      id: "allactive",
      label: "All Active",
      onClick: () => setActiveTab("allactive"),
    },
    {
      id: "isarchived",
      label: "Is Archived",
      onClick: () => setActiveTab("isarchived"),
    },
  ].filter((item) => item.id !== activeTab);

  return (
    <div className="h-full w-[25%] px-4 py-2 relative" ref={sidebarRef}>
      <div className="flex items-center justify-between mb-2">
        <span>{`${
          activeTab === "myactive"
            ? "My Active"
            : activeTab === "allactive"
            ? "All Active"
            : "Archived"
        } Studies (${
          studyList && studyList.data ? studyList.data.length : 0
        })`}</span>
        <NewDropdown
          trigger={
            <div
              data-test-id="MORE_ACTIONS"
              className="peer/menu-button flex w-8 items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-gray-200 hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
            >
              <HiOutlineDotsVertical />
            </div>
          }
          items={dropdownItems}
        />
      </div>
      <div className="my-2 flex items-center border border-gray-200 rounded-lg px-1">
        <Input
          placeholder="Search study..."
          className="focus:outline-none border-0 bg-white focus-visible:ring-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <HiSearch className="h-5 w-5" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 w-full pb-4">
        {isListLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <AiOutlineLoading3Quarters
              size={24}
              className={cn("animate-spin text-action")}
            />
          </div>
        ) : studyList && studyList.data && studyList.data.length ? (
          currentItems.map((item: any) => (
            <StudyCard
              key={item.studyid}
              id={item.studyid}
              name={item.studyname}
              status={item.studyState}
              owner={item.createdbyname}
              createAt={item.createdon}
              share={item?.isOwner ? item.isOwner : 0}
              isArchived={item.isarchived}
              launch={item.launch}
            />
          ))
        ) : (
          <h4 className="mt-8">No Study Found</h4>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-end items-center absolute bottom-2 right-2 gap-2">
          <div
            className="peer/menu-button flex w-8 items-center gap-2 overflow-hidden border border-gray-200 rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-gray-200 hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
            onClick={() => setPage((prev) => (prev === 1 ? prev : prev - 1))}
          >
            <MdNavigateBefore />
          </div>
          <div>{`${page} of ${totalPages}`}</div>
          <div
            className="peer/menu-button flex w-8 items-center gap-2 overflow-hidden border border-gray-200 rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-gray-200 hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
            onClick={() =>
              setPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
          >
            <MdNavigateNext />
          </div>
        </div>
      )}
      <DeleteModel />
      <ListingCopyModel />
    </div>
  );
};

export default HomeSidebar;
