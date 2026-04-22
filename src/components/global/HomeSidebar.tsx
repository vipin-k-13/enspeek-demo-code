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
  const activeCount =
    studyList?.count?.active ??
    Studys.filter((s: any) => !Boolean(s.isarchived)).length;
  const archivedCount =
    studyList?.count?.archived ??
    Studys.filter((s: any) => Boolean(s.isarchived)).length;
  const allCount = studyList?.count
    ? (studyList.count.active || 0) +
      (studyList.count.archived || 0) +
      (studyList.count.shared || 0)
    : Studys.length;

  return (
    <div className="home-surface flex w-full shrink-0 flex-col border-r home-border md:h-full md:w-[320px]" ref={sidebarRef}>
      <div className="border-b home-border-soft px-4 py-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="home-heading text-[18px] font-semibold">My Studies</p>
        </div>
        <div className="home-panel-bg grid grid-cols-3 gap-1 rounded-[18px] p-1 text-sm">
        <button
          className={cn(
            "rounded-[14px] px-2 py-2 text-[13px] transition-colors",
            activeTab === "myactive"
              ? "bg-login-primary text-white font-semibold shadow-sm"
              : "home-muted hover:bg-white"
          )}
          onClick={() => setActiveTab("myactive")}
        >
          {`Active (${activeCount})`}
        </button>
        <button
          className={cn(
            "rounded-[14px] px-2 py-2 text-[13px] transition-colors",
            activeTab === "allactive"
              ? "bg-login-primary text-white font-semibold shadow-sm"
              : "home-muted hover:bg-white"
          )}
          onClick={() => setActiveTab("allactive")}
        >
          {`All (${allCount})`}
        </button>
        <button
          className={cn(
            "rounded-[14px] px-2 py-2 text-[13px] transition-colors",
            activeTab === "isarchived"
              ? "bg-login-primary text-white font-semibold shadow-sm"
              : "home-muted hover:bg-white"
          )}
          onClick={() => setActiveTab("isarchived")}
        >
          {`Archive (${archivedCount})`}
        </button>
      </div>
      </div>
      <div className="px-4 py-4">
      <div className="home-search-bg flex h-10 items-center rounded-[18px] px-3">
        <HiSearch className="home-muted h-4 w-4" />
        <Input
          placeholder="Search studies..."
          className="home-text h-full border-0 bg-transparent px-2 text-sm home-chat-placeholder focus:outline-none focus-visible:ring-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      </div>
      <div className="max-h-[40vh] flex-1 overflow-y-auto px-4 pb-3 md:max-h-none">
      <div className="flex w-full flex-col items-center gap-3">
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
              status={item.studystate}
              owner={item.createdbyname}
              createAt={item.createdon}
              share={item?.isOwner ? item.isOwner : 0}
              isArchived={item.isarchived}
              launch={item.launch}
              studystate={item.studystate}
            />
          ))
        ) : (
          <h4 className="mt-8">No Study Found</h4>
        )}
      </div>
      </div>
      {totalPages > 1 && (
        <div className="mx-4 mt-1 flex items-center justify-center gap-2 border-t home-border-soft pt-3">
          <div
            className="home-muted flex w-8 cursor-pointer items-center justify-center rounded-lg border home-border p-2 hover:bg-home-panel"
            onClick={() => setPage((prev) => (prev === 1 ? prev : prev - 1))}
          >
            <MdNavigateBefore />
          </div>
          <div className="home-muted text-sm">{`${page} of ${totalPages}`}</div>
          <div
            className="home-muted flex w-8 cursor-pointer items-center justify-center rounded-lg border home-border p-2 hover:bg-home-panel"
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
