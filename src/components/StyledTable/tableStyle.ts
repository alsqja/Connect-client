import styled from "styled-components";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.thead`
  background-color: #f4f4f4;
  position: sticky;
  top: 0;

  th {
    padding: 10px;
    text-align: left;
    border-bottom: 2px solid #ddd;
  }

  th:nth-child(4) {
    min-width: 250px;
  }

  th:nth-child(6) {
    width: 200px;
  }

  th:nth-child(7) {
    width: 200px;
  }
`;

const TableBody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }

  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  margin: 20px auto;
  overflow-x: auto;
  background-color: white;
  max-height: calc(100vh - 300px);
  overflow-y: scroll;
`;

const OverflowTd = styled.td`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`


export { StyledTable, TableHeader, TableBody, TableWrapper, OverflowTd };
