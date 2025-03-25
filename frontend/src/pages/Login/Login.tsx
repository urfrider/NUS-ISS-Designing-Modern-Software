import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { BUYER, SELLER } from "../../constants/constants";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [uen, setUen] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [uenError, setUenError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState(BUYER);

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
  };

  const onRegister = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL!}/auth/addNewUser`,
        role === BUYER
          ? {
              username,
              password,
              role,
              address,
            }
          : {
              username,
              password,
              role,
              uen,
            }
      );

      toast.success(response.data);
      const user = await onLogin();

      dispatch(login(user));
      navigate("/home");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const onLogin = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL!}/auth/generateToken`,
        { username, password }
      );
      console.log("response", response);
      return response.data;
    } catch (e) {
      console.log("Login error", e);
    }
  };

  const onButtonClick = async () => {
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setAddressError("");
    setUen("");

    if (isRegister && password != confirmPassword) {
      setConfirmPasswordError("Passwords do not match!");
      return;
    }
    if (username === "") {
      setUsernameError("Please enter your username");
      return;
    }

    if (password === "") {
      setPasswordError("Please enter a password");
      return;
    }
    if (password.length < 5) {
      setPasswordError("Password must be 5 characters or longer");
      return;
    }

    if (username === "") {
      setUsernameError("Please enter a username");
      return;
    }

    if (isRegister && address === "" && role === BUYER) {
      setAddressError("Please enter your address");
      return;
    }

    if (isRegister && uen === "" && role === SELLER) {
      setUenError("Please enter your UEN");
      return;
    }

    if (isRegister) {
      await onRegister();
    } else {
      const user = await onLogin();

      console.log(user);

      dispatch(login(user));
      navigate("/home");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-6 bg-black bg-opacity-50 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-[#7342DC] mb-8">
          Welcome to Moly Market!
        </h2>
        <form>
          {isRegister ? (
            <>
              <div className="mb-6">
                <input
                  type="text"
                  value={username}
                  placeholder="Username"
                  onChange={(ev) => setUsername(ev.target.value)}
                  className="w-full p-2 text-lg text-white bg-transparent border-b border-gray-300 outline-none focus:border-blue-500"
                />
                <label className="text-red-500 text-sm">{usernameError}</label>
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={(ev) => setPassword(ev.target.value)}
                  className="w-full p-2 text-lg text-white bg-transparent border-b border-gray-300 outline-none focus:border-blue-500"
                />
                <label className="text-red-500 text-sm">{passwordError}</label>
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  onChange={(ev) => setConfirmPassword(ev.target.value)}
                  className="w-full p-2 text-lg text-white bg-transparent border-b border-gray-300 outline-none focus:border-blue-500"
                />
                <label className="text-red-500 text-sm">
                  {confirmPasswordError}
                </label>
              </div>

              <div className="mb-6">
                <div>
                  <input
                    type="text"
                    value={role === BUYER ? address : uen}
                    placeholder={role === BUYER ? "Address" : "UEN"}
                    onChange={(ev) =>
                      role === BUYER
                        ? setAddress(ev.target.value)
                        : setUen(ev.target.value)
                    }
                    className="w-full p-2 text-lg text-white bg-transparent border-b border-gray-300 outline-none focus:border-blue-500"
                  />
                  <label className="text-red-500 text-sm">
                    {role === BUYER ? addressError : uenError}
                  </label>
                </div>
              </div>

              <div className="mb-2 text-white">
                <div className="mb-2">Role</div>
                <div className="flex gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value={BUYER}
                      checked={role === BUYER}
                      onChange={handleRoleChange}
                    />
                    Buyer
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value={SELLER}
                      checked={role === SELLER}
                      onChange={handleRoleChange}
                    />
                    Seller
                  </label>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <input
                  type="text"
                  value={username}
                  placeholder="Username"
                  onChange={(ev) => setUsername(ev.target.value)}
                  className="w-full p-2 text-lg text-white bg-transparent border-b border-gray-300 outline-none focus:border-blue-500"
                />
                <label className="text-red-500 text-sm">{usernameError}</label>
              </div>
              <div className="mb-2">
                <input
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={(ev) => setPassword(ev.target.value)}
                  className="w-full p-2 text-lg text-white bg-transparent border-b border-gray-300 outline-none focus:border-blue-500"
                />
                <label className="text-red-500 text-sm">{passwordError}</label>
              </div>
            </>
          )}
          <div className="flex gap-2 text-white mb-4">
            <span className="text-sm">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account yet?"}
            </span>
            <span
              onClick={() => {
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                setUsernameError("");
                setPasswordError("");
                setConfirmPasswordError("");
                setIsRegister((prev) => !prev);
              }}
              className="text-sm text-[#7342DC] font-semibold hover:opacity-70 cursor-pointer"
            >
              {isRegister ? "Go to login" : "Register here"}
            </span>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={onButtonClick}
              className="px-6 py-2 text-lg font-bold text-[#7342DC] uppercase bg-transparent border-2 border-[#7342DC] rounded-md hover:bg-[#7342DC] hover:text-white transition duration-300"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
