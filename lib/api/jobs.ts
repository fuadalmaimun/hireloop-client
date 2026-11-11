import { JobFormData } from "../types/job";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const getJobs = async (query = ''): Promise<JobFormData[]> => {
    const response = await fetch(`${BASE_URL}/jobs?${query}`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
        },
    });
    if (!response.ok) return [];
    return response.json();
};

export const getDetailsPage = async (Id: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${Id}`)
  const job = await res.json()
  return job
}