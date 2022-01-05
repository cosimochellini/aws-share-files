import { useCallback, useEffect } from "react";
import { useCurrentContext } from "../context.hook";
import { useS3Folders } from "./useS3Folders.state";
import { functions } from "../../instances/functions";
import { useConversions } from "./useConversions.state";
import { StatusCode } from "../../types/converter.types";

const state = {
  insert: false,
  inserted() {
    this.insert = true;
  },

  update: false,
  updated() {
    this.update = true;
  },

  delete: false,
  deleted() {
    this.delete = true;
  },

  clear() {
    this.insert = false;
    this.update = false;
    this.delete = false;
  },
};

let loaded = false;

export const useJobs = () => {
  const { conversions } = useConversions();
  const { refreshFolders } = useS3Folders();
  const { jobs, setJobs } = useCurrentContext();

  const syncConversions = useCallback(async () => {
    for (const job of conversions) {
      const currentJob = jobs.find((j) => j.id === job);
      const statusCode = currentJob?.status?.code;

      switch (statusCode) {
        case null:
        case undefined:
          jobs.push(await functions.convert.getConversionStatus(job));

          state.inserted();

          break;

        case StatusCode.completed:
        case StatusCode.failed:
          break;

        default:
          jobs[jobs.findIndex((j) => j.id === job)] =
            await functions.convert.getConversionStatus(job);

          state.updated();

          break;
      }
    }

    if (jobs.some((j) => !conversions.includes(j.id))) state.deleted();

    if (state.insert || state.delete || state.update)
      setJobs(jobs.filter((j) => conversions.includes(j.id)));

    if (state.update) refreshFolders(false);

    state.clear();
  }, [conversions, jobs, refreshFolders, setJobs]);

  useEffect(() => {
    if (!loaded) {
      syncConversions();
      loaded = true;
    }

    const interval = setInterval(() => syncConversions(), 3000);

    return () => clearInterval(interval);
  }, [syncConversions]);

  return { jobs };
};