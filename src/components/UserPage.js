import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './UserPage.module.css';
import { Button } from 'react-bootstrap';
import axios from 'axios';

import { useDispatch } from 'react-redux';
import { changeType, changeWord } from '../Redux/action';

function UserPage() {
  const [userdata, setUserdata] = useState('');

  const idx = localStorage.getItem("idx");

  const API = `http://localhost:8080/member/${idx}`;
  const axiosConfig = {
    headers:{
      "Content-Type": "application/json"
    }
  }

  const fetchUser = () => {
    axios.get(API, axiosConfig)
      .then(res => {
        const data = res.data.data;
        setUserdata(data);
      })
      .catch(error => {
        console.log(error);
        alert("페이지 오류");
      })
  }

  const dispatch = useDispatch();

  const logout = () => {
    if(window.confirm("로그아웃하시겠습니까?")) {
      localStorage.removeItem('idx');
      dispatch(changeType(""));
      dispatch(changeWord(""));
      window.location.replace("/");
    }
  }

  useEffect(() => {
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{userdata.username}님 페이지</h1>
      <p className={`mb-3 text-center ${styles.option_title}`}>사용자 페이지</p>
      <p className='mb-5 text-center d-flex justify-content-evenly'>
        <Link to='/myinfo' className={styles.link}>회원정보수정</Link>
        {
          // eslint-disable-next-line eqeqeq
          idx == 1 ?
          <Link to='/memberslist' className={styles.link}>회원목록</Link>
          : null
        }
      </p>
      <Button variant="outline-primary" style={{'width' : '100%'}} className='fs-5'
        onClick={logout}>로그아웃</Button>
    </div>
  )
}

export default UserPage