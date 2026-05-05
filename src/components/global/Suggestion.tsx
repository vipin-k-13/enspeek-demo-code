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
import Button from "../ui/Button";

type SuggestionAction = {
  label: string;
  onClick: () => void;
};

const Suggestion = () => {
  const { pathname } = useLocation();
  const { link, name } = useSelector((state: RootState) => state.study);
  const { messages } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch<AppDispatch>();

  const { Chat } = useChat();

  const handleDirectCall = (prompt: string) => {
    const userMessage: any = {
      text: prompt,
      sender: "user",
    };
    dispatch(setMessages([...messages, userMessage]));
    dispatch(setIsTyping(true));
    Chat({ prompt });
  };

  const renderSuggestionRow = (actions: SuggestionAction[]) => (
    <div className="hidden gap-1 md:flex lg:gap-3">
      {actions.map((action) => (
        <Button
          key={action.label}
          type="button"
          varinat="chip"
          size="xs"
          className="h-7 rounded-lg font-medium"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );

  if (pathname === "/questionnaire") {
    return renderSuggestionRow([
      {
        label: "Create New Question",
        onClick: () => {
          dispatch(setIsAddingQuestion(true));
          dispatch(setQType("text-only"));
          dispatch(setChatOpen(false));
        },
      },
      {
        label: "Generate",
        onClick: () => dispatch(setMessage("Generate questions [subject]")),
      },
      {
        label: "Remove",
        onClick: () => dispatch(setMessage("Delete question [Q.no]")),
      },
      {
        label: "Re-arrange",
        onClick: () => dispatch(setMessage("Move [Q3] to [position/Q4]")),
      },
    ]);
  }

  if (pathname === "/publish-survey") {
    const actions: SuggestionAction[] = [];

    if (!link) {
      actions.push({
        label: "Activate",
        onClick: () => dispatch(setMessage("Activate study")),
      });
    }

    actions.push(
      {
        label: "Survey Link",
        onClick: () => handleDirectCall("Give survey link"),
      },
      {
        label: "Test Link",
        onClick: () => handleDirectCall("Give me test link"),
      }
    );

    return renderSuggestionRow(actions);
  }

  if (pathname === "/report") {
    return renderSuggestionRow([
      {
        label: "Download PPT",
        onClick: () => dispatch(setMessage("Download PPT")),
      },
      {
        label: "Download Excel",
        onClick: () => dispatch(setMessage("Download Excel")),
      },
      {
        label: "Download SPSS",
        onClick: () => dispatch(setMessage("Download SPSS")),
      },
      {
        label: "Download Table",
        onClick: () => dispatch(setMessage("Download table raw data")),
      },
      {
        label: "Get Data",
        onClick: () => dispatch(setMessage("Get data of [Qid]")),
      },
    ]);
  }

  if (!pathname.split("/")[1]) {
    return renderSuggestionRow([
      {
        label: "Create Study",
        onClick: () => dispatch(setMessage("create study [study name]")),
      },
      {
        label: "Archived Study Count",
        onClick: () => handleDirectCall("archived study count"),
      },
      {
        label: "Total Study",
        onClick: () => handleDirectCall("total study"),
      },
    ]);
  }

  return renderSuggestionRow([
    {
      label: "Archived Study Count",
      onClick: () => handleDirectCall("archived study count"),
    },
    {
      label: "Study Info",
      onClick: () => handleDirectCall(`study info ${name}`),
    },
    {
      label: "Total Study",
      onClick: () => handleDirectCall("total study"),
    },
  ]);
};

export default Suggestion;
