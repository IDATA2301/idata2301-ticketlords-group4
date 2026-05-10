import type RegisteredUser from "./RegisteredUser";
import type Category from "./Category";

export default interface UserInterest {
  registeredUser: RegisteredUser;
  category: Category;
}
