// ===*Css*===
import "./Login.css"
// ===*NavLink*===
import {NavLink} from "react-router-dom"


// ===*components*===
import Button from "../Button/Button";

// ===* Login*===
export default function Login(){
const currentDate=new Date().getFullYear();
    return (
        <>
           <form className="loginForm">
      <img
        src="https://www.amazon.com/favicon.ico"
        alt="Amazon Logo"
        className="amazonLogo"
      />

      <h5 className="ctAccount">Sign In</h5>
      <label for="email">Email</label>
      <input type="email" id="email" placeholder="Enter Your Email" required />
      
      <label for="name">Your Password</label>
      <input type="password" id="password" placeholder="First and last name" required />


      <Button className="login-btn">Continue</Button>

      <div className="conditions">
        By creating an account, you agree to Amazon's
        <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
      </div>

      <h6 className="message"></h6>
      <div className="divider">Already have an account?</div>


<NavLink to={'/Registration'}>
  <span>Register</span>
</NavLink>
    </form>

    <footer>
      <a href="#">Conditions of Use</a>
      <a href="#">Privacy Notice</a>
      <a href="#">Help</a>
      <br /><br />
      © 1996-{currentDate}, Amazon.com, Inc. or its affiliates
    </footer>
        
        </>
    )
}