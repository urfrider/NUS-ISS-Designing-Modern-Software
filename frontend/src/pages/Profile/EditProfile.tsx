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
  const [username] = useState(user.username);
  const [address, setAddress] = useState(user.address || "");
  const [uen, setUen] = useState(user.uen || "");
  const [role] = useState(user.role || "");

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };

  const onSave = async () => {
    try {
      
      const response =
        role == BUYER
          ? await axios.post(
              `${import.meta.env.VITE_API_URL!}/auth/buyerProfile`,
              {
                id,
                username,
                address,
              },
              config
            )
          : await axios.post(
              `${import.meta.env.VITE_API_URL!}/auth/sellerProfile`,
              {
                id,
                username,
                uen,
              },
              config
            );
      toast.success("Profile updated successfully!");

      const updatedUserData =
        role == BUYER ? { address } : { uen };

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
      <div className="flex flex-col items-center min-h-screen mt-32 gap-4">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <div className="flex flex-col gap-4 w-full max-w-md">
          <label className="text-lg">Username:</label>
          <input
            type="text"
            className="p-2 rounded-md border"
            value={username}
            disabled
            style={{ pointerEvents: 'none' }}
          />

          <label className="text-lg">Role:</label>
          <input type="text" className="p-2 rounded-md border" disabled value={role} style={{ pointerEvents: 'none' }}/>

          {user.role === "ROLE_SELLER" && (
            <>
              <label className="text-lg">UEN:</label>
              <input
                type="text"
                className="p-2 rounded-md border"
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
                className="p-2 rounded-md border"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </>
          )}

          <div className="flex flex-row justify-between">
            <button
              className="w-48 mt-8 border bg-red-500 rounded-md p-2 hover:bg-purple-300 duration-300"
              onClick={() => {navigate("/profile")}}
            >
              Back
            </button>

            <button
              className="w-48 mt-8 border bg-green-500 rounded-md p-2 hover:bg-purple-300 duration-300"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
