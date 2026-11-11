// Shared job-application types — the "Apply" button writes this shape, the
// seeker "My Applications" table (/dashboard/seeker/applications) reads it.
// Fields follow the requirements spec columns: Job Title, Company,
// Date Applied, Status — plus the applicant identity that scopes each row.

export type ApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Rejected"
  | "Offered";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Offered",
];

/** One submitted application, as stored in the `applications` collection. */
export interface Application {
  _id: string;

  /** The applied job — kept denormalized so the table renders without joins. */
  jobId: string;
  jobRef: string;
  jobTitle: string;
  companyName: string;
  location: string;

  /** The seeker who applied (better-auth user id + snapshot). */
  applicantId: string;
  applicantName: string;
  applicantEmail: string;

  /** Optional extras collected during apply. */
  resumeUrl: string;
  coverLetter: string;

  status: ApplicationStatus;

  /** ISO date (yyyy-mm-dd) — set server-side when the application is created. */
  dateApplied: string;
}

/** Payload the client sends when applying — the server owns the rest. */
export interface ApplicationInput {
  jobId: string;
  jobRef: string;
  jobTitle: string;
  companyName: string;
  location: string;

  applicantId: string;
  applicantName: string;
  applicantEmail: string;

  resumeUrl?: string;
  coverLetter?: string;
}
