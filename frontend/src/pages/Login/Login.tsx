import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../Home/Home";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onButtonClick = () => {
    setEmailError("");
    setPasswordError("");

    if (email === "") {
      setEmailError("Please enter your email");
      return;
    }

    if (password === "") {
      setPasswordError("Please enter a password");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be 8 characters or longer");
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (email) {
      return (
        <>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Router>
        </>
      );
    } else {
      return <Navigate to="/Component/Login/Login" />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-800">
      <div className="w-full max-w-sm p-6 bg-black bg-opacity-50 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-8">Login</h2>
        <form>
          <div className="mb-6">
            <input
              type="text"
              value={email}
              placeholder="Enter email address here"
              onChange={(ev) => setEmail(ev.target.value)}
              className="w-full p-2 text-lg text-white bg-transparent border-b border-gray-300 outline-none focus:border-blue-500"
            />
            <label className="text-red-500 text-sm">{emailError}</label>
          </div>
          <div className="mb-6">
            <input
              type="password"
              value={password}
              placeholder="Enter password here"
              onChange={(ev) => setPassword(ev.target.value)}
              className="w-full p-2 text-lg text-white bg-transparent border-b border-gray-300 outline-none focus:border-blue-500"
            />
            <label className="text-red-500 text-sm">{passwordError}</label>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={onButtonClick}
              className="px-6 py-2 text-lg font-bold text-blue-500 uppercase bg-transparent border-2 border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
