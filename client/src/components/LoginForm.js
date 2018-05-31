import React, { PureComponent } from 'react'
//import PropTypes from 'prop-types'
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

  //static propTypes = {}

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()

    const { email, password } = this.state
    this.props.login(email, password)
    // DO SOMETHING ELSE
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
            value={this.state.email}
            placeholder="Please enter your email"
            onChange={this.handleChange.bind(this)}
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            placeholder="Please enter your password"
            onChange={this.handleChange.bind(this)}
          />
          <button type="submit">Login</button>
          <p>If you don't have an account, please <Link to='/SignUpForm'>sign up</Link>!</p>
        </Form>
      </FormWrapper>
    )
  }
}

const mapStateToProps = ({ currentUser }) => {
  return { currentUser }
}

export default connect(mapStateToProps, { login })(LoginForm)
