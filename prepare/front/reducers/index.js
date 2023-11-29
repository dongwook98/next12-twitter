// 서버 사이드 렌더링을 위한 HYDRATE
import { HYDRATE } from 'next-redux-wrapper';
// 쪼개 리듀서들을 합치기 위한 combineReducers 불러오기
import { combineReducers } from 'redux';

// 쪼갠 리듀서들 불러오기
import user from './user';
import post from './post';

// (이전상태, 액션) => 다음상태
// combineReducers가 쪼갠 reducer들을 합쳐줌
const rootReducer = combineReducers({
  // HYDRATE(서버 사이드 렌더링)를 위해서 index reducer 추가
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        console.log('HYDATA', action);
        return { ...state, ...action.payload };
      default:
        return state;
    }
  },
  // combineReducers가 user와 post의 initialState를 알아서 합쳐서 넣어준다.
  user,
  post,
});

export default rootReducer;
