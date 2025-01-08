import styled from "styled-components";
import { IAdminUpdateUserData, IUserData, tableHeaders } from "./data";
import { Dispatch, SetStateAction } from "react";

interface IProps {
  users: IUserData[];
  setUsers: Dispatch<SetStateAction<IUserData[]>>;
  handleUpdate: (id: number, data: IAdminUpdateUserData) => void;
}
export const UserTable = ({ users, setUsers, handleUpdate }: IProps) => {
  const handleEdit = (id: number, field: string, value: string | boolean) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, [field]: value } : user
    );
    setUsers(updatedUsers);
  };

  return (
    <TableWrapper>
      <StyledTable>
        <TableHeader>
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.birth}</td>
              <td>{user.gender === "MAN" ? "남" : "여"}</td>
              <td>
                <select
                  value={user.status}
                  onChange={(e) =>
                    handleEdit(user.id, "status", e.target.value)
                  }
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </td>
              <td>{user.isActiveMatching ? "Active" : "Inactive"}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleEdit(user.id, "role", e.target.value)}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>

              <td>{user.reportCount}</td>
              <td>{user.memberType || "N/A"}</td>
              <td>{user.expiredDate || "N/A"}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>
                <select
                  value={String(user.isDeleted)}
                  onChange={(e) =>
                    handleEdit(user.id, "isDeleted", e.target.value === "true")
                  }
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUpdate(user.id, {
                      status: user.status,
                      role: user.role,
                      isDeleted: user.isDeleted,
                    })
                  }
                >
                  수정
                </button>
              </td>
            </tr>
          ))}
        </TableBody>
      </StyledTable>
    </TableWrapper>
  );
};

export const TableWrapper = styled.div`
  width: 100%;
  margin: 20px auto;
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

export const TableHeader = styled.thead`
  background-color: #f4f4f4;

  th {
    padding: 10px;
    text-align: left;
    border-bottom: 2px solid #ddd;
  }
`;

export const TableBody = styled.tbody`
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

  select {
    padding: 5px;
    font-size: 14px;
  }

  button {
    padding: 7px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
`;
