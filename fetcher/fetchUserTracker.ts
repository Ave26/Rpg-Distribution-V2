type Users = {
  id: string;
  roles: string;
  username: string;
};

export async function fetchUserTracker(url: string): Promise<Users[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
