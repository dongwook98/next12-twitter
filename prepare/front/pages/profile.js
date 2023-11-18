import React from 'react';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import FollowList from '../components/FollowList';
import NicknameEditForm from '../components/NicknameEditForm';

const Profile = () => {
  const followerList = [{ nickname: '김예리' }, { nickname: '이태인' }, { nickname: '전우진' }];
  const followingList = [{ nickname: '김예리' }, { nickname: '이태인' }, { nickname: '전우진' }];
  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <title>내 프로필 | 트위터</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header='팔로잉 목록' data={followingList} />
        <FollowList header='팔로워 목록' data={followerList} />
      </AppLayout>
    </>
  );
};

export default Profile;
