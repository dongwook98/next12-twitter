import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import user from './user';
import post from './post';

// (이전상태, 액션) => 다음상태
const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        console.log('HYDATA', action);
        return { ...state, ...action.payload };
      default:
        return state;
    }
  }, // HYDRATE(서버 사이드 렌더링)를 위해서 index reducer 추가
  user,
  post,
}); // combineReducers가 user와 post의 intailState를 알아서 넣어줌

export default rootReducer;
