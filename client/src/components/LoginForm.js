import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { login } from '../actions/login'
import { Redirect } from 'react-router-dom'

const Form = styled.div`
  font-family: 'Merriweather', serif;
  padding: 1rem;
`

const Input = styled.input`
  display: block;
  width: 500px;
  padding: 1rem;
  margin: 1rem;
  border-radius: 5px;
  font-size: 1rem;
`

const Button = styled.button`
  padding: 1rem;
  margin-top: 1rem;
  background-color: goldenrod;
  font-weight: strong;
  border-radius: 5px;
  font-size: 1rem;
  border-style: none;
  box-shadow: 1px 2px;
`

const Label = styled.label`
  width: 500px;
  font-size: 1rem;
  /* margin: 1rem; */
`

class LoginForm extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  static propTypes = {}

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
      <Form>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <Label>Email Address:</Label>
          <Input
            type="email"
            name="email"
            value={this.state.email}
            placeholder="Please enter your email"
            onChange={this.handleChange.bind(this)}
          />
          <Label>Password:</Label>
          <Input
            type="password"
            name="password"
            value={this.state.password}
            placeholder="Please enter your password"
            onChange={this.handleChange.bind(this)}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
    )
  }
}

const mapStateToProps = ({ currentUser }) => {
  return { currentUser }
}

export default connect(mapStateToProps, { login })(LoginForm)
