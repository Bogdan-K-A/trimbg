import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  catalogWP: [],
  subCategories: [],
  filteredSubCategories: [],
  isLoading: false,
};

const processingSlice = createSlice({
  name: "processing",
  initialState,

  reducers: {},
});

export const {} = processingSlice.actions;

export const processingReducer = processingSlice.reducer;
