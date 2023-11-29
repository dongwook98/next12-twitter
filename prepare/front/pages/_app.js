import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

// redux 설정 불러오기
import wrapper from '../store/configureStore';

// _app.js는 모든 페이지 컴포넌트들의 공통 컴포넌트이다.
const App = ({ Component }) => {
  return (
    <>
      {/* Next에서 head 부분 수정 할 수 있게 Head 컴포넌트를 제공 */}
      <Head>
        <meta charSet='utf-8' />
        <title>트위터</title>
      </Head>
      <Component />
    </>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

// App에 redux 씌우기
export default wrapper.withRedux(App);
