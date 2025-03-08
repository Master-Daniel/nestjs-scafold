import { UserRole } from 'src/entities/user.entity';

export interface IUserData {
  id: string;
  email: string;
  username: string;
  name?: string;
  provider: string;
  providerId: string;
  avatarUrl?: string;
  role: UserRole;
  token: string;
}

export interface IUserRO {
  user: IUserData;
}
