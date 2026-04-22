import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { StudyCard } from "./card";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../services/apiService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { cn } from "../../utils";
import { setFilterStudys, setStudys } from "../../store/CrosstabStudySlice";
import Input from "../ui/Input";
import { HiSearch } from "react-icons/hi";
import DeleteModel from "../common/list/DeleteModel";
import ListingCopyModel from "./ListingCopyModal";
import { setMessage } from "../../store/ChatSlice";

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
    setPage(1);
  }, [activeTab, searchTerm]);

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
  const activeCount = Studys.filter((s: any) => !Boolean(s.isarchived)).length;
  const allCount = Studys.length;
  const archivedCount = Studys.filter((s: any) => Boolean(s.isarchived)).length;

  return (
    <div className="h-full w-[25%] border-r border-[#e8e9f5] bg-white px-3 py-3 flex flex-col" ref={sidebarRef}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[24px] font-semibold text-[#2b2d49]">My Studies</p>
      </div>
      <div className="mb-3 grid grid-cols-3 gap-1 rounded-xl bg-[#f5f6ff] p-1 text-sm">
        <button
          className={cn(
            "rounded-lg px-2 py-1.5 text-[13px] transition-colors",
            activeTab === "myactive"
              ? "bg-login-primary text-white font-semibold shadow-sm"
              : "text-[#6f7394] hover:bg-white"
          )}
          onClick={() => setActiveTab("myactive")}
        >
          {`Active (${activeCount})`}
        </button>
        <button
          className={cn(
            "rounded-lg px-2 py-1.5 text-[13px] transition-colors",
            activeTab === "allactive"
              ? "bg-login-primary text-white font-semibold shadow-sm"
              : "text-[#6f7394] hover:bg-white"
          )}
          onClick={() => setActiveTab("allactive")}
        >
          {`All (${allCount})`}
        </button>
        <button
          className={cn(
            "rounded-lg px-2 py-1.5 text-[13px] transition-colors",
            activeTab === "isarchived"
              ? "bg-login-primary text-white font-semibold shadow-sm"
              : "text-[#6f7394] hover:bg-white"
          )}
          onClick={() => setActiveTab("isarchived")}
        >
          {`Archive (${archivedCount})`}
        </button>
      </div>
      <div className="my-2 flex h-10 items-center rounded-xl bg-[#f4f5ff] px-3">
        <HiSearch className="h-4 w-4 text-[#b2b6d1]" />
        <Input
          placeholder="Search studies..."
          className="h-full border-0 bg-transparent px-2 text-sm text-[#7d82a7] placeholder:text-[#b5b8d1] focus:outline-none focus-visible:ring-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex-1 flex flex-col items-center gap-3 w-full pb-2 overflow-y-auto">
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
        <div className="mt-1 flex justify-center items-center gap-2 border-t border-[#ececf8] pt-2">
          <div
            className="flex w-8 items-center justify-center rounded-lg border border-[#dddff0] p-2 text-[#676c93] hover:bg-[#f1f2ff]"
            onClick={() => setPage((prev) => (prev === 1 ? prev : prev - 1))}
          >
            <MdNavigateBefore />
          </div>
          <div className="text-sm text-[#7a7ea2]">{`${page} of ${totalPages}`}</div>
          <div
            className="flex w-8 items-center justify-center rounded-lg border border-[#dddff0] p-2 text-[#676c93] hover:bg-[#f1f2ff]"
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
