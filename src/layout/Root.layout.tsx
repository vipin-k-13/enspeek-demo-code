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
      <div className="flex flex-1 overflow-auto items-center relative">
        {!isHome ? <Sidebar /> : <HomeSidebar />}
        <div
          className={cn(
            `p-2 transition-all duration-300 h-[92vh] overflow-hidden `,
            (isHome || Boolean(!isHome && !hasQuestionnaire)) ? "w-[100%]" : "w-[70%]"
          )}
        >
          <Outlet />
          {/* { (!isHome && submitItems.length>0) && <ChatTextArea />} */}
          { (!isHome && (submitItems.length > 0 || isForceShowChat)) && <ChatTextArea />}
        </div>
        {/* {(Boolean(!isHome && hasQuestionnaire) || Boolean(!isHome && isAddingQuestion) )&& ( */}
        {((!isHome && hasQuestionnaire) ||  (!isHome && isAddingQuestion) || (!isHome && isForceShowChat)) && (
          <div className="w-[30%] h-full" id="otherChat">
            <ChatWindow />
          </div>
        )}
      </div>
    </div>
  );
};

export default Root_layout;