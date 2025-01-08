import Pagination from "react-js-pagination";
import styled from "styled-components";
import arrow1 from "./arrow1.svg";
import arrow2 from "./arrow2.svg";
import arrow3 from "./arrow3.svg";
import arrow4 from "./arrow4.svg";

export interface IPagination {
  activePage: number;
  itemsCountPerPage: number;
  totalItemsCount: number;
  pageRangeDisplayed: number;
  onPageChange: (page: any) => void;
}

export const PaginationContainer = ({
  activePage,
  itemsCountPerPage,
  totalItemsCount,
  pageRangeDisplayed,
  onPageChange,
}: IPagination) => {
  return (
    <PaginationBox>
      <Pagination
        activePage={activePage}
        itemsCountPerPage={itemsCountPerPage}
        totalItemsCount={totalItemsCount}
        pageRangeDisplayed={pageRangeDisplayed}
        prevPageText={<img src={arrow2} alt="앞으로가기" />}
        nextPageText={<img src={arrow3} alt="뒤로가기" />}
        firstPageText={<img src={arrow1} alt="맨앞으로가기" />}
        lastPageText={<img src={arrow4} alt="맨뒤으로가기" />}
        onChange={onPageChange}
      />
    </PaginationBox>
  );
};

const PaginationBox = styled.div`
  ul {
    display: flex;
    justify-content: center;
    list-style: none;
    padding: 0;
  }

  li {
    display: inline-block;
    width: 26px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    border-radius: 2px;
    background-color: lightgray;
    margin: 0px 4px;
    cursor: pointer;

    &:first-of-type {
      display: flex;
      justify-content: center;
      background: none;
    }

    &:nth-of-type(2),
    :nth-last-of-type(2) {
      background: none;
    }

    &:last-child {
      display: flex;
      justify-content: center;
      background: none;
    }
  }

  li.active {
    background-color: #007bff;
  }

  li.active a {
    color: white;
  }

  li a:hover,
  li a.active {
    color: #464646;
  }

  a {
    text-decoration: none;
    color: #464646;
    font-size: 1rem;
  }
`;
