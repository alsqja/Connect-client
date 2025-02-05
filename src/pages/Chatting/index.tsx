import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { userState } from "../../stores/session";
import {
  connectStompClient,
  sendMessage,
  useFetchChatHistory,
  formatDateTimeWithRegex,
} from "../../hooks/chattingApi";
import { Client } from "@stomp/stompjs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IChatRes } from "./data";
import { ReportModal } from "../UserSchedule/ReportModal";
import { NotFound } from "../NotFound";

export const Chatting = () => {
  const location = useLocation();
  const { matchingId } = location.state;

  const navigate = useNavigate();
  const [chatList, setChatList] = useState<IChatRes[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [getReq, getRes] = useFetchChatHistory();
  const user = useRecoilValue(userState);
  const accessToken = user?.accessToken;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [reportModal, setReportModal] = useState(false);

  const { roomId } = useParams();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatList]);

  useEffect(() => {
    if (roomId) {
      getReq(roomId);
    }
  }, [roomId]);

  useEffect(() => {
    if (getRes.data && getRes.called) {
      setChatList(getRes.data.data.reverse());
    }
  }, [getRes]);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const initializeChat = async () => {
      if (roomId) {
        const stompClient = connectStompClient(roomId, (message) => {
          setChatList((prevChatList) => [...prevChatList, message]);
        });
        setClient(stompClient);
      }
    };

    initializeChat();

    return () => {
      client
        ?.deactivate()
        .catch((err: any) => console.error("Error during deactivation", err));
    };
  }, [accessToken, roomId]);

  const handleSendMessage = (message: string) => {
    if (
      client &&
      roomId &&
      user &&
      user.id !== null &&
      user.name !== null &&
      user.email !== null
    ) {
      sendMessage(client, roomId, {
        senderId: user.id,
        name: user.name,
        email: user.email,
        profileUrl: user.profileUrl || "",
        message,
      });
    } else {
      console.error(
        "User information is incomplete or client/roomId is missing."
      );
    }
  };

  if (!matchingId) {
    return <NotFound />;
  }

  return (
    <MsgerWrapper>
      <MsgHeader>
        <div className="msger-header-title">SimpleChat</div>
      </MsgHeader>
      <ChatWrapper ref={scrollRef}>
        {chatList &&
          chatList.length > 0 &&
          chatList.map((chat, index) => (
            <Chat key={index} isRight={chat.senderId === user?.id}>
              <div className="msg-img">
                <img src={chat.profileUrl} alt={chat.name} />
              </div>
              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">{chat.name}</div>
                  <div className="msg-info-time">
                    {formatDateTimeWithRegex(chat.createdAt)}
                  </div>
                </div>
                <div className="msg-text">{chat.message}</div>
              </div>
            </Chat>
          ))}
      </ChatWrapper>
      <MsgerInputarea
        onSubmit={(e) => {
          e.preventDefault();
          const inputElement =
            document.querySelector<HTMLInputElement>(".msger-input");
          if (inputElement && inputElement.value.trim()) {
            handleSendMessage(inputElement.value);
            inputElement.value = "";
          }
        }}
      >
        <ReportButton onClick={() => setReportModal(true)}>신고</ReportButton>
        <input
          className="msger-input"
          type="text"
          placeholder="Enter your message..."
        />
        <button type="submit" className="msger-send-btn">
          전송
        </button>
      </MsgerInputarea>
      {reportModal && (
        <ReportModal
          onClose={() => setReportModal(false)}
          matchingId={matchingId}
        />
      )}
    </MsgerWrapper>
  );
};

const MsgerWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  width: 100%;
  max-width: 867px;
  margin: 25px 10px;
  height: 80vh;
  border: 2px solid #ddd;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 15px 15px -5px rgba(0, 0, 0, 0.2);
`;

const MsgHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 2px solid #ddd;
  background: #eee;
  color: #666;
`;

const ChatWrapper = styled.div`
  flex: 1;
  overflow-y: auto; /* 수직 스크롤 활성화 */
  scroll-behavior: smooth; /* 스크롤 움직임을 부드럽게 */
  padding: 10px;

  background-color: #fcfcfe;
  // background-image: url("../../assets/images/ chat_background.svg"});
  // background-size: contain; /* 또는 cover */
  // background-repeat: no-repeat;
  // background-position: center;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #ddd;
  }
  &::-webkit-scrollbar-thumb {
    background: #bdbdbd;
  }
`;

const Chat = styled.div<{ isRight: boolean }>`
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
  flex-direction: ${({ isRight }) => (isRight ? "row-reverse" : "row")};

  &:last-of-type {
    margin: 0;
  }

  .msg-img {
    width: 50px;
    height: 50px;
    margin: 0px 10px;
    background: #ddd;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 50%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  .msg-bubble {
    max-width: 450px;
    padding: 15px;
    border-radius: 15px;
    color: ${({ isRight }) => (isRight ? "white" : "black")};
    background-color: ${({ isRight }) => (isRight ? "#579ffb" : "#ececec")};
  }

  .msg-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .msg-info-name {
    margin-right: 10px;
    font-weight: bold;
  }

  .msg-info-time {
    font-size: 0.85em;
  }
`;

const MsgerInputarea = styled.form`
  display: flex;
  padding: 10px;
  border-top: var(--border);
  background: #eee;

  & * {
    padding: 10px;
    border: none;
    border-radius: 3px;
    font-size: 1em;
  }

  .msger-input {
    flex: 1;
    background: #ddd;
  }

  .msger-send-btn {
    width: 80px;
    margin-left: 10px;
    background: #579ffb;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.23s;
  }

  .msger-send-btn:hover {
    background: rgb(36, 116, 219);
  }
`;

const ReportButton = styled.div`
  background: transparent;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  margin-right: 10px;
  font-size: 1.2em;

  &:hover {
    color: #d9363e;
  }
`;
