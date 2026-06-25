import { useCallback } from 'react';
import { useJobsStore } from '../store';

// Each tool page calls this hook with its toolId.
// Returns everything the page needs to manage its job list.

export function useToolJobs(toolId: string) {
  const store = useJobsStore();
  const jobs  = store.getByTool(toolId);

  const enqueue = useCallback((file: File) => {
    return store.enqueue(toolId, file);
  }, [toolId, store]);

  const pendingJobs    = jobs.filter(j => j.status === 'queued');
  const processingJobs = jobs.filter(j => j.status === 'processing');
  const doneJobs       = jobs.filter(j => j.status === 'done');
  const errorJobs      = jobs.filter(j => j.status === 'error');
  const isProcessing   = processingJobs.length > 0;

  return {
    jobs,
    pendingJobs,
    processingJobs,
    doneJobs,
    errorJobs,
    isProcessing,
    enqueue,
    setProgress: store.setProgress,
    setDone:     store.setDone,
    setError:    store.setError,
    remove:      store.remove,
    clearTool:   () => store.clearTool(toolId),
  };
}
