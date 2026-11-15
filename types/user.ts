export type UserRole = "USER" | "AGENT" | "ADMIN";

export interface UserItem {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  avatar?: string | null;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}
