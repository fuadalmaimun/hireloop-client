import { JobFormData } from "../types/job";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const getJobs = async (): Promise<JobFormData[]> => {
    const response = await fetch(`${BASE_URL}/jobs`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
        },
    });
    return response.json();
};