import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;

