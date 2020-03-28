import { UserRole } from './user.entity';

export interface JwtPayload {
  username: string;
  roles: UserRole[];
}
