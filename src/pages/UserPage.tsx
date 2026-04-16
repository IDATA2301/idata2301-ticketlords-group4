import "../css/UserPage.css"

export default function UserPage() {
return (
  <>
    <p>Edit the user</p>
    <label htmlFor="email">Email: </label>
    <input type="email" id="email"></input><br/>

    <label htmlFor="password">Password: </label>
    <input type="password" id="password"></input><br/>

    <label htmlFor="repeatPassword">Repeat password: </label>
    <input type="password" id="repeatPassword"></input><br/>

    <br/>

    <label htmlFor="displayName">Display Name: </label>
    <input type="text" id="displayName"></input><br/>

    <label htmlFor="firstName">First Name: </label>
    <input type="text" id="firstName"></input><br/>

    <label htmlFor="lastName">Last Name: </label>
    <input type="text" id="lastName"></input><br/>

    <br/>

    <button id="submitChanges">Submit changes</button>
    
  </>
);
}