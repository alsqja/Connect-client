import { useCallback, useEffect, useRef, useState } from "react";

export const useSSE = (url: string, eventHandler: any, maxRetries = 5) => {
  const eventSourceRef = useRef<EventSource | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const connect = useCallback(() => {
    if (retryCount >= maxRetries) {
      console.warn("SSE 재연결 최대 횟수 초과");
      return;
    }

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("SSE 연결 성공");
      setRetryCount(0); // 성공 시 재시도 카운트 초기화
    };

    eventSource.onmessage = (event) => {
      if (eventHandler) eventHandler(event);
    };

    eventSource.onerror = () => {
      console.error("SSE 연결 오류, 재연결 시도 중...");
      eventSource.close();

      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        connect();
      }, Math.min(1000 * 2 ** retryCount, 30000)); // 최대 30초까지 대기
    };
  }, [eventHandler, maxRetries, retryCount, url]);

  useEffect(() => {
    connect();

    return () => {
      eventSourceRef.current?.close();
    };
  }, [connect, url]);
};
