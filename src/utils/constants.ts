export enum JOB_TYPES {
    SCHEDULER = "scheduler",
    THREAD = "thread"
}

export enum MESSAGE_TYPES {
    DEFAULT = "default",
    OTHER = "other"
}

export enum Status {
  COMPLETED = 200,
  IN_QUEUE = 201,
  IN_PROGRESS = 202,
  CANCELLED = 499,
  FAILED = 500,
  NOT_FOUND = 404
}

export const STATUS_LABEL: Record<Status, string> = {
  [Status.COMPLETED]: 'Completed',
  [Status.IN_QUEUE]: 'In Queue',
  [Status.IN_PROGRESS]: 'In Progress',
  [Status.CANCELLED]: 'Cancelled',
  [Status.FAILED]: 'Failed',
  [Status.NOT_FOUND]: 'Not Found'
};