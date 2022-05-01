import React, { useState, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import styles from './FindId.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong  } from '@fortawesome/free-solid-svg-icons';

function FindId() {
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
  })

  const [insertinfo, setInsertinfo] = useState(false);
  const [userid, setUserid] = useState('');

  const {username, email} = inputs;

  const inputRef = useRef([]);

  const onChange = (e) => {
    const {name, value}= e.target;
    setInputs({
      ...inputs,
      [name]: value,
    })
  }

  const moveBack = () => {
    window.history.back();
  }

  const RegName = /^[가-힣a-zA-Z]+$/;
  const RegEmail = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
  const isValidName = RegName.test(username);
  const isValidEmail = RegEmail.test(email);
  
  const API = 'http://localhost:8080/member/searchid';
  const axiosConfig = {
    headers:{
      "Content-Type": "application/json"
    }
  }
  const searchId = (e) => {
    e.preventDefault();

    if(username==="" || !isValidName) {
      alert("이름을 확인해주세요.");
      inputRef.current[0].focus();
      return;
    } else if(email==="" || !isValidEmail) {
      alert("이메일 형식이 아닙니다.");
      inputRef.current[1].focus();
      return;
    } else {
      axios.post(API, JSON.stringify(inputs), axiosConfig)
        .then(res => {
          if(res.data.res_code === 200) {
            setInsertinfo(true);
            setUserid(userid => userid = res.data.data);
          } else {
            alert("정보와 일치하는 아이디가 존재하지 않습니다.");
          }
        })
        .catch(error => {
          console.log(error);
          alert("아이디 찾기에 실패하였습니다.");
        });
    }
  }

  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faArrowLeftLong} size='xl' 
        style={{'position': 'absolute', 'cursor': 'pointer'}}
        onClick={moveBack} />
      <h1 className={styles.title}>아이디 찾기</h1>
      {
        !insertinfo ?

        <div>
        <h2 className={styles.subtitle}>사용자 정보 입력</h2>
        <Form.Group className="mb-4" controlId="joinUsername">
          <Form.Label className={styles.option_title}>이름</Form.Label>
          <Form.Control type="text" placeholder="이름" name="username" 
            onChange={onChange} value={username} ref={el => (inputRef.current[0]=el)} />
        </Form.Group>
        <Form.Group className="mb-4" controlId="joinemail">
          <Form.Label className={styles.option_title}>E-mail</Form.Label>
          <Form.Control type="text" placeholder="email@example.com" name="email" 
          onChange={onChange} value={email} ref={el => (inputRef.current[1]=el)} />
        </Form.Group>

        <Button variant="outline-primary" className='w-100 fs-5'
          onClick={searchId}>아이디 조회</Button>
      </div>

      :

      <div>
        <h2 className={styles.subtitle}>아이디 찾기 결과</h2>
        <p className={styles.id_content}>{userid}</p>
      </div>
      }
      
      
    </div>
  )
}

export default FindId