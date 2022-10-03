import create from 'zustand';

import { ConverterResponse } from '../types/converter.types';

interface JobsState {
  jobs: ConverterResponse[];
  setJobs: (jobs: ConverterResponse[]) => void;
}

export const useJobsStore = create<JobsState>((set) => ({
  jobs: [],

  setJobs: (jobs: ConverterResponse[]) => set({ jobs }),
}));
