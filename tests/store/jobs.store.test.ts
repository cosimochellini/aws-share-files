import { beforeEach, describe, expect, it } from 'vitest';

import { useJobsStore } from '../../src/store/jobs.store';
import type { ConverterResponse } from '../../src/types/converter.types';
import { StatusCode } from '../../src/types/converter.types';

const initialState = useJobsStore.getState();

const buildJob = (id: string) => ({
  id,
  status: { code: StatusCode.completed, info: 'done' },
} as ConverterResponse);

describe('jobs.store', () => {
  beforeEach(() => {
    useJobsStore.setState({ ...initialState, jobs: [] }, true);
  });

  it('starts with no jobs', () => {
    expect(useJobsStore.getState().jobs).toEqual([]);
  });

  it('replaces the jobs with setJobs', () => {
    const { setJobs } = useJobsStore.getState();

    const first = [buildJob('1'), buildJob('2')];

    setJobs(first);

    expect(useJobsStore.getState().jobs).toEqual(first);

    const second = [buildJob('3')];

    setJobs(second);

    expect(useJobsStore.getState().jobs).toEqual(second);
    expect(useJobsStore.getState().jobs).toHaveLength(1);
  });

  it('can be emptied again', () => {
    const { setJobs } = useJobsStore.getState();

    setJobs([buildJob('1')]);
    setJobs([]);

    expect(useJobsStore.getState().jobs).toEqual([]);
  });
});
