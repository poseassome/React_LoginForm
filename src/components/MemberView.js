import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './MemberView.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

function MemberView() {
  const location = useLocation();
  const idx = location.state.idx;

  const [inputs, setInputs] = useState({
    username: "",
    userid: "",
    email: "",
    phone: "",
    joindate: ""
  })

  const [newpw, setNewpw] = useState("");
  const [checkpw, setCheckpw] = useState("");
  const [id_msg, setId_msg] = useState("");
  const [checkid, setCheckid] = useState(false);
  const {username, userid, email, phone, joindate} = inputs;
  
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

  const moveBack = () => {
    window.history.back();
  }

  const API1 = `http://localhost:8080/member/${idx}`;
  const API2 = `http://localhost:8080/member/update/${idx}`;
  const API_id = 'http://localhost:8080/member/id';

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

  const RegName = /^[가-힣a-zA-Z]+$/;
  const RegId = /^[a-z0-9_-]{4,20}$/;
  const RegPw = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
  const RegEmail = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
  const RegPhone = /^01[0|1|6|7|8|9]([0-9]{3,4})([0-9]{4})$/;

  const isValidName = RegName.test(username);
  const isValidId = RegId.test(userid);
  const isValidEmail = RegEmail.test(email);
  const isValidPw = RegPw.test(newpw);
  const isValidPhone = RegPhone.test(phone);

  const modifyComplete = (e) => {
    e.preventDefault();
    
    if(username==="" || !isValidName) {
      alert("이름을 확인해주세요.");
      inputRef.current[0].focus();
      return;
    } else if(userid==="" || !isValidId) {
      alert("아이디는 영문, 숫자 조합 4-20자입니다.");
      inputRef.current[1].focus();
      return;
    } 
    if(newpw !==""){
      if(!isValidPw){
        alert("비밀번호는 영문, 숫자, 특수문자를 포함한 8-25자입니다.");
        inputRef.current[2].focus();
        return;
      } else if(newpw!==checkpw) {
        alert("비밀번호를 확인해주세요.");
        inputRef.current[2].focus();
        return;
      }
    } 
    if(email==="" || !isValidEmail) {
      alert("이메일 형식이 아닙니다.");
      inputRef.current[3].focus();
      return;
    } else if(phone==="" || !isValidPhone) {
      alert("올바른 휴대폰번호를 입력하세요.");
      inputRef.current[4].focus();
      return;
    } else if(window.confirm("수정한 내용을 저장하시겠습니까?")===true) {
      updateUser();
    }
  }

  const API = `http://localhost:8080/member/${idx}`;

  const deleteMember = () => {
    if(window.confirm("해당 회원을 삭제하시겠습니까?")) {
      axios.delete(API, axiosConfig)
      .then(res => {
        if(res.data.res_code===200){
          alert("정상적으로 삭제하였습니다.");
          window.history.back();
        } else {
          alert("오류가 발생하여 삭제 실패하였습니다.");
        }
      })
      .catch(error => {
        console.log(error);
        alert("오류가 발생하여 삭제 실패하였습니다.");
      })
    }

  }

  useEffect(() => {
    fetchUser();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faArrowLeftLong} size='xl' 
        style={{'position': 'absolute', 'cursor': 'pointer'}}
        onClick={moveBack} />
      <h1 className={styles.title}>회원 상세정보</h1>

      <Form.Group className="mb-4" controlId="joinUsername">
        <Form.Label className={styles.option_title}>이름</Form.Label>
        <Form.Control type="text" placeholder="이름" name="username"
         onChange={onChange} value={username}
         ref={el => (inputRef.current[0]=el)} />
      </Form.Group>

      <Form.Group controlId="joinUserid">
        <Form.Label className={styles.option_title}>아이디</Form.Label>
        <div className={styles.idinput}>
          <Form.Control type="text" placeholder="아이디" name="userid" 
            onChange={onChange} value={userid} ref={el => (inputRef.current[1]=el)} />
          <Button variant="dark" onClick={idcheck}>중복확인</Button>
        </div>
      </Form.Group>
      <p className={`mb-2 ${styles.error_msg}`}>
        <span style={checkid ? {'color': '#0b5ed7'} : {'color': 'red', 'fontStyle':'italic'}}>{id_msg}</span>
      </p>

      <Form.Group className="mb-1" controlId="joinUserpw">
        <Form.Label className={styles.option_title}>비밀번호 수정</Form.Label>
        <Form.Control type="password" placeholder="새로운 비밀번호" name="userpw" 
          onChange={onChangePw} value={newpw} ref={el => (inputRef.current[2]=el)} />
      </Form.Group>
      <Form.Control type="password" placeholder="비밀번호 확인" name="checkpw" onChange={checkPassword} value={checkpw} />
        <p className={`mb-2 ${styles.error_msg}`}>
          { newpw!=="" || checkpw!=="" ? 
            (checkpw===newpw ? <span style={{'color': '#0b5ed7'}}>비밀번호가 일치합니다.</span>:<span style={{'color': 'red', 'fontStyle':'italic'}}>비밀번호가 일치하지 않습니다.</span>) : "" }
        </p>
        
      <Form.Group className="mb-4" controlId="joinemail">
        <Form.Label className={styles.option_title}>E-mail</Form.Label>
        <Form.Control type="text" placeholder="email@example.com" name="email" 
          ref={el => (inputRef.current[3]=el)} 
          onChange={onChange} value={email} />
      </Form.Group>

      <Form.Group className="mb-4" controlId="joinphone">
        <Form.Label className={styles.option_title}>휴대폰번호</Form.Label>
        <Form.Control type="text" placeholder="숫자만 입력" name="phone" 
          ref={el => (inputRef.current[4]=el)} 
          onChange={onChange} value={phone} />
      </Form.Group>

      <Form.Group className="mb-5" controlId="joindate">
        <Form.Label className={styles.option_title}>가입일자</Form.Label>
        <Form.Control type="text" name="joindate" disabled
         value={joindate} />
      </Form.Group>

      <div className='container'>
        <div className="row">
          <Button variant="primary" className='col fs-5' style={{'marginRight': '5px'}}
            onClick={modifyComplete}>
            수정하기
          </Button>
          <Button variant="outline-danger" className='col fs-5'
            onClick={deleteMember}>
            회원 삭제
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MemberView