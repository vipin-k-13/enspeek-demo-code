import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { setMessage } from "../../store/ChatSlice";
import { LuArchive, LuCalendar, LuCirclePlus, LuFolders, LuSearchCheck } from "react-icons/lu";

const PromptsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  return [
  {
    id: "studies created by [owner name]",
    label: "Studies by Owner",
    icon: <LuFolders className="h-4 w-4" />,
    description: "AI lists all studies from that owner",
    onClick: () => dispatch(setMessage("studies created by [owner name]")),
  },
  {
    id: "count of in progress studies",
    label: "In Progress Count",
    icon: <LuSearchCheck className="h-4 w-4" />,
    description: "AI tells how many studies are in progress",
    onClick: () => dispatch(setMessage("count of in progress studies")),
  },
  {
    id: "give me survey link of [study name]",
    label: "🔗 Survey link",
    onClick: () => dispatch(setMessage("give me survey link of [study name]")),
  },
  {
    id: "studies created on [mm, dd]",
    label: "Studies by Date",
    icon: <LuCalendar className="h-4 w-4" />,
    description: "AI filters studies by creation date",
    onClick: () => dispatch(setMessage("studies created on [mm, dd]")),
  },
  {
    id: "give me archived studies",
    label: "Archived Studies",
    icon: <LuArchive className="h-4 w-4" />,
    description: "AI lists all archived studies",
    onClick: () => dispatch(setMessage("give me archived studies")),
  },
  {
    id: "create [study name]",
    label: "Create Study",
    icon: <LuCirclePlus className="h-4 w-4" />,
    description: "Creates a new study and navigates",
    onClick: () => dispatch(setMessage("create [study name]")),
  },
  {
    id: "go QNR of particular [study name]",
    label: "📄 Go to questionnaire",
    onClick: () => dispatch(setMessage("go QNR of particular [study name]")),
  },
  {
    id: "generate 4 questions related to any topic",
    label: "🧠 Generate questions",
    onClick: () => dispatch(setMessage("generate [number] questions related to [topic]")),
  },
  {
    id: "generate 5 question with 3 open end related to any topic",
    label: "🎯 Questions with specific type",
    onClick: () => dispatch(setMessage("generate [number] questions with [number and question type] related to [topic]")),
  },
  {
    id: "add all questions",
    label: "📥 Add all questions (⚠️ not recommended)",
    onClick: () => dispatch(setMessage("add all questions")),
  },
  {
    id: "add 1,2,3,6 questions",
    label: "🔢 Add selected questions",
    onClick: () => dispatch(setMessage("add [question number] questions")),
  },
  {
    id: "move cq2 to 8",
    label: "🔀 Move question (CQ1 To place of CQ4)",
    onClick: () => dispatch(setMessage("move [question no] to [question no]")),
  },
  {
    id: "move c8 to top or bottom",
    label: "📌 Move question to position",
    onClick: () => dispatch(setMessage("move [question no] to [position example:- top, bottom]")),
  },
  {
    id: "delete cq5 question",
    label: "🗑️ Delete question",
    onClick: () => dispatch(setMessage("delete [question no]")),
  },
  {
    id: "remove 1,2,5 questions",
    label: "❌ Remove multiple questions",
    onClick: () => dispatch(setMessage("remove [question no]")),
  },
  {
    id: "delete all questions",
    label: "🚫 Delete all questions",
    onClick: () => dispatch(setMessage("delete all questions")),
  },
  {
    id: "activate study",
    label: "✅ Activate study",
    onClick: () => dispatch(setMessage("activate study")),
  },
  {
    id: "give me test link",
    label: "🧪 Get test link",
    onClick: () => dispatch(setMessage("give me test link")),
  },
  {
    id: "Download raw table of [study name]",
    label: "📅 Download raw table",
    onClick: () => dispatch(setMessage("Download raw table of [study name]")),
  },
  {
    id: "Download Excel file of [study name]",
    label: "📈 Download Excel",
    onClick: () => dispatch(setMessage("Download Excel file of [study name]")),
  },
  {
    id: "Download PPT of [study name]",
    label: "📊 Download PPT for all questions",
    onClick: () => dispatch(setMessage("Download PPT of [study name]")),
  },
  {
    id: "Download PPT of [qid] in [study name]",
    label: "📊 Download PPT for single question",
    onClick: () => dispatch(setMessage("Download PPT of [qid] in [study name]")),
  },
  {
    id: "Download SPSS file of [study name]",
    label: "📉 Download SPSS file",
    onClick: () => dispatch(setMessage("Download SPSS file of [study name]")),
  },
  {
    id: "Get data of [qid] in [study name]",
    label: "📥 Get data",
    onClick: () => dispatch(setMessage("Get data of [qid] in [study name]")),
  },
  {
    id: "Get count of completed surveys in [study name]",
    label: "✅ Get count of completed surveys",
    onClick: () => dispatch(setMessage("Get count of completed surveys in [study name]")),
  },
  {
    id: "Get count of incompleted surveys in [study name]",
    label: "⏳ Get count of incompleted surveys",
    onClick: () => dispatch(setMessage("Get count of incompleted surveys in [study name]")),
  },
];

};

export default PromptsList;
