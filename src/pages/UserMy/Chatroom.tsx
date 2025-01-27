import { useEffect, useState } from "react";
import { useFetchChatrooms } from "../../hooks/chattingApi";
import { userState } from "../../stores/session";

import {
  StyledTable,
  TableBody,
  TableHeader,
  TableWrapper,
} from "../../components/StyledTable/tableStyle";
import styled from "styled-components";
import { IChatroom } from "../Chatting/data";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

export const Chatroom = () => {
  const [getReq, getRes] = useFetchChatrooms();
  const [chatrooms, setChatrooms] = useState<IChatroom[]>();
  const user = useRecoilValue(userState);
  const navigator = useNavigate();

  useEffect(() => {
    getReq();
  }, [getReq]);

  useEffect(() => {
    if (getRes.data && getRes.called) {
      setChatrooms(getRes.data.data);
    }
  }, [getRes]);

  const getChatHistory = (chatroomId: number) => {
    navigator("/chat/rooms/" + chatroomId);
  };

  const handleDelete = (chatroomId: number) => {
    console.log(`Deleting chatroom with id: ${chatroomId}`);
    // Add your delete logic here
  };

  return (
    <>
      <Title>채팅 내역</Title>
      {chatrooms && chatrooms.length > 0 ? (
        <>
          <TableWrapper>
            <StyledTable>
              <TableHeader>
                <tr>
                  <th style={{ width: "50px" }}>No</th>
                  <th style={{ width: "150px" }}>날짜</th>
                  <th style={{ width: "150px" }}>일정</th>
                  <th style={{ width: "150px" }}>상세 정보</th>
                  <th style={{ width: "250px" }}>주소</th>
                  <th style={{ width: "150px" }}>파트너</th>
                  <th style={{ width: "250px" }}>작업</th>
                </tr>
              </TableHeader>
              <TableBody>
                {chatrooms.map((chatroom, index) => (
                  <TrWrapper
                    key={chatroom.chatroomId}
                    onClick={() => {
                      getChatHistory(chatroom.chatroomId);
                    }}
                  >
                    <td>{index}</td>
                    <td>{chatroom.date}</td>
                    <td>{chatroom.title}</td>
                    <td>{chatroom.detail}</td>
                    <td>{chatroom.address}</td>
                    <td>
                      {chatroom.fromSchedueUserName === user?.name
                        ? chatroom.toSchedueUserName
                        : chatroom.fromSchedueUserName}
                    </td>
                    <td>
                      <DeleteButton
                        onClick={(e) => {
                          e.stopPropagation(); // // 부모 이벤트 실행 방지
                          handleDelete(chatroom.chatroomId);
                        }}
                      >
                        삭제
                      </DeleteButton>
                    </td>
                  </TrWrapper>
                ))}
              </TableBody>
            </StyledTable>
          </TableWrapper>
        </>
      ) : (
        <>채팅 내역이 없습니다.</>
      )}
    </>
  );
};

const TrWrapper = styled.tr`
  cursor: pointer; /* 클릭 가능한 커서 */
  user-select: none; /* 선택 방지 */
`;

const Title = styled.div`
  font-size: 25px;
  margin-bottom: 20px;
`;

const DeleteButton = styled.button`
  padding: 5px 12px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #d9363e;
  }
`;
