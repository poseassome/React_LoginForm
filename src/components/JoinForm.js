import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import styles from './JoinForm.module.css';

function JoinForm() {
  const [inputs, setInputs] = useState({
    username: "",
    userid: "",
    userpw: "",
    email: "",
    phone: "",
  })
  const [checkpw, setCheckpw] = useState("");
  const [id_msg, setId_msg] = useState("");
  const [checkid, setCheckid] = useState(false);
  const [agree, setAgree] = useState(false);

  const {username, userid, userpw, email, phone} = inputs;

  const inputRef = useRef([]);

  const onChange = (e) => {
    const {name, value}= e.target;
    setInputs({
      ...inputs,
      [name]: value,
    })
    if(userid!==inputs.userid) {
      setId_msg("");
      setCheckid(false);
    }
  }

  const onChangeA = () => {
    setAgree((agree) => !agree);
  }

  const checkPassword = (e) => {
    setCheckpw(e.target.value);
  }

  const moveBack = () => {
    if(window.confirm("회원가입을 취소하시겠습니까?")===true) window.location.replace("/");
  }

  function dateFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;

    return date.getFullYear() + '-' + month + '-' + day;
}

  const RegName = /^[가-힣a-zA-Z]+$/;
  const RegId = /^[a-z0-9_-]{4,20}$/;
  const RegPw = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
  const RegEmail = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
  const RegPhone = /^01[0|1|6|7|8|9]([0-9]{3,4})([0-9]{4})$/;

  const isValidName = RegName.test(username);
  const isValidId = RegId.test(userid);
  const isValidEmail = RegEmail.test(email);
  const isValidPw = RegPw.test(userpw);
  const isValidPhone = RegPhone.test(phone);

  const API = 'http://localhost:8080/member/join';
  const API_id = 'http://localhost:8080/member/id';
  const axiosConfig = {
    headers:{
      "Content-Type": "application/json"
    }
  }

  const idcheck = (e) => {
    e.preventDefault();
    if(userid==="") {
      alert("아이디를 입력해주세요.");
      inputRef.current[1].focus();
      return;
    } else if(!isValidId) {
      alert("아이디는 영문, 숫자 조합 4-20자입니다.");
      inputRef.current[1].focus();
      return;
    } else {
      axios.post(API_id, {userid: userid}, axiosConfig)
      .then(res => {
        if(res.data.res_code===200) {
          setCheckid(true);
          setId_msg("사용가능한 아이디입니다.");
        } else {
          setCheckid(false);
          setId_msg("이미 사용 중인 아이디입니다.");
        }
      })
      .catch(error => {
        console.log(error);
        alert("중복확인에 실패하였습니다.");
      })
    }
  }

  const joinComplete = (e) => {
    e.preventDefault();

    if(username==="" || !isValidName) {
      alert("이름을 확인해주세요.");
      inputRef.current[0].focus();
      return;
    } else if(userid==="" || !isValidId) {
      alert("아이디는 영문, 숫자 조합 4-20자입니다.");
      inputRef.current[1].focus();
      return;
    } else if(userpw==="" || !isValidPw) {
      alert("비밀번호는 영문, 숫자, 특수문자를 포함한 8-25자입니다.");
      inputRef.current[2].focus();
      return;
    } else if(userpw!==checkpw){
      alert("비밀번호를 확인해주세요.");
      inputRef.current[2].focus();
      return;
    }else if(email==="" || !isValidEmail) {
      alert("이메일 형식이 아닙니다.");
      inputRef.current[3].focus();
      return;
    } else if(phone==="" || !isValidPhone) {
      alert("올바른 휴대폰번호를 입력하세요.");
      inputRef.current[4].focus();
      return;
    } else if(agree===false) {
      alert("약관에 동의해주세요.");
      inputRef.current[5].focus();
      return;
    } else if(checkid===false){
      alert("아이디 중복확인을 해주세요.");
      return;
    } else {
      Object.assign(inputs, {joindate: dateFormat(new Date())});

      axios.post(API, JSON.stringify(inputs), axiosConfig)
        .then(response => {
          if(response.data.res_code === 200) {
            alert("회원가입 완료 !");
            window.location.replace('/');
          } else {
            alert("회원가입 실패");
          }
        })
        .catch(error => {
          console.log(error);
          alert("회원가입 실패");
        });
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>

      <Form.Group className="mb-4" controlId="joinUsername">
        <Form.Label className={styles.option_title}>이름*</Form.Label>
        <Form.Control type="text" placeholder="이름" name="username" 
          onChange={onChange} value={username} ref={el => (inputRef.current[0]=el)} />
      </Form.Group>

      <Form.Group controlId="joinUserid">
        <Form.Label className={styles.option_title}>아이디*</Form.Label>
        <div className={styles.idinput}>
          <Form.Control type="text" placeholder="아이디" name="userid" 
            onChange={onChange} value={userid} ref={el => (inputRef.current[1]=el)} />
          <Button variant="dark" onClick={idcheck}>중복확인</Button>
        </div>
      </Form.Group>
        <p className={`mb-2 ${styles.error_msg}`}>
          <span style={checkid ? {'color': '#0b5ed7'} : {'color': 'red', 'fontStyle':'italic'}}>{id_msg}</span>
        </p>

      <Form.Group controlId="joinUserpw">
        <Form.Label className={styles.option_title}>비밀번호*</Form.Label>
        <Form.Control type="password" placeholder="비밀번호" name="userpw" 
          onChange={onChange} value={userpw} ref={el => (inputRef.current[2]=el)} />
      </Form.Group>
      <Form.Control type="password" placeholder="비밀번호 확인" name="checkpw" onChange={checkPassword} value={checkpw} />
        <p className={`mb-2 ${styles.error_msg}`}>
          { userpw!=="" || checkpw!=="" ? 
            (checkpw===userpw ? <span style={{'color': '#0b5ed7'}}>비밀번호가 일치합니다.</span>:<span style={{'color': 'red', 'fontStyle':'italic'}}>비밀번호가 일치하지 않습니다.</span>) : "" }
        </p>

      <Form.Group className="mb-4" controlId="joinemail">
        <Form.Label className={styles.option_title}>E-mail*</Form.Label>
        <Form.Control type="text" placeholder="email@example.com" name="email" 
          onChange={onChange} value={email} ref={el => (inputRef.current[3]=el)} />
      </Form.Group>

      <Form.Group className="mb-4" controlId="joinphone">
        <Form.Label className={styles.option_title}>휴대폰번호*</Form.Label>
        <Form.Control type="text" placeholder="숫자만 입력" name="phone" 
          onChange={onChange} value={phone} ref={el => (inputRef.current[4]=el)} />
      </Form.Group>

      <Form.Group className="mb-4" style={{"overflow": "hidden"}} controlId="joinUseragree">
        <Form.Label className={styles.option_title}>약관동의*</Form.Label>
        <p className={`mb-2 ${styles.agreement}`}>
          1. 약관내용 약관내용 약관내용 약관내용 약관내용 약관내용 약관내용 약관내용 약관내용 약관내용<br/>
          2. 약관내용 약관내용 약관내용 약관내용 약관내용<br/>
          3. 약관내용 약관내용 약관내용 약관내용 약관내용<br/>
        </p>
        <Form.Check inline className={styles.agreeLabel} type="checkbox" label="약관에 동의합니다." name="agree" 
          onChange={onChangeA} checked={agree} ref={el => (inputRef.current[5]=el)} />
      </Form.Group>

      <div className={`container ${styles.btn_container}`} style={{"clear": "both"}}>
        <div className="row">
          <Button variant="outline-secondary" onClick={moveBack} className='col fs-5' style={{'marginRight': '5px'}}>
            이전
          </Button>
          <Button variant="primary" onClick={joinComplete} className='col fs-5'>
            가입하기
          </Button>
        </div>
        </div>
    </div>
  )
}

export default JoinForm