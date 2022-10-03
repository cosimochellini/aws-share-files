import { useJobsStore } from '../../store/jobs.store';

// const state = {
//   insert: false,
//   inserted() {
//     this.insert = true;
//   },

//   update: false,
//   updated() {
//     this.update = true;
//   },

//   delete: false,
//   deleted() {
//     this.delete = true;
//   },

//   get changed() {
//     return this.insert || this.update || this.delete;
//   },

//   clear() {
//     this.insert = false;
//     this.update = false;
//     this.delete = false;
//   },
// };

// const statusToSkip = [
//   StatusCode.completed,
//   StatusCode.failed,
// ] as Nullable<StatusCode>[];

export const useJobs = () => {
  const jobs = useJobsStore((x) => x.jobs);

  return { jobs };
};
