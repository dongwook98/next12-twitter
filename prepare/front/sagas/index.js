import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

// 분리한 사가들 불러오기
import postSaga from './post';
import userSaga from './user';

// 백엔드 요청 시 주소 중복 제거
axios.defaults.baseURL = 'http://localhost:3065';
// withCredentials: 프론트 -> 백엔드로 쿠키
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  // 분리한 사가들 합치기
  yield all([fork(postSaga), fork(userSaga)]);
}
