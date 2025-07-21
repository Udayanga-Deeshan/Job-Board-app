import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Job } from "@/types";

interface JobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    fetchJobsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchJobsSuccess(state, action: PayloadAction<Job[]>) {
      state.jobs = action.payload;
      state.loading = false;
    },
    fetchJobsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addJob(state, action: PayloadAction<Job>) {
      state.jobs.unshift(action.payload);
    },
  },
});

export const { fetchJobsStart, fetchJobsSuccess, fetchJobsFailure, addJob } = jobsSlice.actions;
export default jobsSlice.reducer;