import React from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import AppLayout from '../components/AppLayout';
import FollowList from '../components/FollowList';
import NicknameEditForm from '../components/NicknameEditForm';

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const router = useRouter();

  // 로그인 안하고 프로필페이지 접근시 홈페이지로 리다이렉트
  if (!me) {
    router.push('/');
    return null;
  }
  return (
    <>
      <Head>
        <title>내 프로필 | 트위터</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header='팔로잉 목록' data={me.Followings} />
        <FollowList header='팔로워 목록' data={me.Followers} />
      </AppLayout>
    </>
  );
};

export default Profile;
