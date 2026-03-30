const JOB_TYPES = {
    SCHEDULER: "scheduler",
    THREAD: "thread"
}

const STATUS_MAP = {
    200: 'Completed',
    201: 'In Queue',
    202: 'In Progress',
    499: 'Cancelled',
    500: 'Failed'
};

export {
    JOB_TYPES,
    STATUS_MAP
}