// src/App.tsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import ChatLayout from "./layouts/ChatLayout";
import ChatRoom from "./pages/ChatRoom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ChatLayout />
              </PrivateRoute>
            }
          >
            <Route
              index
              element={
                <div className="flex items-center justify-center h-full">
                  Select a chat room
                </div>
              }
            />
            <Route path="room/:roomId" element={<ChatRoom />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
