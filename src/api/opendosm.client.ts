const BASE_URL = "https://api.data.gov.my/opendosm";

export async function fetchJSON<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`);

  if (!res.ok) {
    throw new Error(`OpenDOSM error: ${res.status}`);
  }

  return res.json();
}
