import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { resetQuestionGroup } from "../../../store/QuestionSlice";
import Error from "../../global/Error";
import Button from "../../ui/Button";
import { cn } from "../../../utils";
import { TypewriterDescription } from "../../global/TypeWriterDescription";
import { description } from "../../../utils/descriptions";
import ChatWindow from "../chat-window/chat";
import { setIsTyping, setMessage, setMessages } from "../../../store/ChatSlice";
import { useChat } from "../chat-window/Api";
import ChatTextArea from "../../global/chattextares";

export default function ProjectListing() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(resetQuestionGroup());
  }, []);

  const user = useSelector((state: RootState) => state.user);

  const { error: infoError } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const res = await apiRequest("post", "user/info", {
        apiToken: user.apiToken,
      });
      const userInfo = res.response;
      return userInfo;
    },
    enabled: !!user.apiToken,
    refetchOnWindowFocus: false,
    retry: 1,
  });

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

  const { messages } = useSelector((state: RootState) => state.chat);


  if (infoError) {
    return <Error />;
  }

  return (
    <div className="w-full h-full bg-background p-4 flex justify-center relative">
      {messages.length > 0 ? (
        <div className="w-full md:max-w-2xl">
          <ChatWindow />
        </div>
      ) : (
        <div
          className={cn(
            "w-full md:max-w-4xl flex flex-col gap-10 transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "transition-all duration-300 ease-in-out text-center"
            )}
          >
            <p className="text-center text-3xl text-foreground">
              Welcome to Enspeek
            </p>
            <TypewriterDescription
              descriptions={description}
              className="text-gray-500 mt-3"
            />
          </div>
          <div
            className={cn(
              "transition-all duration-300 ease-in-out"
            )}
          >
            <div className="w-full flex flex-col md:flex-row items-center gap-4 justify-center">
              <Button
                varinat={"outline"}
                data-test-id="CREATE"
                onClick={() =>
                  dispatch(setMessage("create study [study name]"))
                }
                className="h-12 w-[14rem] bg-white text-black"
              >
                <span>Create Study</span>
              </Button>
              <Button
                varinat={"outline"}
                onClick={() => HandleDirectCall("archived study count")}
                className="h-12 w-[14rem] bg-white text-black"
              >
                Archived Study Count
              </Button>
            </div>
            <div
              className={cn(
                "flex flex-col md:flex-row items-center gap-4 justify-center mt-3"
                
              )}
            >
              <Button
                varinat={"outline"}
                onClick={() => dispatch(setMessage("study info [study name]"))}
                className="h-12 w-[14rem] bg-white text-black"
              >
                Study Info
              </Button>
              <Button
                varinat={"outline"}
                onClick={() => HandleDirectCall("total study")}
                className="h-12 w-[14rem] bg-white text-black"
              >
                Total Study
              </Button>
            </div>
          </div>
        </div>
      )}
      <ChatTextArea/>
    </div>
  );
}
