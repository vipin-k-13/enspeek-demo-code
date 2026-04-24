import * as React from "react";
import { IoMdSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
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
import Suggestion from "./Suggestion";
import { useChat } from "../common/chat-window/Api";

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

  const handleClose = () => {
    dispatch(setChatOpen(false));
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
            <button
              onClick={handleOpen}
              className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <LuMessageCircle className="w-6 h-6" />
            </button>
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
            : "absolute bottom-6 left-1/2 w-[min(75%,980px)] -translate-x-1/2 rounded-[26px] shadow-xl",
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
                <button className="home-dropdown-icon-wrap flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:opacity-90 cursor-pointer shadow-sm">
                  <CiCircleList className="w-5 h-5" />
                </button>
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
              <button
                disabled={isTyping}
                data-test-id="SEND"
                onClick={handleSubmit}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-login-primary to-login-bg-end text-sm font-medium transition-all hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-75 cursor-pointer shadow-[0_10px_24px_rgba(85,90,230,0.28)]",
                  isPanelPlacement && "h-12 w-12 shadow-[0_12px_28px_rgba(85,90,230,0.24)]"
                )}
              >
                {isTyping || pending ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                ) : (
                  <IoMdSend className="h-5 w-5 text-white" />
                )}
                <span className="sr-only">Send message</span>
              </button>
            </Tooltip>
          </div>
        </div>
        <div
          className={cn(
            "home-panel-soft-bg rounded-b-[26px] border-t home-border-soft px-4 py-2.5",
            isHome && !isPanelPlacement ? "hidden" : "block",
            isPanelPlacement && "rounded-b-[24px] border-t bg-[var(--color-surface-softest)] px-4 py-3 md:px-5"
          )}
        >
          <div className="flex items-center gap-3">
            <Suggestion />

            <div className="ml-auto flex items-center gap-2">
              {pathname !== "/" && !isPanelPlacement && (
                <Tooltip content="Close" position="top">
                  <button
                    onClick={handleClose}
                    className="flex h-8 cursor-pointer items-center gap-2 rounded-full p-2 text-sm text-foreground transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-ring"
                  >
                    <IoMdClose className="w-4 h-4" />
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatTextArea;
