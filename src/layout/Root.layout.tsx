import { Outlet, useLocation } from "react-router";
import Header from "../components/global/Header";
import Sidebar from "../components/global/sidebar";
import ChatWindow from "../components/common/chat-window/chat";
import ChatTextArea from "../components/global/chattextares";
import HomeSidebar from "../components/global/HomeSidebar";
import { cn } from "../utils";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const Root_layout = () => {
  const location = useLocation();
  const isHome = location.pathname == "/";
  const { hasQuestionnaire } = useSelector((state: RootState) => state.study);
 const { isAddingQuestion } = useSelector((state: RootState) => state.trigger);
 const { submitItems } = useSelector((state: RootState) => state.question);
 const forceShowChatRoutes = [
  "/report",
  "/crosstab",
  "/publish-survey"
];

const isForceShowChat = forceShowChatRoutes.some(route =>
  location.pathname.startsWith(route)
);
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div
        className={cn(
          "relative flex flex-1 overflow-auto",
          isHome
            ? "flex-col items-stretch md:flex-row"
            : "flex-col items-stretch xl:flex-row xl:items-center"
        )}
      >
        {!isHome ? <Sidebar /> : <HomeSidebar />}
        <div
          className={cn(
            "transition-all duration-300 overflow-hidden",
            isHome ? "h-auto min-h-[60vh] w-full md:h-[92vh]" : "h-[92vh]",
            isHome || Boolean(!isHome && !hasQuestionnaire)
              ? "w-full"
              : "w-full xl:w-[70%]"
          )}
        >
          <Outlet />
          {/* { (!isHome && submitItems.length>0) && <ChatTextArea />} */}
          { (!isHome && (submitItems.length > 0 || isForceShowChat)) && <ChatTextArea />}
        </div>
        {/* {(Boolean(!isHome && hasQuestionnaire) || Boolean(!isHome && isAddingQuestion) )&& ( */}
        {((!isHome && hasQuestionnaire) ||  (!isHome && isAddingQuestion) || (!isHome && isForceShowChat)) && (
          <div className="h-[46vh] w-full border-t home-border xl:h-full xl:w-[30%] xl:border-l xl:border-t-0" id="otherChat">
            <ChatWindow />
          </div>
        )}
      </div>
    </div>
  );
};

export default Root_layout;
