export type AuthUser = {
  id: string;
  email: string;
  provider: "email" | "oauth";
};

export async function getCurrentUser(): Promise<AuthUser> {
  return {
    id: "demo-user",
    email: "demo@christianityofchrist.local",
    provider: "email",
  };
}
