import { create } from 'zustand';
import type { Job, JobStatus, JobError } from '@toolbox/shared/types';

interface JobsStore {
  jobs: Record<string, Job>;

  // Actions
  enqueue:     (toolId: string, file: File) => string;
  setProgress: (jobId: string, progress: number) => void;
  setStatus:   (jobId: string, status: JobStatus) => void;
  setDone:     (jobId: string, resultKey: string) => void;
  setError:    (jobId: string, error: JobError) => void;
  remove:      (jobId: string) => void;
  clearTool:   (toolId: string) => void;
  clearAll:    () => void;

  // Selectors
  getByTool:   (toolId: string) => Job[];
  getJob:      (jobId: string) => Job | undefined;
}

export const useJobsStore = create<JobsStore>((set, get) => ({
  jobs: {},

  enqueue(toolId, file) {
    const jobId = crypto.randomUUID();
    const job: Job = {
      jobId,
      toolId,
      filename:  file.name,
      sizeBytes: file.size,
      mimeType:  file.type,
      status:    'queued',
      progress:  0,
      createdAt: Date.now(),
    };
    set(s => ({ jobs: { ...s.jobs, [jobId]: job } }));
    return jobId;
  },

  setProgress(jobId, progress) {
    set(s => ({
      jobs: {
        ...s.jobs,
        [jobId]: { ...s.jobs[jobId]!, status: 'processing', progress },
      },
    }));
  },

  setStatus(jobId, status) {
    set(s => ({
      jobs: {
        ...s.jobs,
        [jobId]: { ...s.jobs[jobId]!, status },
      },
    }));
  },

  setDone(jobId, resultKey) {
    set(s => ({
      jobs: {
        ...s.jobs,
        [jobId]: {
          ...s.jobs[jobId]!,
          status:      'done',
          progress:    100,
          resultKey,
          completedAt: Date.now(),
        },
      },
    }));
  },

  setError(jobId, error) {
    set(s => ({
      jobs: {
        ...s.jobs,
        [jobId]: { ...s.jobs[jobId]!, status: 'error', error },
      },
    }));
  },

  remove(jobId) {
    set(s => {
      const next = { ...s.jobs };
      delete next[jobId];
      return { jobs: next };
    });
  },

  clearTool(toolId) {
    set(s => {
      const next = { ...s.jobs };
      Object.keys(next).forEach(id => {
        if (next[id]!.toolId === toolId) delete next[id];
      });
      return { jobs: next };
    });
  },

  clearAll() {
    set({ jobs: {} });
  },

  getByTool(toolId) {
    return Object.values(get().jobs).filter(j => j.toolId === toolId);
  },

  getJob(jobId) {
    return get().jobs[jobId];
  },
}));
