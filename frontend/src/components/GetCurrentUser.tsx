export async function getCurrentUser() {
  const res = await fetch("/api/auth/me", {
    credentials: "include",
  });

  if (!res.ok) return null;

  return await res.json();
}