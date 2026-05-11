import type { Role } from "./Role";
import type UnregisteredUser from "./UnregisteredUser";

export default interface RegisteredUser {
  userId: number;
  unregisteredUser: UnregisteredUser;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: number;
  role: Role;
}
