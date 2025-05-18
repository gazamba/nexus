export interface Client {
  id: string;
  name: string;
}

export type UserRole = "admin" | "client" | "se";

export interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (user: { name: string; email: string; role: UserRole }) => void;
}

export const availableClients: Client[] = [
  { id: "1", name: "Acme Corp" },
  { id: "2", name: "Globex Inc" },
  { id: "3", name: "Initech" },
];
