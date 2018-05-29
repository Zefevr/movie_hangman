import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { login } from '../actions/login'
import { Redirect } from 'react-router-dom'

const Form = styled.div`
  width: 500px;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
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
    if (this.props.currentUser.jwt) return <Redirect to="/game" />

    return (
      <Form>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input
            className="input"
            type="email"
            name="email"
            value={this.state.email}
            placeholder="Please enter your email"
            onChange={this.handleChange.bind(this)}
          />
          <input
            className="input"
            type="password"
            name="password"
            value={this.state.password}
            placeholder="Please enter your password"
            onChange={this.handleChange.bind(this)}
          />
          <button type="submit">Login</button>
        </form>
      </Form>
    )
  }
}

const mapStateToProps = ({ currentUser }) => {
  return { currentUser }
}

export default connect(mapStateToProps, { login })(LoginForm)
