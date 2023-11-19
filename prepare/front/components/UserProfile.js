import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ButtonWrapper = styled(Button)`
  margin-left: 47px;
`;

const UserProfile = ({ setIsLoggedIn }) => {
  const onLogout = useCallback(() => {
    setIsLoggedIn(false);
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
      <Card.Meta avatar={<Avatar>동욱</Avatar>} title='dongwook' />
      <ButtonWrapper onClick={onLogout}>로그아웃</ButtonWrapper>
    </Card>
  );
};

UserProfile.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default UserProfile;
