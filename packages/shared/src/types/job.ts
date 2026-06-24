export type JobStatus =
  | 'queued'
  | 'validating'
  | 'processing'
  | 'done'
  | 'error'
  | 'cancelled';

export interface JobError {
  code: string;
  message: string;
}

export interface Job {
  jobId: string;
  toolId: string;
  filename: string;
  sizeBytes: number;
  mimeType: string;
  status: JobStatus;
  progress: number;       // 0–100
  error?: JobError;
  resultKey?: string;     // OPFS path when done
  createdAt: number;      // Date.now()
  completedAt?: number;
}
