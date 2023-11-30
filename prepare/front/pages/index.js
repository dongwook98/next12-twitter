// import React from 'react'; next에서는 생략 가능
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);

  /**
   * Home 컴포넌트 마운트시 LOAD_POSTS_REQUEST 액션 실행 -> Saga에 등록해둔 loadPosts 실행(서버와 통신) ->
   * 성공시 LOAD_POSTS_SUCCESS 액션 실행 + 서버에서 받아온 데이터 reducer에 전달 -> reducer에 적어준대로 상태 업데이트
   */
  useEffect(() => {
    // 새로고침 시 로그인 상태 복구
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    // 페이지 접속 시 게시글 불러오기
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  useEffect(() => {
    function onScroll() {
      /**
       * window.scrollY: 얼마나 내렸는지
       * document.documentElement.clientHeight: 화면에 보이는 길이
       * document.documentElement.scrollHeight: 총 길이
       * 끝까지 내렸을때 -> window.scrollY + document.documentElement.clientHeight === document.documentElement.scrollHeight
       */
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        // 더 불러올 게시글들이 있고 로딩중이 아닐 때 LOAD_POSTS_REQUEST 실행
        // 스크롤 이벤트가 중첩으로 일어나도 loadPostLoading으로 요청이 한번만 가게 제한
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);

    // 컴포넌트 언마운트시 스크롤 이벤트 제거
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {/* 로그인했을때는 PostForm 컴포넌트 활성화 */}
      {me && <PostForm />}
      {/* 게시글들 map()으로 PostCard 컴포넌트에 매핑 */}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export default Home;
