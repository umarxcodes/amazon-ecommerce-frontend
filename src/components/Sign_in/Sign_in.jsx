import './Sign-in.css'
import Button from '../Button/Button'
import { NavLink } from 'react-router-dom'

export default function Sign() {
  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2 className="signin-title">See personalized recommendations</h2>
        <NavLink to="/Login">
          <Button className="signin-button">Sign in</Button>
        </NavLink>
        <p className="signin-text">
          New customer?{' '}
          <NavLink to="/Registration" className="signin-link">
            Start here.
          </NavLink>
        </p>
      </div>
    </div>
  )
}
