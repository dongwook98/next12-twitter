import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';

const ButtonWrapper = styled(Button)`
  margin-left: 47px;
`;

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, isLoggingOut } = useSelector((state) => state.user);

  const onLogout = useCallback(() => {
    // setIsLoggedIn(false);
    dispatch(logoutRequestAction());
  }, []);
  return (
    <Card
      actions={[
        <div key='twit'>
          게시글 <br />0
        </div>,
        <div key='following'>
          팔로잉
          <br />0
        </div>,
        <div key='follower'>
          팔로워
          <br />0
        </div>,
      ]}>
      <Card.Meta avatar={<Avatar>{me.nickname[0]}</Avatar>} title={me.nickname} />
      <ButtonWrapper onClick={onLogout} loading={isLoggingOut}>
        로그아웃
      </ButtonWrapper>
    </Card>
  );
};

export default UserProfile;
