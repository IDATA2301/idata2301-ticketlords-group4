import {Link} from "react-router-dom";

export default function LoginPage() {
  return (
    <>
      <p>loginpage</p>
      <input type="email" id="email"></input><br></br>
      <input type="password" id="password"></input><br></br>
      <Link to="/user">
        <button>Login</button>
      </Link>

      <Link to="/registerUser">
        <p>Click here to register a new user!</p>
      </Link>

    </>
  );
}