import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CrosstabHeader from "../components/common/Crosstab/CrosstabHeader";
import type { RootState } from "../store/store";
import { setBanners } from "../store/CrossTabDataSlice";
import Crosstab from "../components/common/Crosstab/crosstab";

const Cross_Tab_Page = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const { BannersAll } = useSelector(
    (state: RootState) => state.crossTabData
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filtered = searchTerm.trim()
        ? BannersAll.filter((banner) =>
            banner.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : BannersAll;

      dispatch(setBanners(filtered));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, BannersAll, dispatch]);

  return (
    <div className="min-h-screen px-3">
      <CrosstabHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Crosstab/>
    </div>
  );
};

export default Cross_Tab_Page;