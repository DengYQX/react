import { expect } from 'chai';
import registerReducer from 'reducers/sms';
import * as COMMON_ACTION_TYPES from 'constants/common';
import * as REGISTER_ACTION_TYPES from 'constants/register';

describe('Register Reducers Tests', () => {
  it('should handle smsPhoneErr', () => {
    const reducerResponse = registerReducer([], {
      type: REGISTER_ACTION_TYPES.VALIDATE_SMS_PHONE,
      smsPhoneErr: '请输入正确的电话号码',
    });
    expect(reducerResponse).to.eql({
      smsPhoneErr: '请输入正确的电话号码',
    });
  });
});
