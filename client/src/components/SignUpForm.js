import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { register } from '../actions/signup'
import { Redirect } from 'react-router-dom'

const FormWrapper = styled.div`
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
class SignUpForm extends PureComponent {
  state = {}

  handleSubmit = event => {
    event.preventDefault()

    if (this.state.email && this.state.password && this.state.confirmPassword) {
      this.props.register(
        this.state.firstName,
        this.state.lastName,
        this.state.email,
        this.state.password,
        this.state.confirmPassword
      )
    }
  }

  handleChangeName = event => {
    const { name, value } = event.target
    event.target.setCustomValidity('')
    if (!event.target.validity.valid) {
      event.target.setCustomValidity('Please enter your name')
    }
    this.setState({
      [name]: value
    })
  }

  handleChangeLastName = event => {
    const { name, value } = event.target
    event.target.setCustomValidity('')
    if (!event.target.validity.valid) {
      event.target.setCustomValidity('Please enter your Lastname')
    }
    this.setState({
      [name]: value
    })
  }

  handleChangeEmail = event => {
    const { name, value } = event.target
    event.target.setCustomValidity('')
    if (!event.target.validity.valid) {
      event.target.setCustomValidity('Please enter a valid email address')
    }
    this.setState({
      [name]: value
    })
  }

  handleChangePassword = event => {
    const { name, value } = event.target
    event.target.setCustomValidity('')
    if (!event.target.validity.valid) {
      event.target.setCustomValidity(
        'Password must be at least 8 characters long, with at least one letter and one number'
      )
    }
    this.setState({
      [name]: value
    })
  }

  handleChangeConfirm = event => {
    const { name, value } = event.target
    event.target.setCustomValidity('')
    if (!event.target.validity.valid) {
      event.target.setCustomValidity('Please confirm your password')
    }
    this.setState({
      [name]: value
    })
  }

  render() {
    // if (this.props.currentUser) return <Redirect to="/game" />
    if (this.props.registerSuccess) return <Redirect to="/" />

    return (
      <FormWrapper>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <label>User Details:</label>
          <input
            type="firstName"
            name="firstName"
            required="required"
            value={this.state.firstName || ''}
            placeholder="Please enter your name"
            onChange={this.handleChangeName.bind(this)}
          />
          <input
            type="lastName"
            name="lastName"
            required="required"
            value={this.state.lastName || ''}
            placeholder="Please enter your last name"
            onChange={this.handleChangeLastName.bind(this)}
          />
          <input
            type="email"
            name="email"
            required="required"
            pattern="(?!(^[.-].*|[^@]*[.-]@|.*\.{2,}.*)|^.{254}.)([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@)(?!-.*|.*-\.)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,15}"
            value={this.state.email || ''}
            placeholder="Please enter your email"
            onChange={this.handleChangeEmail.bind(this)}
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
            required="required"
            value={this.state.password || ''}
            placeholder="Please enter your password"
            onChange={this.handleChangePassword.bind(this)}
          />
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            required="required"
            value={this.state.confirmPassword || ''}
            placeholder="Please confirm password"
            onChange={this.handleChangeConfirm.bind(this)}
          />
          {this.state.password &&
            this.state.confirmPassword &&
            this.state.password !== this.state.confirmPassword && (
              <p style={{ color: 'red' }}>The passwords do not match!</p>
            )}
          <button type="submit">Sign Up</button>
        </Form>
      </FormWrapper>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    registerSuccess: state.registerSuccess
  }
}

export default connect(mapStateToProps, { register })(SignUpForm)
