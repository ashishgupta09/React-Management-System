import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  )
}

export default App;

