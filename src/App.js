import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Reset } from 'styled-reset';
import { Routes, Route } from 'react-router-dom';

import NonLoginRoute from './NonLoginRoute';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

import UserPage from './components/UserPage';
import UserInfopage from './components/UserInfopage';
import UserDelete from './components/UserDelete';
import Memberslist from './components/Memberslist';
import LoginForm from './components/LoginForm';
import JoinForm from './components/JoinForm';
import FindId from './components/FindId';
import FindPw from './components/FindPw';
import MemberView from './components/MemberView';

function App() {
  const access = localStorage.getItem('idx');

  const [user, setUser] = useState(null);

  useEffect(() => {
    if(access !== '' || access !== 'undefined') {
      setUser(access);
    }
  }, [access])

  return (
    <div className="App">
      <React.Fragment>
        <Reset />
          <Routes>
            {/* NonLogin */}
            <Route 
              path='/' 
              element={
                <NonLoginRoute 
                  authenticated={access}
                  component={<LoginForm />}
                />
              } 
            />
            <Route 
              path='/join' 
              element={
                <NonLoginRoute 
                  authenticated={access}
                  component={<JoinForm />}
                />
              } 
            />
            <Route 
              path='/findId' 
              element={
                <NonLoginRoute 
                  authenticated={access}
                  component={<FindId />}
                />
              } 
            />
            <Route 
              path='/findPw' 
              element={
                <NonLoginRoute 
                  authenticated={access}
                  component={<FindPw />}
                />
              } 
            />


            {/* Private */}
            <Route
              path="/mypage"
              element={
                <PrivateRoute 
                  authenticated={access}
                  component={<UserPage />}
                />
              }
            />
            <Route
              path="/myinfo"
              element={
                <PrivateRoute 
                  authenticated={access}
                  component={<UserInfopage />}
                />
              }
            />
            <Route
              path="/delete"
              element={
                <PrivateRoute 
                  authenticated={access}
                  component={<UserDelete />}
                />
              }
            />


            {/* Admin */}
            <Route
              path="/memberslist"
              element={
                <AdminRoute 
                  authenticated={access}
                  component={<Memberslist />}
                />
              }
            />
            <Route
              path="/memberview"
              element={
                <AdminRoute 
                  authenticated={access}
                  component={<MemberView />}
                />
              }
            />

          </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
