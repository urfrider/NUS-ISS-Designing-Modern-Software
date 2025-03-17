import { useState } from "react";
import { RootState } from "../../redux/store";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { BUYER } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../redux/userSlice";

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const [id] = useState(user.id);
  const [username, setUsername] = useState(user.username);
  const [address, setAddress] = useState(user.address || "");
  const [uen, setUen] = useState(user.uen || "");
  const [role] = useState(user.role || "");

  const onSave = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      const response =
        role == BUYER
          ? await axios.post(
              `${import.meta.env.VITE_API_URL!}/auth/buyerProfile`,
              {
                id,
                username,
                address,
              },config
            )
          : await axios.post(
              `${import.meta.env.VITE_API_URL!}/auth/sellerProfile`,
              {
                id,
                username,
                uen,
              },config
            );
      toast.success("Profile updated successfully!")
      
      const updatedUserData =
      role == BUYER
        ? { username, address }
        : { username, uen };
      
      dispatch(updateUser(updatedUserData));
      navigate("/profile");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleSave = () => {
    onSave();
  };

  console.log(user);

  return (
    <div>
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <div className="flex flex-col gap-2 w-full max-w-md">
          <label className="text-lg">Username:</label>
          <input
            type="text"
            className="p-2 border border-purple-300 rounded-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {user.role === "ROLE_SELLER" && (
            <>
              <label className="text-lg">UEN:</label>
              <input
                type="text"
                className="p-2 border border-purple-300 rounded-full"
                value={uen}
                onChange={(e) => setUen(e.target.value)}
              />
            </>
          )}

          {user.role === "ROLE_BUYER" && (
            <>
              <label className="text-lg">Address:</label>
              <input
                type="text"
                className="p-2 border border-purple-300 rounded-full"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </>
          )}

          <button
            className="w-48 border bg-white border-purple-300 rounded-full p-2 hover:bg-purple-300 duration-300"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
