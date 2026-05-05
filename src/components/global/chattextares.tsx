import * as React from "react";
import { IoMdSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import {
  setChatOpen,
  setIsTyping,
  setMessage,
  setMessages,
} from "../../store/ChatSlice";
import { Tooltip } from "../ui/Tooltip";
import { cn, handleKeyPress } from "../../utils";
import { LuMessageCircle } from "react-icons/lu";
import { useLocation } from "react-router";
import NewDropdown from "./NewDropDown";
import PromptsList from "./PromptsList";
import { CiCircleList } from "react-icons/ci";
import { useChat } from "../common/chat-window/Api";
import Button from "../ui/Button";

interface ChatTextAreaProps {
  placement?: "floating" | "panel";
}

const ChatTextArea: React.FC<ChatTextAreaProps> = ({
  placement = "floating",
}) => {
  const internalTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { message, isTyping, messages, isChatOpen, pending } = useSelector(
    (state: RootState) => state.chat
  );
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const isHome = pathname === "/";
  const isPanelPlacement = placement === "panel";

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setMessage(e.target.value));
  };

  const { Chat } = useChat();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isTyping) {
      const userMessage: any = {
        text: message,
        sender: "user",
      };

      dispatch(setMessages([...messages, userMessage]));
      dispatch(setIsTyping(true));
      Chat({ prompt: message });
      dispatch(setMessage(""));
    }
  };

  const handleOpen = () => {
    dispatch(setChatOpen(true));
  };

  React.useLayoutEffect(() => {
    const textarea = internalTextareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [message]);

  React.useEffect(() => {
    if (isChatOpen && internalTextareaRef.current) {
      internalTextareaRef.current?.focus();
    }
  }, [isChatOpen]);

  React.useEffect(() => {
    if (!isTyping && !pending && internalTextareaRef.current) {
      internalTextareaRef.current?.focus();
    }
  }, [isTyping, pending]);

  return (
    <>
      {!isChatOpen && !isPanelPlacement && (
        <div className="fixed bottom-8 right-8 z-50">
          <Tooltip content="Open Chat" position="left">
            <Button
              onClick={handleOpen}
              varinat="theme"
              size="icon"
              className="h-14 w-14 text-white shadow-lg transition-all duration-300 hover:scale-110"
            >
              <LuMessageCircle className="w-6 h-6" />
            </Button>
          </Tooltip>
        </div>
      )}

      <div
        className={cn(
          "home-surface z-50 flex cursor-text flex-col border home-border-strong transition-all duration-300 ease-in-out",
          isChatOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none",
          isPanelPlacement
            ? "questionnaire-chatbar-panel relative m-4 mt-3 w-auto overflow-hidden rounded-[24px] bg-white"
            : "absolute bottom-4 left-1/2 w-[min(94%,1120px)] -translate-x-1/2 rounded-[26px] shadow-[0_10px_28px_rgba(31,41,55,0.10),0_2px_8px_rgba(31,41,55,0.05)] md:bottom-6",
          !isHome && !isPanelPlacement && "w-[min(92%,820px)]"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 overflow-visible p-3",
            isPanelPlacement && "px-4 py-4 md:px-5"
          )}
          style={{ maxHeight: "400px" }}
        >
          <NewDropdown
            position="top-left"
            searchable
            searchPlaceholder="Search commands..."
            trigger={
              <Tooltip content="Quick Commands" position="top">
                <Button
                  type="button"
                  varinat="ghost"
                  size="icon"
                  className="home-dropdown-icon-wrap h-10 w-10 shrink-0 rounded-full shadow-sm hover:opacity-90"
                >
                  <CiCircleList className="w-5 h-5" />
                </Button>
              </Tooltip>
            }
            items={PromptsList()}
          />
          <textarea
            ref={internalTextareaRef}
            data-test-id="CONVER"
            disabled={isTyping}
            // autoFocus={false}
            rows={1}
            value={message}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyPress(e, handleSubmit)}
            placeholder="Ask me anything..."
            className={cn(
              "home-chat-placeholder home-text min-h-8 w-full resize-none border-0 bg-transparent py-2 pr-2 text-[16px] focus:ring-0 focus-visible:outline-none",
              "min-h-8",
              isPanelPlacement && "text-[15px] md:text-[16px]"
            )}
          />
          <div className="ml-auto flex items-center gap-2">
            <Tooltip content="Send" position="bottom">
              <Button
                type="button"
                varinat="theme"
                size="icon"
                disabled={isTyping}
                data-test-id="SEND"
                onClick={handleSubmit}
                className={cn(
                  "h-11 w-11 border-0 bg-gradient-to-r from-login-primary to-login-bg-end text-sm font-medium transition-all hover:brightness-95 disabled:opacity-75 shadow-[0_10px_24px_rgba(85,90,230,0.28)]",
                  isPanelPlacement && "h-12 w-12 shadow-[0_12px_28px_rgba(85,90,230,0.24)]"
                )}
              >
                {isTyping || pending ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                ) : (
                  <IoMdSend className="h-5 w-5 text-white" />
                )}
                <span className="sr-only">Send message</span>
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatTextArea;
