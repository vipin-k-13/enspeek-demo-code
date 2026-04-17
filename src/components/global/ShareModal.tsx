import { useState, useEffect, useCallback, useRef } from "react";
import Button from "../ui/Button";
import DynamicModel from "./DynamicModel";
import QuestionsInput from "../common/Questionnaire/QuestionsInput";
import EmailPermissionsTable from "../common/list/shareModaltable";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../services/apiService";

interface EmailEntry {
  email: string;
  share: boolean;
  modifyInput: boolean;
  output: boolean;
  initiateSample: boolean;
}

interface ShareStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
  studyName: string;
}
export default function ShareStudyModal({
  isOpen,
  onClose,
  studyName,
}: ShareStudyModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [addedEmails, setAddedEmails] = useState<EmailEntry[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const user = useSelector((state: RootState) => state.user);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useMutation({
    mutationKey: ["lookUp"],
    mutationFn: async (query: string) => {
      const resp = await apiRequest("post", "user/lookup", {
        apiToken: user.apiToken,
        email_address: query,
      });
      return resp.response || [];
    },
  });

  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(async () => {
      try {
        const result = await fetchSuggestions.mutateAsync(inputValue);
        if (Array.isArray(result)) {
          const emailList = result
            .map((item: any) => item.emailAddress)
            .filter(
              (email: string) =>
                email && !addedEmails.some((entry) => entry.email === email)
            );

          setSuggestions(emailList);
        }
      } catch (error) {}
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [inputValue, addedEmails]);

  const addEmail = useCallback((email: string) => {
    setAddedEmails((prev) => [
      ...prev,
      {
        email,
        share: false,
        modifyInput: false,
        output: false,
        initiateSample: false,
      },
    ]);
    setInputValue("");
    setSuggestions([]);
  }, []);

  const toggleCheckbox = useCallback(
    (index: number, field: keyof Omit<EmailEntry, "email">) => {
      setAddedEmails((prev) =>
        prev.map((entry, i) =>
          i === index ? { ...entry, [field]: !entry[field] } : entry
        )
      );
    },
    []
  );

  if (!isOpen) return null;

  return (
    <DynamicModel
      Title={`Share Study: ${studyName}`}
      ButtonText="Share"
      isOpen={isOpen}
      onClick={() => {}}
      onClose={onClose}
      className="max-w-4xl max-h-screen overflow-y-auto"
      footerContent={
        <p className="text-sm text-gray-700">
          * Output shared will be visible to users only when{" "}
          <strong>{studyName}</strong> is initiated for sample collection.
        </p>
      }
    >
      <div className="mb-4">
        <label className="block mb-2">Enter name or email</label>
        <QuestionsInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="eg. abc@ke.com ..."
          lable=""
        />

        {suggestions.length > 0 && (
          <div className="relative">
            <div className="mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-42 overflow-y-auto">
              {suggestions.map((email, index) => (
                <div
                  onClick={() => addEmail(email)}
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-sm text-gray-900">{email}</span>
                  <Button
                    size="sm"
                    onClick={() => addEmail(email)}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-3 py-1 text-xs"
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <EmailPermissionsTable
        addedEmails={addedEmails}
        toggleCheckbox={toggleCheckbox}
      />
    </DynamicModel>
  );
}
