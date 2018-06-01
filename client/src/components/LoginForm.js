import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { login } from '../actions/login'
import { Redirect } from 'react-router-dom'
import {Link} from 'react-router-dom'

const FormWrapper = styled.div`
  /* font-family: 'Merriweather', serif; */
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #336b87;
  > input {
    width: 100%;
    padding: 1rem;
    margin: 1rem;
    border: 1px solid #5bc8ac;
  }
  > button {
    padding: 1rem;
    margin-top: 1rem;
    color: #336b87;
    background-color: #98dbc6;
    font-weight: strong;
    font-size: 1rem;
    border: 1px solid #5bc8ac;
  }
`

class LoginForm extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  handleSubmit(event) {
    event.preventDefault()

    const { email, password } = this.state
    this.props.login(email, password)
  }

  handleChangeEmail = event => {
    const { name, value } = event.target
    event.target.setCustomValidity('')
    if (!event.target.validity.valid) {
      event.target.setCustomValidity(
        'Please enter a valid email address'
      )
    }
    this.setState({
      [name]: value
    })
  }

  handleChangePassword = event => {
    const { name, value } = event.target
    event.target.setCustomValidity('')
    if (!event.target.validity.valid) {
      event.target.setCustomValidity()
    }
    this.setState({
      [name]: value
    })
  }

  render() {
    if (this.props.currentUser) return <Redirect to="/game" />

    return (
      <FormWrapper>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            required="required"
            value={this.state.email}
            placeholder="Please enter your email"
            onChange={this.handleChangeEmail.bind(this)}
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            required="required"
            value={this.state.password}
            placeholder="Please enter your password"
            onChange={this.handleChangePassword.bind(this)}
          />
          <button type="submit">Login</button>
          <p>If you don't have an account, please <Link to='/SignUpForm'>Sign up</Link>!</p>
        </Form>
      </FormWrapper>
    )
  }
}

const mapStateToProps = ({ currentUser }) => {
  return { currentUser }
}

export default connect(mapStateToProps, { login })(LoginForm)
