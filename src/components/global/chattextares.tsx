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

const ChatTextArea = () => {
  const internalTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { message, isTyping, messages, isChatOpen, pending } = useSelector(
    (state: RootState) => state.chat
  );
  // const { hasQuestionnaire } = useSelector((state: RootState) => state.study);
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();

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
      {!isChatOpen && (
        <div className="fixed bottom-8 right-8 z-50">
          <Tooltip content="Open Chat" position="left">
            <button
              onClick={handleOpen}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <LuMessageCircle className="w-6 h-6" />
            </button>
          </Tooltip>
        </div>
      )}

      <div
        className={cn(
          "flex flex-col rounded-[20px] shadow-[0_8px_24px_rgba(79,86,230,0.15)] transition-all duration-300 ease-in-out bg-white border border-[#e6e8f7] cursor-text absolute bottom-4 z-50 w-[86%] max-w-2xl transform left-1/2 -translate-x-1/2",
          isChatOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none",
          // pathname === "/"
          //   ? "left-5/8"
          //   : Boolean(!hasQuestionnaire)
          //   ? "left-[52%]"
          //   : "left-1/2"
        )}
      >
        <div
          className="overflow-y-auto flex items-center gap-2 p-2"
          style={{ maxHeight: "400px" }}
        >
          <NewDropdown
            position="top-left"
            trigger={
              <Tooltip content="Quick Commands" position="top">
                <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-[#5962eb] transition-colors hover:bg-[#e6e9ff] cursor-pointer">
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
            placeholder="Ask something..."
            className={cn(
              "w-full resize-none border-0 bg-transparent p-2 text-foreground placeholder:text-[#b1b5ce] focus:ring-0 focus-visible:outline-none",
              "min-h-8"
            )}
          />
          <div className="ml-auto flex items-center gap-2">
            <Tooltip content="Send" position="bottom">
              <button
                disabled={isTyping}
                data-test-id="SEND"
                onClick={handleSubmit}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-login-primary to-login-bg-end text-sm font-medium transition-all hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:bg-gray-300 cursor-pointer"
              >
                <IoMdSend className="h-5 w-5 text-white" />
                <span className="sr-only">Send message</span>
              </button>
            </Tooltip>
          </div>
        </div>
        <div
          className={cn(
            "rounded-b-[20px] border-t border-[#eceeff] bg-[#fafbff] px-3 py-2",
            pathname === "/" ? "hidden" : "block"
          )}
        >
          <div className="flex items-center gap-3">
            <Suggestion />

            <div className="ml-auto flex items-center gap-2">
              {pathname !== "/" && (
                <Tooltip content="Close" position="top">
                  <button
                    onClick={handleClose}
                    className="flex h-8 items-center gap-2 rounded-full p-2 text-sm text-foreground transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
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
