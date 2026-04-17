import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import type { AppDispatch, RootState } from "../../store/store";
import { setIsAddingQuestion, setQType } from "../../store/TriggerSlice";
import {
  setChatOpen,
  setIsTyping,
  setMessage,
  setMessages,
} from "../../store/ChatSlice";
import { useChat } from "../common/chat-window/Api";

const Suggestion = () => {
  const { pathname } = useLocation();
  const { link, name } = useSelector((state: RootState) => state.study);
  const { messages } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch<AppDispatch>();

  const { Chat } = useChat();

  const HandleDirectCall = (e: string) => {
    const userMessage: any = {
      text: e,
      sender: "user",
    };
    dispatch(setMessages([...messages, userMessage]));
    dispatch(setIsTyping(true));
    Chat({ prompt: e });
  };

  if (pathname === "/questionnaire") {
    return (
      <div className="hidden md:flex gap-1 lg:gap-3">
        <button
          onClick={() => {
            dispatch(setIsAddingQuestion(true));
            dispatch(setQType("text-only"));
            dispatch(setChatOpen(false));
          }}
          className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
        >
         ✏️ Create New Question
        </button>
        <button
          onClick={() => dispatch(setMessage("Generate questions [subject]"))}
          className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
        >
         ⚙️ Generate
        </button>
        <button
          onClick={() => dispatch(setMessage("Delete question [Q.no]"))}
          className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
        >
         🗑️ Remove
        </button>
        <button
          onClick={() => dispatch(setMessage("Move [Q3] to [position/Q4]"))}
          className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
        >
        🔀 Re-arrange
        </button>
      </div>
    );
  }

  if (pathname === "/publish-survey") {
    return (
      <div className="hidden md:flex gap-1 lg:gap-3">
        {!link && (
          <button
            onClick={() => dispatch(setMessage("Activate study"))}
            className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
          >
            ✅ Activate
          </button>
        )}
        <button
          onClick={() => HandleDirectCall("Give survey link")}
          className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
        >
         🔗 Survey Link
        </button>
        <button
          onClick={() => HandleDirectCall("Give me test link")}
          className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
        >
        🧪 Test Link
        </button>
      </div>
    );
  }

  if (pathname === "/report") {
    return (
      <div className="hidden md:flex gap-1 lg:gap-3">
           <button
          onClick={() => dispatch(setMessage("Download PPT"))}
          className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
        >
        📊 Download PPT
        </button>
        <button
          onClick={() => dispatch(setMessage("Download Excel"))}
          className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
        >
        📈 Download Excel
        </button>
        <button
          onClick={() => dispatch(setMessage("Download SPSS"))}
          className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
        >
       📉 Download SPSS
        </button>
        <button
          onClick={() => dispatch(setMessage("Download table raw data"))}
          className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
        >
       📅 Download Table
        </button>
        <button
          onClick={() => dispatch(setMessage("Get data of [Qid]"))}
          className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
        >
        📥 Get Data
        </button>
      </div>
    );
  }

  if (!pathname.split("/")[1]) {
    return (
      <div className="hidden md:flex gap-1 lg:gap-3">
        <button
          onClick={() => dispatch(setMessage("create study [study name]"))}
          className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
        >
         ➕ Create Study
        </button>
        <button
          onClick={() => HandleDirectCall("archived study count")}
          className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
        >
         📦 Archived Study Count
        </button>
        <button
          onClick={() => HandleDirectCall("total study")}
          className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
        >
         📊 Total Study
        </button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex gap-1 lg:gap-3">
      <button
        onClick={() => HandleDirectCall("archived study count")}
        className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
      >
       📦 Archived Study Count
      </button>
      <button
        onClick={() => HandleDirectCall(`study info ${name}`)}
        className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
      >
        📋 Study Info
      </button>
      <button
        onClick={() => HandleDirectCall("total study")}
        className="flex h-7 items-center gap-2 rounded-lg px-2 py-0.5 text-[10px] border border-gray-400 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring cursor-pointer"
      >
       📊 Total Study
      </button>
    </div>
  );
};

export default Suggestion;
