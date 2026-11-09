// Shared job types — the "new job" form writes this shape, the manage jobs table reads it.

export type JobOption = {
  value: string;
  label: string;
};

export type JobStatus = "Active" | "Closed";

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

export interface JobFormData extends JobFormFields {
  _id: string;
  ref: string;
  salary: string;
  companyName: string;
  category: string;
  status: JobStatus;
  datePosted: string;
}
