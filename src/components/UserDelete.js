import React from 'react';
import styles from './UserDelete.module.css';
import { Button } from 'react-bootstrap';
import axios from 'axios';

function UserDelete() {

  const moveBack = () => {
    window.history.back();
  }

  const idx = localStorage.getItem('idx');
  const API = `http://localhost:8080/member/${idx}`;

  const axiosConfig = {
    headers:{
      "Content-Type": "application/json"
    }
  }

  const deleteComplete = () => {
    axios.delete(API, axiosConfig)
      .then(res => {
        console.log(res.data);
        if(res.data.res_code===200){
          localStorage.removeItem('idx');
          alert("정상적으로 탈퇴하였습니다.");
          window.location.replace('/');
        } else {
          alert("오류가 발생하여 탈퇴 실패하였습니다.");
        }
      })
      .catch(error => {
        console.log(error);
        alert("오류가 발생하여 탈퇴 실패하였습니다.");
      })
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원 탈퇴</h1>
      <p className='fs-5 fw-bolder lh-base text-center mb-4'>탈퇴 후 회원정보가 모두 삭제됩니다.<br/>계속 진행하시겠습니까?</p>
      <div className='container'>
        <div className="row">
          <Button variant="outline-secondary" className={`col lh-sm ${styles.btn}`} style={{'marginRight': '5px'}}
            onClick={moveBack}>
            아니요.<br/>(이전으로)
          </Button>
          <Button variant="danger" className={`col lh-sm ${styles.btn}`}
            onClick={deleteComplete}>
            예,<br/>탈퇴하겠습니다.
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserDelete