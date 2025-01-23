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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.username = "";
      state.role = "";
      state.token = "";
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
