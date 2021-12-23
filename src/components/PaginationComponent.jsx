import React, { useState, useEffect } from 'react';
import './styles.css';

const RenderData = (todos) => {
  return <ul>{todos && todos.map((todo, index) => <li key={todo.id}>{todo.id}. {todo.title}</li>)}</ul>;
};

const PaginationComponent = () => {
  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);


  const [pageNumberLimit, setPageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

  const handleClick = (e) => {
    setCurrentPage(Number(e.target.id));
  };

  const pages = [];
  for (let i = 1; i <= Math.ceil(todos.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = todos.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = pages.map((number) => {
      if(number < maxPageNumberLimit + 1 && number > minPageNumberLimit){
          return (
              <li key={number} id={number} onClick={handleClick}
                className={currentPage === number ? "active" : null}
            >
                {number}
                </li>
          )
      }else{
          return null
      }
  });

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((json) => setTodos(json));
  }, []);

  const handleNextBtn = () => {
    setCurrentPage(prev => prev + 1);
    if(currentPage + 1 > maxPageNumberLimit){
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
    
  }

  const handlePrevBtn = () => {
    setCurrentPage(prev => prev - 1);

    if((currentPage - 1) % pageNumberLimit === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  }

  let pageIncrementBtn = null;
  if(pages.length > maxPageNumberLimit) {
    pageIncrementBtn = <li onClick={handleNextBtn}> &hellip;</li>
  }

  let pageDecrementBtn = null;
  if(pages.length > maxPageNumberLimit) {
    pageDecrementBtn = <li onClick={handlePrevBtn}> &hellip;</li>
  }

  const handleLoadMore = () => {
    setItemsPerPage(prev => prev + 5)
  }

  return (
    <>
      <h1>Todos List</h1>
      <br />
      <ul className="page-numbers">
          <li>
              <button 
              onClick={handlePrevBtn}
              disabled={currentPage === pages[0] ? true : false}
              >Prev</button>
        </li>
        {pageDecrementBtn}
          {renderPageNumbers}
        {pageIncrementBtn}
          <li>
              <button 
              onClick={handleNextBtn}
              disabled={currentPage === pages[pages.length - 1] ? true : false}
              >Next</button>
        </li>

          </ul>
      <hr />
      {RenderData(currentItems)}
      <br />
      <hr />
      <button onClick={handleLoadMore} className="loadmore">
        Load more
      </button>
    </>
  );
};

export default PaginationComponent;
