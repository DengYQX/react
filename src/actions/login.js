/*
 *  登录操作
 *  第三方传过来的next url 需要使用encodeURIComponent, 如http://sso.burnish.cn?next=http%3A%2F%2Fwww.baidu.com%3Fa%3D1%26b%3D2
 * */

import { post } from 'utils/request';
import { AUTH_USER } from 'constants/auth';

export function login(t) {
  return {
    module: 'loginQL',
    promise() {
      return post('login/', {
        t,
      });
    },
    onSuccess(response, dispatch) {
      const { token } = response;
      if (token) {
        dispatch({
          type: AUTH_USER,
          user: response,
        });
      }
    },
  };
}
