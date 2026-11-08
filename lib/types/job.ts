// Shared job types — the "new job" form writes this shape, the manage jobs table reads it.

export type JobOption = {
  value: string;
  label: string;
};

/** Fields captured by the "Post a new job" form (dashboard/recruiter/job/new). */
export interface JobFormFields {
  jobTitle: string;
  location: string;
  jobDescription: string;
  jobType: string;
  workplaceType: string;
  experienceLevel: string;
  skills: string;
  openings: string;
  salaryMin: string;
  salaryMax: string;
  salaryPeriod: string;
  applicationDeadline: string;
}

/** A stored job post — form fields + metadata shown in the Manage Jobs table. */
export interface JobFormData extends JobFormFields {
  /** Human-friendly reference shown under the title, e.g. "HL-90210". */
  ref: string;
  companyName: string;
  /** Company/Categories tag, e.g. "Design", "Engineering". */
  category: string;
  /** "Active" | "Closed" */
  status: "Active" | "Closed";
  /** ISO date string (e.g. "2025-10-24"), the posted date. */
  datePosted: string;
}
