import { useCallback, useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/User";
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

  const handleSubmit = useCallback(() => {
    postMatchingReq(id);
  }, [postMatchingReq, id]);

  useEffect(() => {
    if (!id) {
      window.location.replace("/");
      return;
    }
    getReq(id);
  }, [id]);

  useEffect(() => {
    if (getRes.data && getRes.called) {
      setSchedule(getRes.data.data);
    }
  }, [getRes]);

  if (!schedule) {
    return <UserLayout>로딩중</UserLayout>;
  }

  return (
    <UserLayout>
      <ScheduleDetail id={id} title={schedule.title} date={schedule.date} />
      <ScheduleMatching
        id={id}
        handleSubmit={handleSubmit}
        postMatchingRes={postMatchingRes}
        schedule={schedule}
      />
    </UserLayout>
  );
};
