import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './UserInfopage.module.css';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';

function UserInfopage() {
  
  const [inputs, setInputs] = useState({
    username: "",
    userid: "",
    email: "",
    phone: "",
  })
  const [newpw, setNewpw] = useState("");
  const [checkpw, setCheckpw] = useState("");
  const {username, userid, email, phone} = inputs;

  const inputRef = useRef([]);

  const onChange = (e) => {
    const {name, value}= e.target;
    setInputs({
      ...inputs,
      [name]: value,
    })
  }
  const onChangePw = (e) => {
    const value = e.target.value;
    setNewpw(newpw => newpw=value);
  }
  const checkPassword = (e) => {
    setCheckpw(e.target.value);
  }

  const moveBack = (e) => {
     e.preventDefault();
    if(window.confirm("이전 페이지로 돌아가시겠습니까?\n수정된 내용은 저장되지 않습니다.")===true) window.history.back();
  }

  const RegPw = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
  const RegEmail = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
  const RegPhone = /^01[0|1|6|7|8|9]([0-9]{3,4})([0-9]{4})$/;

  const isValidPw = RegPw.test(newpw);
  const isValidEmail = RegEmail.test(email);
  const isValidPhone = RegPhone.test(phone);

  const modifyComplete = (e) => {
    e.preventDefault();
    
    if(newpw !==""){
      if(!isValidPw){
        alert("비밀번호는 영문, 숫자, 특수문자를 포함한 8-25자입니다.");
        inputRef.current[0].focus();
        return;
      } else if(newpw!==checkpw) {
        alert("비밀번호를 확인해주세요.");
        inputRef.current[0].focus();
        return;
      }
    } 
    if(email==="" || !isValidEmail) {
      alert("이메일 형식이 아닙니다.");
      inputRef.current[1].focus();
      return;
    } else if(phone==="" || !isValidPhone) {
      alert("올바른 휴대폰번호를 입력하세요.");
      inputRef.current[2].focus();
      return;
    } else if(window.confirm("수정한 내용을 저장하시겠습니까?")===true) {
      updateUser();
    }
  }

  const idx = localStorage.getItem("idx");

  const API1 = `http://localhost:8080/member/${idx}`;
  const API2 = `http://localhost:8080/member/update/${idx}`;

  const axiosConfig = {
    headers:{
      "Content-Type": "application/json"
    }
  }

  const fetchUser = () => {
    axios.get(API1,axiosConfig)
      .then(res => {
        const data = res.data.data;
        setInputs(data);
      })
      .catch(error => {
        console.log(error);
        alert("정보를 불러올 수 없습니다.");
        window.history.back();
      })
  }

  const updateUser = () => {
    if(newpw!=="") {
      Object.assign(inputs, {userpw: newpw});
    }
    axios.put(API2, JSON.stringify(inputs), axiosConfig)
    .then(res => {
      alert("회원정보를 수정하였습니다.");
    })
    .catch(error => {
      console.log(error);
      alert("회원 정보 저장에 실패하였습니다.");
    })
    window.location.reload();
  }

  useEffect(() => {
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원 정보</h1>

      <Form.Group className="mb-4" controlId="joinUsername">
        <Form.Label className={styles.option_title}>이름</Form.Label>
        <Form.Control type="text" placeholder="이름" name="username" disabled
          value={username} />
      </Form.Group>

      <Form.Group className="mb-4" controlId="joinUserid">
        <Form.Label className={styles.option_title}>아이디</Form.Label>
        <Form.Control type="text" placeholder="아이디" name="userid" disabled
          value={userid} />
      </Form.Group>

      <Form.Group className="mb-1" controlId="joinUserpw">
        <Form.Label className={styles.option_title}>비밀번호 수정</Form.Label>
        <Form.Control type="password" placeholder="새로운 비밀번호" name="userpw" 
          onChange={onChangePw} value={newpw} ref={el => (inputRef.current[0]=el)} />
      </Form.Group>
      <Form.Control type="password" placeholder="비밀번호 확인" name="checkpw" onChange={checkPassword} value={checkpw} />
        <p className={`mb-4 ${styles.error_msg}`}>
          { newpw!=="" || checkpw!=="" ? 
            (checkpw===newpw ? <span style={{'color': '#0b5ed7'}}>비밀번호가 일치합니다.</span>:<span style={{'color': 'red', 'fontStyle':'italic'}}>비밀번호가 일치하지 않습니다.</span>) : "" }
        </p>
        
      <Form.Group className="mb-4" controlId="joinemail">
        <Form.Label className={styles.option_title}>E-mail*</Form.Label>
        <Form.Control type="text" placeholder="email@example.com" name="email" ref={el => (inputRef.current[1]=el)} 
          onChange={onChange} value={email} />
      </Form.Group>

      <Form.Group className="mb-4" controlId="joinphone">
        <Form.Label className={styles.option_title}>휴대폰번호*</Form.Label>
        <Form.Control type="text" placeholder="숫자만 입력" name="phone" ref={el => (inputRef.current[2]=el)} 
          onChange={onChange} value={phone} />
      </Form.Group>

      <div className='container mb-4'>
        <div className="row">
          <Button variant="outline-secondary" onClick={moveBack} className='col fs-5' style={{'marginRight': '5px'}}>
            이전
          </Button>
          <Button variant="primary" onClick={modifyComplete} className='col fs-5'>
            수정하기
          </Button>
        </div>
      </div>
      <p className='text-end'>
          <Link to='/delete' className={styles.link}>회원 탈퇴 →</Link>
        </p>
    </div>
  )
}

export default UserInfopage