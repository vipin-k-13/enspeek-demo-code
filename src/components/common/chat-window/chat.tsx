import React, { useEffect, useState } from "react";
import TypingIndicator from "./typing-indicator";
import Question_Format from "./Question-format";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { setMessages } from "../../../store/ChatSlice";
import { useLocation } from "react-router";
import { cn } from "../../../utils";
import { FaChartBar, FaCopy, FaExpandArrowsAlt, FaTable } from "react-icons/fa";
import SingleSelectChart from "../Report/Charts";
import TableForm from "../Report/TableForm";
import QuestionCard from "../Report/QuestionCard";
import TableAndChartModal from "../Report/TableAndChartModal";
import TableModal from "../Crosstab/TableModal";
import { toast } from "sonner";

const ChatWindow: React.FC = () => {
  const { messages, isTyping, pending } = useSelector(
    (state: RootState) => state.chat
  );
  const { firstName, lastName } = useSelector((state: RootState) => state.user);
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const CHAT_HISTORY_KEY = "chat_history";
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const hasLoadedFromStorage = React.useRef(false);
  const [selectedChart, setSelectedChart] = React.useState<number | null>(null);
  const [isChartModalOpen, setIsChartModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<{
    [key: number]: "chart" | "table";
  }>({});
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [selectedCrosstab, setSelectedCrosstab] = useState<number | null>(null);
  const [isCrosstabModalOpen, setIsCrosstabModalOpen] = useState(false);
  useEffect(() => {
    const defaultTabs: { [key: number]: "chart" | "table" } = {};
    messages.forEach((_, i) => {
      defaultTabs[i] = "chart";
    });
    setActiveTab(defaultTabs);
  }, [messages]);

  React.useEffect(() => {
    if (!hasLoadedFromStorage.current) {
      const chat = localStorage.getItem(CHAT_HISTORY_KEY);
      if (chat) {
        dispatch(setMessages(JSON.parse(chat)));
      }
      hasLoadedFromStorage.current = true;
    }
  }, []);

  React.useEffect(() => {
    if (hasLoadedFromStorage.current) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="h-full w-full max-w-full z-50">
      <div
        className={cn(
          " overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 p-4",
          pathname === "/" ? "h-[71vh]" : "h-[73vh]"
        )}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            data-test-id={`${msg.sender}-${index}`}
            className={`mb-5 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={
                msg.sdata || msg.crosstab
                  ? ""
                  : `inline-block px-3 py-1.5 text-sm rounded-lg shadow text-left ${
                      msg.sender === "user"
                        ? "bg-gray-200/60 text-black rounded-br-none max-w-[80%]"
                        : "text-black border border-gray-100 rounded-bl-none focus:outline-none max-w-full"
                    }`
              }
            >
              {" "}
              {(!msg.questions || msg.questions.add) && !msg.sdata && (
                <div
                  className="break-words"
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              )}
              {Array.isArray(msg.questions) &&
                msg.questions.length === 0 &&
                !msg.sdata && (
                  <div
                    className="break-words"
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                )}
              {msg.questions && !msg.questions.add && (
                <Question_Format
                  questions={msg.questions.questions}
                  instruction={msg.instruction}
                />
              )}
              {Array.isArray(msg.response) ? (
                <ul className="list-disc px-6">
                  {msg.response.map((item: any) => (
                    <li key={item.studyID}>{item.studyName}</li>
                  ))}
                </ul>
              ) : (
                typeof msg.response === "object" && (
                  <div className="mt-2">
                    {Object.keys(msg.response).map((key, index) => (
                      <p className="mt-1 break-words" key={index}>
                        <strong>{key}:</strong>{" "}
                        <span className="text-gray-500">
                          {msg.response[key]}
                        </span>
                      </p>
                    ))}
                  </div>
                )
              )}
              {msg.type === "surveydata" &&
                (() => {
                  const sdata = msg.sdata;
                  if (
                    !sdata ||
                    !Array.isArray(sdata.seq) ||
                    sdata.seq.length === 0
                  )
                    return null;

                  const qid = sdata.seq[0];
                  const questionData = {
                    ...sdata[qid],
                    base: sdata.BASE,
                    base_text: sdata.BASE_TEXT,
                  };
                  if (!qid || !questionData) return null;

                  const isChart = activeTab[index] === "chart";
                  const isTable = activeTab[index] === "table";

                  const isCrosstab =
                    typeof Object.values(questionData.data || {})[0] ===
                    "object";

                  const chartData = isCrosstab
                    ? questionData._colorder.map((colId: any) => ({
                        name: questionData._coloptions?.[colId] ?? colId,
                        color: "#3F72AF",
                        data: questionData._roworder.map((rowId: any) => {
                          return {
                            name: questionData._rowoptions?.[rowId],
                            y: questionData.data?.[colId]?.[rowId] ?? 0,
                          };
                        }),
                      }))
                    : [
                        {
                          name: "Responses",
                          color: "#3F72AF",
                          data: questionData._roworder.map((rowId: any) => ({
                            name: questionData._rowoptions?.[rowId],
                            y: questionData.data?.[rowId] ?? 0,
                          })),
                        },
                      ];

                  const categories = questionData._roworder?.map(
                    (rowId: any) => questionData._rowoptions?.[rowId]
                  );

                  const headers = !isCrosstab
                    ? ["Total"]
                    : (questionData._colorder || []).map(
                        (colId: string) =>
                          questionData._coloptions?.[colId] ?? colId
                      );

                  const rows = (questionData._roworder || []).map(
                    (rowId: string) => {
                      const rowLabel =
                        questionData._rowoptions?.[rowId] || rowId;
                      const values = !isCrosstab
                        ? [`${questionData.data?.[rowId] ?? 0}%`]
                        : (questionData._colorder || []).map(
                            (colId: string) =>
                              `${questionData.data?.[colId]?.[rowId] ?? 0}%`
                          );
                      return {
                        rowLabel,
                        values,
                      };
                    }
                  );

                  const baseRow = !isCrosstab
                    ? [questionData.base ?? 0]
                    : (questionData._colorder || []).map((colId: string) => {
                        const val =
                          questionData.base?.[colId] ??
                          questionData.responding_base?.[colId]?.[
                            questionData._roworder?.[0]
                          ];
                        return val ?? 0;
                      });
                  const baseText = (() => {
                    if (
                      typeof questionData.base_text === "string" &&
                      questionData.base_text.trim()
                    ) {
                      return questionData.base_text;
                    }

                    if (typeof questionData.base === "number") {
                      return `Base: (n = ${questionData.base})`;
                    }

                    return "Base: (n = 0)";
                  })();

                  return (
                    <div className="w-full mt-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex space-x-2">
                          <button
                            className={`text-sm px-3 py-1 cursor-pointer rounded-md border ${
                              isChart
                                ? "bg-primary text-white"
                                : "bg-white text-gray-600 border-gray-300"
                            }`}
                            onClick={() =>
                              setActiveTab((prev) => ({
                                ...prev,
                                [index]: "chart",
                              }))
                            }
                          >
                            <FaChartBar />
                          </button>
                          {!(
                            questionData.external === 1 &&
                            questionData.external_link
                          ) && (
                            <button
                              className={`text-sm px-3 py-2 cursor-pointer rounded-md border ${
                                isTable
                                  ? "bg-primary text-white"
                                  : "bg-white text-gray-600 border-gray-300"
                              }`}
                              onClick={() =>
                                setActiveTab((prev) => ({
                                  ...prev,
                                  [index]: "table",
                                }))
                              }
                            >
                              <FaTable />
                            </button>
                          )}
                        </div>

                        {(isChart || isTable) && (
                          <button
                            onClick={() => {
                              if (isChart) {
                                setSelectedChart(index);
                                setIsChartModalOpen(true);
                              } else {
                                setSelectedTable(index);
                                setIsTableModalOpen(true);
                              }
                            }}
                            className="cursor-pointer text-xl text-gray-400"
                          >
                            <FaExpandArrowsAlt />
                          </button>
                        )}
                      </div>

                      {isChart ? (
                        <QuestionCard
                          title={questionData.label}
                          qId={qid}
                          studyID={msg.studyID}
                        >
                          {questionData.external === 1 &&
                          questionData.external_link ? (
                            <div className="w-full">
                              <img
                                src={questionData.external_link}
                                alt={questionData.label}
                                className="w-full max-w-xl justify-center"
                              />
                            </div>
                          ) : (
                            <SingleSelectChart
                              hasData={!!questionData.data}
                              chartData={chartData}
                              categories={categories}
                              baseText={baseText}
                              questionText={questionData.text || ""}
                              totalRespondents={questionData.base ?? 1}
                              questionId={qid}
                            />
                          )}
                        </QuestionCard>
                      ) : (
                        <TableForm
                          questionId={qid}
                          title={questionData.label}
                          baseText={baseText}
                          questionText={questionData.text || ""}
                          headers={headers}
                          baseRow={baseRow}
                          rows={rows}
                          studyID={msg.studyID}
                        />
                      )}
                    </div>
                  );
                })()}
              <>
                {msg.liveLink && (
                  <div className="flex items-center gap-2">
                    <a
                      href={msg.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      🔗 Click to view survey
                    </a>

                    <button
                      onClick={() => {
                        if (msg.liveLink) {
                          navigator.clipboard.writeText(msg.liveLink);
                        }
                        toast.success("Survey link copied to clipboard!");
                      }}
                      className="text-gray-400 hover:text-gray-700 cursor-pointer"
                      title="Copy survey link"
                    >
                      <FaCopy />
                    </button>
                  </div>
                )}
              </>
            </div>
            {msg.sender === "user" ? (
              <p className="text-[10px] mt-1 text-right">{`${firstName} ${lastName}`}</p>
            ) : (
              <p className="text-[10px] mt-1">AI Assistant</p>
            )}
          </div>
        ))}

        {(isTyping || pending) && (
          <TypingIndicator
            size="md"
            dotColor="bg-primary/60"
            textColor="text-gray-600"
          />
        )}

        {messages.length === 0 && !isTyping && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
            <div className="text-4xl">💬</div>
            <div className="text-center">
              <p className="font-medium">No messages yet</p>
              <p className="text-sm">Start a conversation with AI!</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {isChartModalOpen && selectedChart !== null && (
        <TableAndChartModal
          isOpen={isChartModalOpen}
          onClose={() => {
            setIsChartModalOpen(false);
            setSelectedChart(null);
          }}
          message={messages[selectedChart]}
          type="chart"
        />
      )}

      {isTableModalOpen && selectedTable !== null && (
        <TableAndChartModal
          isOpen={isTableModalOpen}
          onClose={() => {
            setIsTableModalOpen(false);
            setSelectedTable(null);
          }}
          message={messages[selectedTable]}
          type="table"
        />
      )}

      {isCrosstabModalOpen && selectedCrosstab !== null && (
        <TableModal
          isOpen={isCrosstabModalOpen}
          onClose={() => {
            setIsCrosstabModalOpen(false);
            setSelectedCrosstab(null);
          }}
          message={messages[selectedCrosstab]}
        />
      )}
    </div>
  );
};

export default ChatWindow;
