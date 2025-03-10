import { useCallback, useEffect, useState } from "react";
import { ScheduleDetail } from "./ScheduleDetail";
import { ScheduleMatching } from "./ScheduleMatching";
import { useGetSchedule } from "../../hooks/scheduleApi";
import { ISchedule } from "./data";
import { useCreateMatching } from "../../hooks/matchingApi";

export const UserSchedule = () => {
  const id =
    +window.location.pathname.split("/")[
    window.location.pathname.split("/").length - 1
      ];
  const [schedule, setSchedule] = useState<ISchedule>();
  const [getReq, getRes] = useGetSchedule();
  const [postMatchingReq, postMatchingRes] = useCreateMatching();

  const handleSubmit = useCallback(
    (data: any) => {
      postMatchingReq(id, data);
    },
    [postMatchingReq, id]
  );

  useEffect(() => {
    if (!id) {
      window.location.replace("/main");
      return;
    }
    getReq(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (getRes.data && getRes.called) {
      setSchedule(getRes.data.data);
    }
  }, [getRes]);

  if (!schedule) {
    return <>로딩중</>;
  }

  return (
    <>
      <ScheduleDetail
        id={id}
        title={schedule.title}
        date={schedule.date}
        details={schedule.details}
      />
      <ScheduleMatching
        id={id}
        handleSubmit={handleSubmit}
        postMatchingRes={postMatchingRes}
        schedule={schedule}
      />
    </>
  );
};
