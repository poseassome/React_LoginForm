import React, { useRef, useState } from 'react';
import styles from './FindPw.module.css';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong  } from '@fortawesome/free-solid-svg-icons';

function FindPw() {
  const [inputs, setInputs] = useState({
    userid: '',
    email: ''
  })

  const [passwords, setPasswords] = useState({
    userpw: '',
    checkpw: ''
  })
  
  const [insertinfo, setInsertinfo] = useState(false);
  const [idx, setIdx] = useState('');
  const {userid, email} = inputs;
  const {userpw, checkpw} = passwords;

  const inputRef = useRef([]);
  
  const onChange = (e) => {
    const {name, value} = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    })
  }

  const onChangePw = (e) => {
    const {name, value} = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    })
  }

  const moveBack = () => {
    window.history.back();
  }

  const RegEmail = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
  const RegPw = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

  const isValidEmail = RegEmail.test(email);
  const isValidPw = RegPw.test(userpw);

  const API = 'http://localhost:8080/member/search';
  const API_pw = `http://localhost:8080/member/pw/${idx}`;
  const axiosConfig = {
    headers:{
      "Content-Type": "application/json"
    }
  }

  const searchPw = (e) => {
    e.preventDefault();

    if(userid==="") {
      alert("아이디를 입력하세요.");
      inputRef.current[0].focus();
      return;
    } else if(email==="" || !isValidEmail) {
      alert("이메일 형식이 아닙니다.");
      inputRef.current[1].focus();
      return;
    } else {
      axios.post(API, inputs, axiosConfig)
        .then(res => {
          if(res.data.res_code === 200) {
            setInsertinfo(true);
            setIdx(idx => idx = res.data.data);
          } else {
            alert("일치하는 회원 정보가 존재하지 않습니다.");
          }
        })
        .catch(error => {
          console.log(error);
          alert("일치하는 회원 정보가 존재하지 않습니다.");
        })
    }
  }

  const updatePw = (e) => {
    e.preventDefault();

    if(userpw==="") {
      alert("새로운 비밀번호를 입력해주세요.");
      return;
    } else if(!isValidPw) {
      alert("비밀번호는 영문, 숫자, 특수문자를 포함한 8-25자입니다.");
      return;
    } else if(userpw!==checkpw) {
      alert("비밀번호를 확인해주세요.");
      return;
    } else {
      axios.put(API_pw, {userpw: userpw}, axiosConfig)
        .then(res => {
          if(res.data.res_code === 200) {
            alert("새로운 비밀번호로 변경되었습니다.")
            window.location.replace('/');
          } else {
            alert("비밀번호 변경에 실패했습니다.");
          }
        })
        .catch(error => {
          console.log(error);
          alert("비밀번호 변경에 실패했습니다.");
        })
    }
  }

  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faArrowLeftLong} size='xl' 
        style={{'position': 'absolute', 'cursor': 'pointer'}}
        onClick={moveBack} />
      <h1 className={styles.title}>비밀번호 찾기</h1>

      {
        !insertinfo ? 

        <div>
          <h2 className={styles.subtitle}>사용자 정보 입력</h2>
          <Form.Group controlId="formBasicId" className='mb-3'>
            <Form.Label className={styles.option_title}>ID</Form.Label>
            <Form.Control type="text" placeholder="아이디를 입력하세요." name="userid" 
              onChange={onChange} value={userid} ref={el => (inputRef.current[0]=el)} />
          </Form.Group>
          <Form.Group className="mb-4" controlId="joinemail">
            <Form.Label className={styles.option_title}>E-mail</Form.Label>
            <Form.Control type="text" placeholder="email@example.com" name="email" 
            onChange={onChange} value={email} ref={el => (inputRef.current[1]=el)} />
          </Form.Group>
          <Button variant="outline-primary" className='w-100 fs-5'
            onClick={searchPw}>비밀번호 찾기</Button>
        </div>

        :

        <div>
          <h2 className={styles.subtitle}>새로운 비밀번호 설정</h2>
          <Form.Group controlId="joinUserpw">
            {/* <Form.Label className={styles.option_title}>비밀번호</Form.Label> */}
            <Form.Control type="password" placeholder="새로운 비밀번호" name="userpw" className='mb-2'
              onChange={onChangePw} value={userpw} />
          </Form.Group>
          <Form.Control type="password" placeholder="새로운 비밀번호 확인" name="checkpw" onChange={onChangePw} value={checkpw} />
          <p className={`mb-2 ${styles.error_msg}`}>
            { userpw!=="" || checkpw!=="" ? 
              (checkpw===userpw ? <span style={{'color': '#0b5ed7'}}>비밀번호가 일치합니다.</span>:<span style={{'color': 'red', 'fontStyle':'italic'}}>비밀번호가 일치하지 않습니다.</span>) : "" }
          </p>

          <Button variant="outline-primary" className='w-100 fs-5'
           onClick={updatePw} >비밀번호 재설정</Button>
        </div>
      }
    </div>
  )
}

export default FindPw