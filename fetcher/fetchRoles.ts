type UserRole = {
  id: string;
  role: string;
};

export async function fetchRoles(url: string): Promise<UserRole[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
