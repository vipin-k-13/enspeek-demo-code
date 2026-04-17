import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserProps } from "../components/common/UserManagement/UserCard";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function searchUsers(users: UserProps[], query: string): UserProps[] {
  const lowerQuery = query.toLowerCase().trim();

  return users.filter((user) =>
    [user.name, user.email, user.role].some((field) =>
      field.toLowerCase().includes(lowerQuery)
    )
  );
}

export const handleCopy = async (Link: string) => {
  await navigator.clipboard.writeText(Link);
  toast.success("Link copied to clipboard!");
};

export const handleLinkClick = (link: string) => {
  window.open(link, "_blank");
};

export const handleKeyPress = (
  e: React.KeyboardEvent,
  callback: (e?: any) => void
) => {
  if (
    e.key === "Enter" &&
    !e.shiftKey &&
    (e.target as HTMLInputElement).value.trim() !== ""
  ) {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLInputElement).blur();
    callback(e);
  }
};

export const ChartResponseReFactor = (Data: SurveyData) => {
  const questionId = Data.seq[0];
  const ChartData = Data[questionId as keyof typeof Data];
  if (!ChartData) return null;
  const isType1 = ChartData._colorder?.length > 0;
  const rowOrder = ChartData._roworder || [];
  const rowOptions = ChartData._rowoptions || {};

  const categories = rowOrder.map((key) => rowOptions[key]);

  if (Boolean(ChartData.external)) {
    return {
      external: ChartData.external,
      categories: [],
      questionId,
      title: ChartData.label,
      chartData: [],
      Image: ChartData.external_link,
      baseText: `Base: (n = ${Data.BASE})`,
      questionText: ChartData.text,
      totalRespondents: Data.BASE,
    };
  }

  let chartData: any[] = [];

  if (isType1) {
    chartData = ChartData._colorder.map((colKey: string) => {
      const data = rowOrder.map((rowKey: string) => {
        return ChartData.data?.[colKey]?.[rowKey] ?? 0;
      });

      return {
        type: "column",
        name: ChartData._coloptions?.[colKey] ?? colKey,
        data,
        color: "#3F72AF",
      };
    });
  } else {
    const seriesData = rowOrder.map((key: string | number) => {
      return ChartData.data?.[key] ?? 0;
    });

    chartData = [
      {
        type: "column",
        name: "response",
        data: seriesData,
        color: "#3F72AF",
      },
    ];
  }

  return {
    external: ChartData.external,
    questionId,
    title: ChartData.label,
    chartData,
    categories,
    baseText: `Base: (n = ${Data.BASE})`,
    questionText: ChartData.text,
    totalRespondents: Data.BASE,
  };
};

export function getTableDataFromSurvey(Data: any) {
  const ChartData = Data[Data.seq[0]];
  if (!ChartData) return null;

  const questionId = Data.seq[0];
  const title = ChartData.label;
  const baseText = `Base: (n = ${Data.BASE})`;
  const questionText = ChartData.text;

  const isColumnType =
    ChartData._colorder &&
    Array.isArray(ChartData._colorder) &&
    ChartData._colorder.length > 0;

  if (!isColumnType) {
    const headers = ["Total"];
    const rows = ChartData._roworder.map((key:any) => ({
      rowLabel: ChartData._rowoptions[key],
      values: [`${ChartData.data[key]}%`],
    }));

    return {
      questionId,
      title,
      baseText,
      questionText,
      headers,
      baseRow: [`${Data.BASE}`],
      rows,
    };
  }

  const headers = ChartData._colorder.map(
    (col:any) => ChartData._coloptions[col] || col
  );

  const rows = ChartData._roworder.map((rowKey:any) => {
    return {
      rowLabel: ChartData._rowoptions[rowKey],
      values: ChartData._colorder.map((colKey:any) => {
        const val = ChartData.data?.[colKey]?.[rowKey] ?? 0;
        return `${val}%`;
      }),
    };
  });

  const baseRow = ChartData._colorder.map(
  (colKey: string) =>
    ChartData.base?.[colKey]?.[ChartData._roworder[0]] ?? 0
);


  return {
    questionId,
    title,
    baseText,
    questionText,
    headers,
    baseRow,
    rows,
  };
}
