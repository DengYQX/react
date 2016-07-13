import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/register';
import RegisterForm from './RegisterForm';

class RegisterView extends React.Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    registerSMSQL: PropTypes.object.isRequired,
    registerQL: PropTypes.object.isRequired,
    sms: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    actions: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    registerSMSQL: PropTypes.object.isRequired,
    registerQL: PropTypes.object.isRequired,
    sms: PropTypes.object.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
    };
  }

  getChildContext() {
    const { dispatch, actions, registerSMSQL, registerQL, sms } = this.props;
    const { submitting } = this.state;
    return {
      actions,
      dispatch,
      registerSMSQL,
      registerQL,
      sms,
      submitting,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { registerQL } = nextProps;
    if (!registerQL.isFetching && registerQL.response) {
      this.setState({
        submitting: false,
      });
    }
  }

  handleSubmit(values) {
    this.setState({
      submitting: true,
    });
    this.props.actions.register(values);
  }

  render() {
    return (
      <div className="col-md-12">
        <RegisterForm onSubmit={this.handleSubmit.bind(this)} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { api } = state;
  const sms = state.sms || {};
  const registerSMSQL = api.registerSMSQL || {};
  const registerQL = api.registerQL || {};
  return {
    registerSMSQL,
    registerQL,
    sms,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actionCreators, dispatch),
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterView);
