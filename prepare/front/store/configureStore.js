import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import reducer from '../reducers/index';
import rootSaga from '../sagas';

// 미들웨어를 직접 만들수있다.
const loggerMiddleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    console.log(action);
    return next(action);
  };

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware, loggerMiddleware]; // 추가할 미들웨어들

  // enhancer: 확장
  const enhancer =
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares)) // 배포용일때는 데브툴사용x
      : composeWithDevTools(applyMiddleware(...middlewares)); // 개발용일때는 데브툴사용
  const store = createStore(reducer, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

// next-redux-wrapper에서 createWrapper를 가져와서 넥스트에서 리덕스 적용 쉽게 해줌
const wrapper = createWrapper(configureStore, { debug: process.env.NODE_ENV === 'development' });

export default wrapper;
