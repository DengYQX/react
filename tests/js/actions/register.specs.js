import { expect } from 'chai';
import nock from 'nock';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import * as COMMON_ACTION_TYPES from 'constants/common';
import * as REGISTER_ACTION_TYPES from 'constants/register';
import * as ACTIONS_SMS from 'actions/sms';
import * as ACTIONS_REGISTER from 'actions/register';
import inspectorMiddleware from 'middleware/inspector';

const SERVER_URL = 'http://localhost:8000';

describe('Register Actions:', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  beforeEach(() => {
    localStorage.removeItem('token');
  });

  // 发短信验证手机号action
  it('sendSMSClientValidate should create VALIDATE_SMS_PHONE action', () => {
    const smsPhoneErr = '请输入正确的手机号';
    expect(ACTIONS_SMS.sendSMSClientValidate(smsPhoneErr)).to.deep.equal({
      type: REGISTER_ACTION_TYPES.VALIDATE_SMS_PHONE,
      smsPhoneErr: smsPhoneErr,
    });
  });

  // 发短信action
  it('sendSMS should create registerSMSQL action', () => {
    expect(ACTIONS_SMS.sendSMS('15982253984'))
    .to.have.property('module').eql('registerSMSQL');
  });

  // 发短信成功action
  it('sendSMS success should create Q_SUCCESS action', (done) => {
    // 模拟一个post请求,发短信
    nock(SERVER_URL, {
      Authorization: 'JWT undefined',
      Accept: 'application/json',
      'Content-Type': 'application/json'
    })
    .post('/api/accounts/send_sms/', {
      mobile: '15982253984',
    })
    .reply(200, {
      token: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjE1OTgyMjUzOTg0IiwibW9iaWxlIjoiMTU5ODIyNTM5ODQiLCJ1c2VyX2lkIjo0MCwiZW1haWwiOiIiLCJleHAiOjE0NjQ0MDgzNzN9.U_ByGagU5o4Ir-mlLG1RV2AxhMRPOTRjfz0hXSCpkEdEMzsxRtmh28tvPCWCJHZLq6qPSKHyUBw8iM8U7Jcorg',
      username: '5982253984',
      id: 40,
    });

    // 此处需要引入自己写的中inspector间件
    const middlewares = [thunk, inspectorMiddleware];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});
    const expectedPendingAction = {
      type: COMMON_ACTION_TYPES.Q_PENDING,
      module: 'registerSMSQL',
    };
    store.dispatch(ACTIONS_SMS.sendSMS('15982253984'))
      .then(() => {
        // 所有的ajax请求都会经历Q_PENDING -> Q_SUCCESS/Q_ERROR
        expect(store.getActions()[0]).to.deep.equal(expectedPendingAction);
        expect(store.getActions()[1]).to.have
          .property('type').to.equal(COMMON_ACTION_TYPES.Q_SUCCESS);
      }).then(done).catch(done);
  });

  // 注册失败action
  it('register with empty field should create Q_ERROR action', (done) => {
    // 模拟一个post请求, 提交注册
    const registerPayload = {
      mobile: '',
      password: '',
      sms_code: 0,
    };
    const error400Res = {
      username: '手机号不能为空',
      password: '密码不能为空',
      sms_code: '验证码不能为空',
    };
    nock(SERVER_URL, {
      Authorization: 'JWT undefined',
      Accept: 'application/json',
      'Content-Type': 'application/json'
    })
    .post('/api/accounts/register/', registerPayload)
    .reply(400, error400Res);

    const middlewares = [thunk, inspectorMiddleware];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});
    const expectedPendingAction = {
      type: COMMON_ACTION_TYPES.Q_PENDING,
      module: 'registerQL',
    };
    store.dispatch(ACTIONS_REGISTER.register(registerPayload))
      .then(done).catch((err) => {
        const actions = store.getActions();
        expect(actions[0]).to.deep
          .equal(expectedPendingAction);
        expect(actions[1]).to.have
          .property('type').to.equal(COMMON_ACTION_TYPES.Q_ERROR);
        expect(actions[1].response.json).to.deep
          .equal(error400Res);
        done();
      });
  });


  // 注册成功action
  it('register with right field shoud create Q_SUCCESS action', (done) => {
    // 模拟一个post请求, 提交注册
    const registerPayload = {
      mobile: '15982253984',
      password: '111111',
      sms_code: 111111,
    };
    const succ200Res = {
      id: '1',
      mobile: '15982253984',
    };
    nock(SERVER_URL, {
      Authorization: 'JWT undefined',
      Accept: 'application/json',
      'Content-Type': 'application/json'
    })
    .post('/api/accounts/register/', registerPayload)
    .reply(200, {
      id: '1',
      mobile: '15982253984',
    });

    const middlewares = [thunk, inspectorMiddleware];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});
    const expectedPendingAction = {
      type: COMMON_ACTION_TYPES.Q_PENDING,
      module: 'registerQL',
    };
    store.dispatch(ACTIONS_REGISTER.register(registerPayload))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.deep
          .equal(expectedPendingAction);
        expect(actions[1]).to.have
          .property('type').to.equal(COMMON_ACTION_TYPES.Q_SUCCESS);
        expect(actions[1].response).to.deep
          .equal(succ200Res);
        done();
      });
  });
});
