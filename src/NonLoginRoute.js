import React from 'react';
import { Navigate } from 'react-router-dom';

function NonLoginRouteRoute({ authenticated, component: Component }) {
  return (
    authenticated ? <Navigate to='/mypage' /> : Component
  )
}

export default NonLoginRouteRoute