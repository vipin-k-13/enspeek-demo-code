 export const getPageName = (path: string): string => {
    if (path.includes("questionnaire")) {
      return "qnr";
    } else if (path.includes("publish-survey")) {
      return "svry";
    } else if (path.includes("/")) {
      return "db";
    } else if (path.includes("create")) {
      return "crt";
    }
  
    return '';
  }

 