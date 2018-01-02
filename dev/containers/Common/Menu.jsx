import './style.scss';
import React,{Component, PropTypes} from 'react'
import { connect} from 'react-redux'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux';
class Menu extends Component {
    constructor(props) {
        super(props);
    }

  render() {

      return (
        <div className="header">
           <a>bangbang</a>
        </div>
    );
  }
}

export default  Menu;