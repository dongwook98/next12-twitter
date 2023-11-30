// 사가의 이펙트들 불러오기
import { all, fork, takeLatest, delay, put, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  FOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_MY_INFO_FAILURE,
} from '../reducers/user';

function loadMyInfoAPI() {
  return axios.get('/user');
}

function* loadMyInfo(action) {
  try {
    const result = yield call(loadMyInfoAPI, action.data);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

function logInAPI(data) {
  return axios.post('/user/login', data);
}

/**
 * 비동기 액션을 처리하는 제너레이터 함수
 * dispatch({ type: LOG_IN_REQUEST })할 때
 * action 자체({ type: LOG_IN_REQUEST, data })가 logIn 매개변수로 전달
 */
function* logIn(action) {
  try {
    /**
     * 서버 요청(logInAPI) 실행하고 결괏값 저장
     * 이때 call은 함수를 동기적으로 호출, 나머지 매개변수는 호출한 함수에 전달
     * fork는 비동기 호출 -> 논블로킹 그러므로 여기서는 call만 써야한다.
     * 이펙트들 앞에는 yield를 붙여주는 이유는 테스트를 편하게 하기 위해서이다.
     */
    const result = yield call(logInAPI, action.data);
    // 서버 구현하기전에는 delay로 서버 요청하는척을 하는것
    // yield delay(1000);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post('/user/logout');
}

function* logOut() {
  try {
    yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}

function signUpAPI(data) {
  // GET과 DELETE는 2번째 인수로 데이터를 못넘기는데, POST, PUT, PATCH는 데이터를 넘겨줄 수 있음
  return axios.post('/user', data); // data는 { email, nickname, password }이라는 객체
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    console.log(result);
    // yield delay(1000);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}

function followAPI() {
  return axios.post('/api/follow');
}

function* follow(action) {
  try {
    // const result = yield call(followAPI);
    yield delay(1000);
    yield put({
      type: FOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function unfollowAPI() {
  return axios.post('/api/unfollow');
}

function* unfollow(action) {
  try {
    // const result = yield call(unfollowAPI);
    yield delay(1000);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

// 비동기 액션을 감시하고 해당 액션 발생 시 logIn 함수 실행
function* watchLogIn() {
  /**
   * take: 액션이 실행될때까지 기다림 그러나 일회용.. while(true){} 로 감싸면 되긴하는데 이렇게는 안하고 takeEvery 사용
   * takeEvery: 일회용 아님. 단, 실수로 클릭 연달아 했을때 요청이 다 가게되고, 응답도 다 오게 됨
   * takeLatest: 실수로 클릭 연달아 했을때 마지막것만 인정, 단, 요청은 다 가기는 하는데 응답은 취소해줌
   * takeLeading: 실수로 클릭 연달아 했을때 앞에것만 인정
   * throttle: 시간을 설정해놓으면 그 시간안에 요청은 딱 한번만 가게한다.
   */
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  // all은 배열을 받는데, 배열 안의 것들을 동시에 실행
  // fork는 함수를 비동기 호출
  yield all([
    fork(watchLoadMyInfo),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
  ]);
}
