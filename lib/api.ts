const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7029";

export async function apifetch<T>(endpoint: string, options?: RequestInit) : Promise<T> {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}`}: {}),
            ...options?.headers,
        }
    });

    if (!res.ok) {
  const text = await res.text();
  throw new Error(text || "Something went wrong");
    }

    const text = await res.text();
    if (!text) return null as T;
    return JSON.parse(text) as T;

}