import { Nullable } from "../types/generic";
import { functions } from "../instances/functions";
import { useLocalStorage } from "./localStorage.hook";
import { useCallback, useEffect, useState } from "react";
import { ConverterResponse, StatusCode } from "../types/converter.types";
import { useS3Folders } from "./state/useS3Folders.state";

let _conversions = null as Nullable<string[]>;
let isSyncing = false;

export const useConversions = () => {
  const [conversions, setConversions] = useLocalStorage("LS_CONVERSIONS", [
    "5a36a817-6667-46cb-85a7-9fca95af1833",
  ] as string[]);

  const { refreshFolders } = useS3Folders();

  _conversions ??= conversions;

  const [jobs, setJobs] = useState([] as ConverterResponse[]);

  const addConversion = (conversion: string) => {
    const newConversions = [...(_conversions ?? []), conversion];

    setConversions(newConversions);
    _conversions = newConversions;
  };

  const removeConversion = (conversion: string) => {
    const newConversions = _conversions?.filter((c) => c !== conversion) ?? [];

    setConversions(newConversions);
    _conversions = newConversions;
  };

  const syncJobs = useCallback(async () => {
    if (!_conversions?.length) return;
    if (isSyncing) return;

    isSyncing = true;

    let insertOrDelete = 0;
    let update = 0;
    for (const job of _conversions) {
      const currentJob = jobs.find((j) => j.id === job);

      if (!currentJob) {
        const newJob = await functions.convert.getConversionStatus(job);
        jobs.push(newJob);
        insertOrDelete++;

        continue;
      }
      if (
        currentJob?.status.code !== StatusCode.completed &&
        currentJob?.status.code !== StatusCode.failed
      ) {
        const updatedJob = await functions.convert.getConversionStatus(job);
        const jobIndex = jobs.findIndex((j) => j.id === job);

        jobs[jobIndex] = updatedJob;

        update++;
        continue;
      }
    }

    const jobsToDelete = jobs.filter((j) => !_conversions?.includes(j.id));

    if (jobsToDelete.length) {
      insertOrDelete++;
    }

    if (insertOrDelete || update) {
      setJobs([...jobs].filter((j) => _conversions?.includes(j.id)));
    }

    if (update) {
      refreshFolders();
    }

    isSyncing = false;
  }, [jobs, refreshFolders]);

  useEffect(() => {
    syncJobs();

    const interval = setInterval(() => syncJobs(), 10_000);

    return () => clearInterval(interval);
  }, [conversions, syncJobs]);

  return {
    jobs,
    addConversion,
    removeConversion,
  };
};
