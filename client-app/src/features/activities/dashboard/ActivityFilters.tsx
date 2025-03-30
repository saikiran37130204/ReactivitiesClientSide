import Calendar from "react-calendar";
import { useSelector } from "react-redux";
import { Header, Menu } from "semantic-ui-react";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import {
  fetchActivitiesRequest,
  setFilters,
  setPredicate,
} from "../../../redux/Slice/ActivitiesSlice";
import {  useCallback } from "react";

export default function ActivityFilters() {
  const dispatch = useDispatch();
  const { predicate } = useSelector((state: RootState) => state.activities);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (type: keyof typeof predicate, value: boolean | Date) => {
      dispatch(setPredicate({ predicate: type, value }));
      dispatch(setFilters());
      dispatch(fetchActivitiesRequest());
    },
    [dispatch]
  );

  
  return (
    <>
      <Menu
        vertical
        size="large"
        style={{ width: "100%", marginTop: 25, borderRadius: 5 }}
      >
        <Header icon="filter" attached color="teal" content="Filters" />
        <Menu.Item
          content="All Activities"
          active={!!predicate.all}
          onClick={() => handleFilterChange("all", true)}
        />
        <Menu.Item
          content="I'm going"
          active={!!predicate.isGoing}
          onClick={() => handleFilterChange("isGoing", true)}
        />
        <Menu.Item
          content="I'm hosting"
          active={!!predicate.isHost}
          onClick={() => handleFilterChange("isHost", true)}
        />
      </Menu>
      <Header />
      <Calendar
        onChange={(date) => handleFilterChange("startDate", date as Date)}
        value={predicate.startDate || new Date()}
      />
    </>
  );
}