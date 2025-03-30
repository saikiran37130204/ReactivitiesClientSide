import { Grid, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useEffect } from "react";
import {
  fetchActivitiesRequest,
  SetActivityLoaderNext,
  setPagingParams,
} from "../../../redux/Slice/ActivitiesSlice";
import ActivityFilters from "./ActivityFilters";
import InfiniteScroll from "react-infinite-scroller";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

export default function ActivityDashboard() {
  const dispatch = useDispatch();
  const { activities, pagination, LoadingNext } = useSelector(
    (state: RootState) => state.activities
  );
  const { loadingInitial } = useSelector(
    (state: RootState) => state.activities
  );

  const handleGetNext = () => {
    // Only load more if we have more pages and not currently loading
    if (
      !LoadingNext &&
      pagination &&
      pagination.currentPage < pagination.totalPages
    ) {
      const nextPage = pagination.currentPage + 1;
      dispatch(
        setPagingParams({
          pageNumber: nextPage,
          pageSize: pagination.itemsPerPage,
        })
      );
      dispatch(SetActivityLoaderNext(true));
      dispatch(fetchActivitiesRequest());
    }
  };

  // Initial load - runs only once on mount
  useEffect(() => {
    if (activities.length === 0) {
      dispatch(fetchActivitiesRequest());
    }
  }, [dispatch, activities.length]);

  console.log(loadingInitial, LoadingNext);

  return (
    <Grid>
      <Grid.Column width="10">
        {loadingInitial && activities.length === 0 && !LoadingNext ? (
          <>
            <ActivityListItemPlaceholder />
            <ActivityListItemPlaceholder />
          </>
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={
              !LoadingNext &&
              !!pagination &&
              pagination!.currentPage < pagination!.totalPages
            }
            initialLoad={false}
          >
            <ActivityList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={LoadingNext} />
      </Grid.Column>
    </Grid>
  );
}
