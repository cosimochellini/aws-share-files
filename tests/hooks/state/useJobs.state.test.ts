import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useJobs } from '../../../src/hooks/state/useJobs.state';
import { useJobsStore } from '../../../src/store/jobs.store';
import type { ConverterResponse } from '../../../src/types/converter.types';
import { StatusCode } from '../../../src/types/converter.types';

const buildJob = (id: string) => ({
  id,
  status: { code: StatusCode.converting, info: 'working' },
} as ConverterResponse);

const initialState = useJobsStore.getState();

describe('useJobs', () => {
  beforeEach(() => {
    useJobsStore.setState({ ...initialState, jobs: [] }, true);
  });

  it('returns the empty job list from the store', () => {
    const { result } = renderHook(() => useJobs());

    expect(result.current).toEqual({ jobs: [] });
  });

  it('reflects the jobs pushed into the store', () => {
    const jobs = [buildJob('1'), buildJob('2')];

    const { result } = renderHook(() => useJobs());

    act(() => {
      useJobsStore.setState({ jobs });
    });

    expect(result.current.jobs).toEqual(jobs);
  });

  it('reflects a job list set through setJobs', () => {
    const jobs = [buildJob('42')];

    const { result } = renderHook(() => useJobs());

    act(() => {
      useJobsStore.getState().setJobs(jobs);
    });

    expect(result.current.jobs).toBe(jobs);
  });
});
