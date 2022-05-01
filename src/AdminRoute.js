import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

function AdminRoute({ authenticated, component: Component }) {
  const navigate = useNavigate();
  const moveBack = () => {
    alert("접근할 수 없는 페이지입니다.")
  }
  useEffect(()=>{
    // eslint-disable-next-line eqeqeq
    if(authenticated!=1) navigate(-1);
  })

  return (
    // eslint-disable-next-line eqeqeq
    authenticated==1 ? Component : moveBack()
  )
}

export default AdminRoute