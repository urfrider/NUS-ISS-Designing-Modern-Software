import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string;
  role: string;
  token: string;
}

const initialState: UserState = {
  username: "",
  role: "",
  token: "",
};

const savedUser = localStorage.getItem("user");
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
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
    logout: (state) => {
      localStorage.removeItem("user");
      state.username = "";
      state.role = "";
      state.token = "";
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
