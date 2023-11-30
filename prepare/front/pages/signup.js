import React, { useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
import { Button, Checkbox, Form, Input } from 'antd';
import styled from 'styled-components';
import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import { useRouter } from 'next/router';
import { SIGN_UP_REQUEST } from '../reducers/user';
import { useDispatch, useSelector } from 'react-redux';

const ErrorMessage = styled.div`
  color: red;
`;

const Signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user);
  const router = useRouter();

  // 로그인을 하지 않고 회원가입 페이지 방문 시 홈페이지로 리다이렉트
  useEffect(() => {
    if (me) {
      // replace는 기록에서 사라져서 페이지 뒤로가기 하지 못함
      router.replace('/');
    }
  }, [me]);

  // 회원가입 성공 시 홈페이지로 리다이렉트
  useEffect(() => {
    if (signUpDone) {
      router.replace('/');
    }
  }, [signUpDone]);

  // 회원가입 실패 시 서버에서 받아온 응답 데이터(실패 이유)를 alert
  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');

  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordCheckError, setPasswordCheckError] = useState(false);
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      // 비밀번호 확인 부분이 작성한 비밀번호와 다르면 setPasswordCheckError(true)
      setPasswordCheckError(e.target.value !== password);
    },
    [password]
  );

  const [term, setTerm] = useState('');
  const [termError, setTermError] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const onSubmit = useCallback(() => {
    // 제출 시 한번 더 검사
    if (password !== passwordCheck) {
      return setPasswordCheckError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    console.log(email, nickname, password);
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    });
  }, [email, password, passwordCheck, term]);

  return (
    <>
      <AppLayout>
        <Head>
          <title>회원가입 | 트위터</title>
        </Head>
        <Form onFinish={onSubmit}>
          <div>
            <label htmlFor='user-email'>이메일</label>
            <br />
            <Input name='user-email' type='email' value={email} required onChange={onChangeEmail} />
          </div>
          <div>
            <label htmlFor='user-nickname'>닉네임</label>
            <br />
            <Input name='user-nickname' value={nickname} required onChange={onChangeNickname} />
          </div>
          <div>
            <label htmlFor='user-password'>비밀번호</label>
            <br />
            <Input name='user-password' type='password' value={password} required onChange={onChangePassword} />
          </div>
          <div>
            <label htmlFor='user-password-check'>비밀번호체크</label>
            <br />
            <Input
              name='user-password-check'
              type='password'
              value={passwordCheck}
              required
              onChange={onChangePasswordCheck}
            />
            {passwordCheckError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
          </div>
          <div>
            <Checkbox name='user-term' checked={term} onChange={onChangeTerm}>
              동욱님 말을 잘 들을 것을 동의합니다.
            </Checkbox>
            {termError && <ErrorMessage>약관을 동의하셔야 합니다.</ErrorMessage>}
          </div>
          <div style={{ marginTop: 10 }}>
            <Button type='primary' htmlType='submit' loading={signUpLoading}>
              가입하기
            </Button>
          </div>
        </Form>
      </AppLayout>
    </>
  );
};

export default Signup;
