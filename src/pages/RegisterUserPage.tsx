import {Link} from "react-router-dom";

export default function RegisterUserPage() {
return (
    <>
      <p>registerUser page</p>

      <Link to="/login">
        <p>Already have a user? Click here!</p>
      </Link>
    </>
  );
}