import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

class Game extends PureComponent {
  static propTypes = {}

  render() {
    if (!this.props.currentUser.jwt) return <Redirect to="/login" />
    return <div>GAME BOARD</div>
  }
}

const mapStateToProps = ({ currentUser }) => {
  return { currentUser }
}

export default connect(mapStateToProps)(Game)
