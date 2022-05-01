/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import _ from 'lodash';
import styles from './Pagination.module.css';

function Pagination({currentPage, limit, count, onPageChange }) {
  const pageCount = Math.ceil(count / limit);
  if(pageCount ===1) return null;

  const pages = _.range(1, pageCount + 1);

  return (
    <nav className={styles.pageblock}>
      <ul className="pagination">

        {
          pages.map(page => 
            <li key={page}
              className={page === currentPage ? "page-item active" : "page-item"}
              style={{ cursor: "pointer" }}
            >
              <a className="page-link" onClick={() => onPageChange(page)}>{page}</a>
            </li>
          )
        }

      </ul>
    </nav>
  )
}

export default Pagination