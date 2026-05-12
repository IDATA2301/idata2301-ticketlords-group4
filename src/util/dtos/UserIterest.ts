import type RegisteredUser from "./RegisteredUser";
import type Category from "./Category";

export default interface UserInterest {
  id: number;
  user: RegisteredUser;
  category: Category;
  clicketAt: Date;
}
