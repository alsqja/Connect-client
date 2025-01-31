import { Client, StompSubscription } from "@stomp/stompjs";
import axios from "axios";
import { IChat } from "../pages/Chatting/data";
import { useAxios } from "./axios";
import { useCallback } from "react";

const baseURL = "http://localhost:8080";
const socketUrl = "ws://localhost:8080/ws";
let subscription: StompSubscription | null = null;

// TODO: useAxios 코드 보고 수정 필요
// 토큰 갱신
const refreshToken = async (): Promise<string> => {
  const response = await axios.post(
    baseURL + "/api/auth/refresh",
    {},
    {
      withCredentials: true,
    }
  );
  return response.data.accessToken;
};

// 채팅방 생성 ( 매창 성사 이후 호출)
export const useCreateRoom = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (matchingId: string) => {
      return request({
        method: "POST",
        url: `/chatrooms/${matchingId}`,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

// 채팅방 조회
export const useFetchChatrooms = () => {
  const [request, response] = useAxios();

  const run = useCallback(() => {
    return request({
      method: "GET",
      url: "/chatrooms",
    });
  }, [request]);

  return [run, response] as [typeof run, typeof response];
};

// 채팅 내역 조회
export const useFetchChatHistory = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (roomId: string) => {
      return request({
        method: "GET",
        url: `/chatrooms/history/${roomId}`,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

// 소캣 연결
export const connectStompClient = (
  roomId: string,
  onMessageReceived: (message: IChat) => void
): Client => {
  const client = new Client({
    brokerURL: socketUrl,
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    },
    onConnect: () => {
      console.log("Connected to STOMP");

      // 기존 구독이 있는 경우 해제
      if (subscription) {
        subscription.unsubscribe();
      }

      // 새로운 구독 설정
      subscription = client.subscribe(
        `/sub/chats/room/${roomId}`,
        (message) => {
          onMessageReceived(JSON.parse(message.body));
        }
      );
    },
    onStompError: async (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
      if (frame.headers["message"] === "401 Unauthorized") {
        const newAccessToken = await refreshToken();
        localStorage.setItem("accessToken", newAccessToken);

        // 기존 클라이언트 비활성화 후 재연결
        if (client.active) {
          await client.deactivate();
        }
        connectStompClient(roomId, onMessageReceived);
      }
    },
  });

  client.activate();

  return client;
};

// 메세지 발급(송신)
export const sendMessage = (client: Client, roomId: string, message: IChat) => {
  client.publish({
    destination: `/pub/chats/room/${roomId}`,
    body: JSON.stringify(message),
  });
};

// 시간 포맷 변경
export const formatDateTimeWithRegex = (input: string): string | null => {
  const match = input.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);

  if (match) {
    return `${match[1]} ${match[2]}`;
  }

  // 입력 형식이 잘못되었을 경우 null 반환
  return null;
};
