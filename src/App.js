import "./App.css";
import Login from "./pages/Login";
import Products from "./pages/Products";
import { useSelector } from "react-redux";
function App() {
  const user = useSelector((state) => state.user.user);
  return (
    <div className="bg-gray-600 h-[100vh] text-white">
      {user ? <Products /> : <Login />}
    </div>
  );
}

export default App;
