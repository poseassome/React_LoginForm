import React, { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import styles from './LoginForm.module.css';

function LoginForm() {
  const [inputs, setInputs] = useState({
    userid: "",
    userpw: "",
  });

  const {userid, userpw} = inputs;

  const [isRemember, setIsRemember] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['rememberId']);

  const inputRef = useRef([]);

  const onChange = (e) => {
    const {name, value}= e.target;
    setInputs({
      ...inputs,
      [name]: value,
    })
  }

  useEffect(() => {
    if(cookies.rememberId !== undefined) {
      setInputs(prev => {return {...prev, userid: cookies.rememberId}});
      setIsRemember(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const API = 'http://localhost:8080/member/login';

  const axiosConfig = {
    headers:{
      "Content-Type": "application/json"
    }
  }

  const userLogin = (e) => {
    if(userid==="") {
      alert("아이디를 입력하세요.");
      inputRef.current[0].focus();
      return;
    } else if(userpw==="") {
      alert("비밀번호를 입력하세요.");
      inputRef.current[1].focus();
      return;
    } else {
      // e.preventDefault();

      axios.post(API, JSON.stringify(inputs), axiosConfig)
        .then(response => {
          if(response.data.res_code === 200) {
            localStorage.setItem("idx", response.data.data.idx);
            window.location.replace('/mypage');
          } else {
            alert("아이디 또는 비밀번호가 일치하지 않습니다.");
          }
        })
        .catch(error => {
          console.log(error);
          alert("로그인 실패");
        });
    }
  }

  const handleOnChange = (e) => {
    setIsRemember(e.target.checked);
    if(e.target.checked) {
      setCookie('rememberId', userid, {path: '/', expire: 30});
    } else {
      removeCookie('rememberId');
    }
  }

  const onCheckEnter = (e) => {
    if(e.key === 'Enter') {
      userLogin();
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>LOGIN</h1>
        <Form onKeyPress={onCheckEnter}>
          <Form.Group controlId="formBasicId" className='mb-3'>
            <Form.Label className='fs-5'>ID</Form.Label>
            <Form.Control type="text" placeholder="아이디를 입력하세요." name="userid" 
              onChange={onChange} value={userid} ref={el => (inputRef.current[0]=el)} />
          </Form.Group>
          <Form.Group controlId="formBasicPw" className='mb-3'>
            <Form.Label className='fs-5'>Password</Form.Label>
            <Form.Control type="password" placeholder="비밀번호를 입력하세요." name="userpw" 
              onChange={onChange} value={userpw} ref={el => (inputRef.current[1]=el)} />
          </Form.Group>

          <div className='d-flex justify-content-between mb-2'>
            <Form.Group  controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="아이디 저장" style={{'lineHeight': '22px'}}
                onChange={handleOnChange} checked={isRemember} />
            </Form.Group>
            <ul>
              <li className={styles.findli}>
                <Link to='/findId' className={styles.findlink}>아이디 찾기</Link>
              </li>
              <li className={styles.findli}>
                <Link to='/findPw' className={styles.findlink}>비밀번호 찾기</Link>
              </li>
            </ul>
          </div>

          <div className={styles.btn_container}>
            <Button variant="primary" onClick={userLogin} className='mb-4 fs-5'>
              로그인
            </Button>
            <p className="text-center mb-2 fs-6">아직 회원이 아니신가요?</p> 
            <Link to='/join' className={`text-center mb-3 ${styles.link}`}>회원가입</Link>
          </div>
        </Form>
    </div>
  )
}

export default LoginForm