import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { setMessage } from "../../store/ChatSlice";
import { promptCatalog } from "../../utils/promptCatalog";

const PromptsList = () => {
  const dispatch = useDispatch<AppDispatch>();

  return promptCatalog.map((prompt) => ({
    ...prompt,
    onClick: () => {
      if (prompt.message) {
        dispatch(setMessage(prompt.message));
      }
    },
  }));
};

export default PromptsList;
