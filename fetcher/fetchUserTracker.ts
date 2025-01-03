type Users = {
  id: string;
  roles: string;
  username: string;
};

export async function fetchUserTracker(url: string): Promise<Users[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
}
