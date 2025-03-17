import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/userSlice";
import { BUYER, SELLER } from "../../constants/constants";

function Profile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout(user));
    navigate("/");
  };

  const onEditProfile = () => {
    navigate("/editProfile");
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <h2 className="text-xl">Username: {user.username}</h2>
        <h2 className="text-xl">Role: {user.role}</h2>
        {user.role === SELLER && (
          <h2 className="text-xl">UEN: {user.uen}</h2>
        )}
        {user.role === BUYER && (
          <h2 className="text-xl">Address: {user.address}</h2>
        )}
        <button
          className="w-48 border bg-white border-purple-300 rounded-full p-2 hover:bg-purple-300 duration-300"
          onClick={onEditProfile}
        >
          Edit Profile
        </button>
        <button
          className="w-48 border bg-white border-purple-300 rounded-full p-2 hover:bg-purple-300 duration-300"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
