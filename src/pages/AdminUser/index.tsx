import styled from "styled-components";
import { AdminLayout } from "../../components/Layout/Admin";
import { UserTable } from "./UserTable";
import { useCallback, useEffect, useState } from "react";
import { IAdminUpdateUserData, IUserData } from "./data";
import { useGetAdminUsers, useUpdateAdminUser } from "../../hooks/adminApi";
import { PaginationContainer } from "../../components/Pagination/PaginationContainer";

export const AdminUser = () => {
  const [users, setUsers] = useState<IUserData[]>([]);
  const [getUserReq, getUserRes] = useGetAdminUsers();
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [updateUserReq, updateUserRes] = useUpdateAdminUser();

  useEffect(() => {
    getUserReq(page, 10);
  }, [page]);

  useEffect(() => {
    if (getUserRes.called && getUserRes.data) {
      setUsers(getUserRes.data.data.data);
      setTotalElements(getUserRes.data.data.totalElements);
    }
  }, [getUserRes]);

  const handleUpdate = useCallback(
    (id: number, data: IAdminUpdateUserData) => {
      updateUserReq(id, data);
    },
    [updateUserReq]
  );

  useEffect(() => {
    if (updateUserRes.data && updateUserRes.called) {
      alert("수정되었습니다.");
    }
  }, [updateUserRes]);

  return (
    <AdminLayout>
      <Wrapper>
        <Title>유저 관리</Title>
        <UserTable
          users={users}
          setUsers={setUsers}
          handleUpdate={handleUpdate}
        />
        <PaginationContainer
          activePage={page}
          itemsCountPerPage={10}
          totalItemsCount={totalElements}
          pageRangeDisplayed={5}
          onPageChange={(page: number) => setPage(page)}
        />
      </Wrapper>
    </AdminLayout>
  );
};

const Wrapper = styled.div`
  width: 95%;
  background-color: white;
  height: calc(100vh - 160px);
  padding: 20px;
  overflow: scroll;
  scrollbar-width: none;
  border: 1px solid black;
  border-radius: 10px;
`;

const Title = styled.div`
  font-size: 25px;
  margin-bottom: 20px;
`;
