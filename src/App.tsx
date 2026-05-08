import { RouterProvider } from "react-router"
import Router from "./routes/Router"
import { Toaster } from 'sonner';
import { QueryClient } from "@tanstack/react-query";
import { TooltipLayer } from "./components/ui/Tooltip";

export const queryClient = new QueryClient();

function App() {

  return (
    <>
    <RouterProvider router={Router} />
    <TooltipLayer />
    <Toaster position="bottom-right" richColors />
    </>
  )
}

export default App
