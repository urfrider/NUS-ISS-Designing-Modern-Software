import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  id: number;
  username: string;
  role: string;
  token: string;
  uen: string;
  address: string;

}

const initialState: UserState = {
  id: -1,
  username: "",
  role: "",
  token: "",
  uen: "",
  address: ""
};

const savedUser = localStorage.getItem("users");
const parsedUser = savedUser ? JSON.parse(savedUser) : initialState;

const userSlice = createSlice({
  name: "user",
  initialState: parsedUser,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      const user = action.payload;
      
      if (!user) {
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.uen = action.payload.uen;
      state.address = action.payload.address;
      state.token = action.payload.token;
      
    },
    updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
      const updatedUser = action.payload;
    
      // Update only the fields that are provided
      if (updatedUser.username !== undefined) state.username = updatedUser.username;
      if (updatedUser.address !== undefined) state.address = updatedUser.address;
      if (updatedUser.uen !== undefined) state.uen = updatedUser.uen;
    
      // Update local storage so the changes persist
      localStorage.setItem("user", JSON.stringify(state));
    },
    logout: (state) => {
      localStorage.removeItem("user");
      state.username = "";
      state.role = "";
      state.token = "";
    },
  },
});

export const { login, updateUser, logout } = userSlice.actions;
export default userSlice.reducer;