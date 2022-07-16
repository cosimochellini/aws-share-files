import { functions } from "../../instances/functions";
import { useJobsStore } from "../../store/jobs.store";
import { StatusCode } from "../../types/converter.types";
import { useFolderStore } from "../../store/files.store";
import { useConversionsStore } from "../../store/conversions.store";
import { Nullable } from "../../types/generic";

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

  get changed() {
    return this.insert || this.update || this.delete;
  },

  clear() {
    this.insert = false;
    this.update = false;
    this.delete = false;
  },
};
const statusToSkip = [
  StatusCode.completed,
  StatusCode.failed,
] as Nullable<StatusCode>[];

export const useJobs = () => {
  const jobs = useJobsStore((x) => x.jobs);
  const setJobs = useJobsStore((x) => x.setJobs);
  const conversions = useConversionsStore((x) => x.conversions);
  const refreshFolders = useFolderStore((x) => x.refreshFolders);

  const syncConversions = async () => {
    const mappedConversions = conversions
      .map((conversion) => ({
        conversion,
        job: jobs.find((j) => j.id === conversion),
      }))
      .filter((x) => !statusToSkip.includes(x.job?.status?.code));

    for (const { job, conversion } of mappedConversions) {
      if (!job?.status?.code) {
        jobs.push(await functions.convert.getConversionStatus(conversion));

        state.inserted();
      } else {
        jobs[jobs.findIndex((j) => j.id === conversion)] =
          await functions.convert.getConversionStatus(conversion);

        state.updated();
      }
    }

    if (jobs.some((j) => !conversions.includes(j.id))) state.deleted();

    if (state.changed) setJobs(jobs.filter((j) => conversions.includes(j.id)));

    if (state.update) refreshFolders(false);

    state.clear();
  };

  return { jobs };
};
