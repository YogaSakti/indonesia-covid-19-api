import { NowResponse } from "@now/node";

import { fetchAllKasus } from "../../util/fetcher";

export default async (_, response: NowResponse) => {
  response.json({
    warning: `The data source for this endpoint is no longer being maintained. See https://twitter.com/salmayarista/status/1240959718580826113`,
    data: await fetchAllKasus()
  });
};
