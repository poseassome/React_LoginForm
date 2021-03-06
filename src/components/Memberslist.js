import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import styles from './Memberslist.module.css';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faMagnifyingGlass  } from '@fortawesome/free-solid-svg-icons';
import Pagination from './Pagination';

import { useDispatch, useSelector } from 'react-redux';
import { changePage, changeType, changeWord } from '../Redux/action';

function Memberslist() {
  const [members, setMembers] = useState();
  // const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);

  const type = useSelector(store => store.typeReducer)
  const word = useSelector(store => store.wordReducer)
  const selpage = useSelector(store => store.pageReducer)

  const [keyword, setKeyword] = useState(word ? word : "");
  const [selected, setSelected] = useState(type ? type : "username");
  const [page, setPage] = useState(selpage ? selpage : 1);

  const dispatch = useDispatch();


  const keywordChange = (e) => {
    setKeyword(e.target.value);
  }

  const handleChangeSelect = (e) => {
    setSelected(e.target.value);
  }

  const API = 'http://localhost:8080/member/list';
  const axiosConfig = {
    headers:{
      "Content-Type": "application/json"
    }
  }

  const getMembers = () => {
    axios.get(API, {
      params: {
        page: page,
        limit: limit,
        type: selected,
        word: keyword,
      }
    })
      .then(res => {
        setMembers(res.data.data);
        setCount(res.data.total_count);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handlePageChange = (page) => {
    setPage(page);
  }

  useEffect(() => {
    getMembers();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const moveBack = () => {
    dispatch(changeType(""));
    dispatch(changeWord(""));
    dispatch(changePage(""));

    window.history.back();
  }

  const searchUser = (e) => {
    // e.preventDefault();
    dispatch(changeType(selected));
    dispatch(changeWord(keyword));
    setPage(1)
    // dispatch(changePage(1));
    console.log(selected, keyword, page)
    getMembers();
  }

  const saveValue = () => {
    dispatch(changeType(selected));
    dispatch(changeWord(keyword));
    dispatch(changePage(page));
  }

  const deleteMember = (idx) => {
    if(window.confirm("?????? ????????? ?????????????????????????")) {
      axios.delete(`http://localhost:8080/member/${idx}`, axiosConfig)
      .then(res => {
        if(res.data.res_code===200){
          alert("??????????????? ?????????????????????.");
          window.location.reload();
        } else {
          alert("????????? ???????????? ?????? ?????????????????????.");
        }
      })
      .catch(error => {
        console.log(error);
        alert("????????? ???????????? ?????? ?????????????????????.");
      })
    }
    
  }

  const onCheckEnter = (e) => {
    if(e.key === 'Enter') {
      searchUser();
    }
  }

  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faArrowLeftLong} size='xl' 
        style={{'position': 'absolute', 'cursor': 'pointer'}}
        onClick={moveBack} />
      <h1 className={styles.title}>?????? ??????</h1>

      <div>
        <Form.Group className={`mb-4 ${styles.searchwrap}`} controlId="Form.ControlsearchInput"
          onKeyPress={onCheckEnter}>
          <Form.Select style={{'fontWeight': '600'}} onChange={handleChangeSelect}
            defaultValue={type!=='' ? type : null}>
            <option value='username'>??????</option>
            <option value='userid'>?????????</option>
            <option value='phone'>???????????????</option>
          </Form.Select>
          <Form.Control type="text" placeholder="?????? / ????????? / ?????????????????? ??????"
            value={keyword} onChange={keywordChange} />
          <Button variant="dark" onClick={searchUser}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </Button>
        </Form.Group>
      </div>

      <table className="table table-hover">
        <thead style={{'fontWeight': '700', 'textAlign': 'center', 'fontSize': '18px'}}>
          <tr>
            <th>No</th>
            <th>??????</th>
            <th>?????????</th>
            <th>?????????</th>
            <th>???????????????</th>
            <th>?????????</th>
            <th>??????</th>
          </tr>
        </thead>
        <tbody style={{'textAlign': 'center'}}>
          { 
            !members ?
            <tr style={{'--bs-table-hover-bg': 'none', 'height': '48px'}}>
              <td colSpan='7' style={{'verticalAlign': 'middle'}}>?????? ????????? ???????????? ????????????.</td>
            </tr>
            :
            members &&
            members.map((member, index) => 
              <tr key={member.idx} className={styles.listtr}>
                <td>
                  {
                    (page-1)*limit+(index+1)
                  }
                  </td>
                <td>
                  <Link to={'/memberview'}
                    state={{idx: member.idx}}
                    className={styles.link}
                    onClick={saveValue}>{member.username}</Link>
                  </td>
                <td>{member.userid}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>{member.joindate}</td>
                <td>
                <Button variant="outline-primary" size='sm'
                  onClick={(e) => deleteMember(member.idx, e)}>????????????</Button>
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
      <Pagination 
        currentPage={page} 
        limit={limit} 
        count={count} 
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default Memberslist