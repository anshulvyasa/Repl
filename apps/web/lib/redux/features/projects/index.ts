import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayGround {
  id: string;
  title: string;
  description: string;
  template: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: User;
  starmark: { isMarked: boolean }[];
}

const initialState: PlayGround[] = [];

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addAllProjects(state, action: PayloadAction<PlayGround[]>) {
      return action.payload;
    }
  },
});

export const { addAllProjects } = projectSlice.actions; // exporting the buttons actions    
export default projectSlice.reducer;  // exporting the reducer to be used in the store
