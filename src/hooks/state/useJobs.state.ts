import { useCallback, useEffect } from "react";
import { useCurrentContext } from "../context.hook";
import { functions } from "../../instances/functions";
import { StatusCode } from "../../types/converter.types";
import { useFolderStore } from "../../store/files.store";
import { useConversionsStore } from "../../store/conversions.store";

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
  const conversions = useConversionsStore((x) => x.conversions);
  const { jobs, setJobs } = useCurrentContext();
  const refreshFolders = useFolderStore((x) => x.refreshFolders);

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

    const interval = setInterval(
      (function intervalScan() {
        syncConversions();
        return intervalScan; //to call this function immediately
      })(),
      2000
    );

    return () => clearInterval(interval);
  }, [syncConversions]);

  return { jobs };
};
