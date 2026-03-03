
export interface administrator {
    id: string | null;
    businessName: string;
    username: string;
    pwd: string;
    email: string;
    lastLogin?: Date | null;
  }