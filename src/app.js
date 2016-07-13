import cookie from 'js-cookie';
import { Link } from 'react-router';
import Progress from 'react-progress';
import { connect } from 'react-redux';
import queryString from 'query-string';
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { replace } from 'react-router-redux';
import * as actionCreators from 'actions/auth';
import { DEBUG, SSO_URL } from 'config';

export default class App extends React.Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loadingBarPercent: 0,
    };
  }

  componentWillMount() {
    const token = cookie.get('o_jwt_id');
    this.props.actions.auth(token);
    clearInterval(this.loadingBarTimer);
  }

  componentWillReceiveProps(nextProps) {
    const { actions, dispatch, loadingBar, location } = nextProps;
    const { search } = location;
    const parsedQueryString = queryString.parse(search);
    const { t, next } = parsedQueryString;

    if (t && next) {
      actions.auth(t);
      dispatch(replace(location.pathname));
    }
    if (loadingBar) {
      this.setState({
        loadingBarPercent: 0,
      });
      this.loadingBarTimer = setInterval(() => {
        const loadingBarPercent = this.state.loadingBarPercent;
        const incrLoadingBarPercent = loadingBarPercent + Math.floor(Math.random() * 20);
        if (incrLoadingBarPercent < 99) {
          this.setState({
            loadingBarPercent: incrLoadingBarPercent,
          });
        }
      }, 800);
    } else {
      clearInterval(this.loadingBarTimer);
      this.setState({
        loadingBarPercent: 100,
      });
    }
  }

  handleLogin() {
    const locate = this.props.location;
    const ssoTail = DEBUG ? '/#/land' : '/land';
    const callbackTail = DEBUG ? `/#${locate.pathname}` : `${locate.pathname}`;
    const callbackUrl = encodeURIComponent(`${location.protocol}//${location.host}${callbackTail}`);
    const ssoUrl = `${SSO_URL}${ssoTail}?callback=${callbackUrl}&next=/`;
    window.open(ssoUrl);
  }

  handleLogout() {
    this.props.actions.logout();
  }

  render() {
    const { loadingBarPercent } = this.state;
    const { auth } = this.props;
    const { username, isAuthenticated } = auth;
    const uname = username && username.toString() || '用户名异常';
    let userNavEl = (
      <li>
        <a className="curp pull-right" onClick={this.handleLogin.bind(this)}>登录</a>
        <a className="curp pull-right" onClick={this.handleLogin.bind(this)}></a>
      </li>
    );
    const isAuthPage = isAuthenticated === true;
    if (isAuthPage) {
      userNavEl = (
        <li>
          <Link to="/" className="curp pull-right curp" onClick={this.handleLogout.bind(this)}>退出</Link>
          <a className="uname-block pull-right">{uname}</a>
        </li>
      );
    }
    return (
      <div>
        <Progress percent={loadingBarPercent} style={{ zIndex: 999 }} />
        <nav className="navbar navbar-default navbar-static-top" role="navigation">
          <div className="container">
            <div className="clearfix">
              <Link className="navbar-brand" to="/">监控系统</Link>
              <ul className="nav navbar-nav">
                <li><Link to="/bj">监控报警</Link></li>
                <li><Link to="/bj">统计分析</Link></li>
                <li><Link to="/bj">救援服务</Link></li>
                <li><Link to="/truck">车辆管理</Link></li>
                <li><Link to="/bj">服务站</Link></li>
                <li><Link to="/bj">事业部</Link></li>
                <li><Link to="/bj">配置管理</Link></li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                {userNavEl}
              </ul>
            </div>
          </div>
        </nav>
        <div className="container">
          <div className="row row-padding">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const loadingBar = state.api.loadingBar || false;
  const auth = state.auth || {};
  return {
    loadingBar,
    auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    actions: bindActionCreators(actionCreators, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

