import { apiRequest } from "../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { setFilterStudys, setStudys } from "../../store/CrosstabStudySlice";
import url from "../url";
import queryStructure from "../query-template";

export const useStudyList = (enableTab: string) => {
    const { apiToken } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const TestFn = async () => {
        const res = await apiRequest(url.studyListing.method, url.studyListing.endpoint, {
            apiToken: apiToken,
            selection: enableTab,
            page: 1,
        });
        dispatch(setStudys(res.response.data));
        dispatch(setFilterStudys(res.response.data));
        return res.response;
    }
    const { data: studyList = {}, isLoading: isListLoading } = queryStructure({
        queryKey: [url.studyListing.queryKey, enableTab],
        queryFn: TestFn,
        enable: !!apiToken,
    });
    return { studyList, isListLoading };
}
