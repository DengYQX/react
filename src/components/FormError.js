import React, { PropTypes } from 'react';

export default class ProgressButton extends React.Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
  };

  render() {
    const field = this.props.children;
    const errorMsg = field.touched && (field.error || field.svError);
    if (!errorMsg) {
      return null;
    }
    return <div className="text-danger">{errorMsg}</div>;
  }
}
