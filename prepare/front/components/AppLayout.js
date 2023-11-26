import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Input, Menu, Row, Col } from 'antd';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import UserProfile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';

const InputSearch = styled(Input.Search)`
  vertical-align: 'middle';
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // 더미 데이터
  return (
    <div>
      <Menu mode='horizontal'>
        <Menu.Item>
          <Link href='/'>
            <a>트위터</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href='/profile'>
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <InputSearch enterButton />
        </Menu.Item>
        <Menu.Item>
          <Link href='/signup'>
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {/* 로그인했을때는 UserProfile 컴포넌트 활성화 */}
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          {/* target='_blank' 했을때는 보안을 위해 rel='noreferrer noopener' 추가 */}
          <a href='https://github.com/dongwook98/next12-twitter' target='_blank' rel='noreferrer noopener'>
            Made by dongwook
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired, // node: 리액트의 노드라는뜻, 리턴안에 들어갈수있는것들이 모두 노드
};

export default AppLayout;
