import unfetch from "isomorphic-unfetch";
import withRetry from "@zeit/fetch-retry";

export const fetch = withRetry(unfetch);

import { fetchFeatures, extractSingleValue } from "./data";
import { createArrayQuery, where } from "./query";
import { endpoints } from "./endpoints";
import { addDays } from "./date";
import { kasus } from "./kasus";

export const fetchDaily = (date = new Date()) => {
  const query = {
    f: "json",
    where: where.beforeToday(date),
    returnGeometry: false,
    spatialRel: `esriSpatialRelIntersects`,
    outFields: `*`,
    orderByFields: `Tanggal asc`,
    resultOffset: `0`,
    resultRecordCount: `2000`,
    cacheHint: true
  };
  return fetchFeatures(endpoints.statistikPerkembangan, query);
};

export const fetchLastUpdate = async () => {
  const query = {
    f: "json",
    returnGeometry: false,
    spatialRel: `esriSpatialRelIntersects`,
    outFields: `*`,
    cacheHint: true,
    // Temp fix using last update
    where: where.lastUpdate(),
    outStatistics: `[{statisticType: "max",onStatisticField: "Tanggal",outStatisticFieldName: "value"}]`
  };
  const result = extractSingleValue(
    await fetchFeatures(endpoints.statistikPerkembangan, query)
  );

  return result > 0 ? result : null;
};

export const fetchMeninggal = async (date = new Date()) => {
  const query = {
    f: "json",
    returnGeometry: false,
    spatialRel: `esriSpatialRelIntersects`,
    outFields: `*`,
    cacheHint: true,
    // Temp fix using last update
    where: (date) ? where.currentDay(date) : where.lastUpdate(),
    outStatistics: (date) ? `[{statisticType: "sum",onStatisticField: "Jumlah_Pasien_Meninggal",outStatisticFieldName: "value"}]` : `[{statisticType: "max",onStatisticField: "Jumlah_Pasien_Meninggal",outStatisticFieldName: "value"}]`
    // END
    // where: where.currentDay(date),
    // outStatistics: `[{statisticType: "sum",onStatisticField: "Jumlah_Pasien_Meninggal",outStatisticFieldName: "value"}]`
  };
  const result = extractSingleValue(
    await fetchFeatures(endpoints.statistikPerkembangan, query)
  );

  return result > 0 ? result : fetchMeninggal(addDays(date, -1));
};

export const fetchSembuh = async (date = new Date()) => {
  const query = {
    f: "json",
    returnGeometry: false,
    spatialRel: `esriSpatialRelIntersects`,
    outFields: `*`,
    cacheHint: true,
    // Temp fix using last update
    where: (date) ? where.currentDay(date) : where.lastUpdate(),
    outStatistics: (date) ? `[{statisticType: "sum",onStatisticField: "Jumlah_Pasien_Sembuh",outStatisticFieldName: "value"}]` : `[{statisticType: "max",onStatisticField: "Jumlah_Pasien_Sembuh",outStatisticFieldName: "value"}]`
    // END
    // where: where.currentDay(date),
    // outStatistics: `[{statisticType: "sum",onStatisticField: "Jumlah_Pasien_Sembuh",outStatisticFieldName: "value"}]`
  };
  const result = extractSingleValue(
    await fetchFeatures(endpoints.statistikPerkembangan, query)
  );

  return result > 0 ? result : fetchSembuh(addDays(date, -1));
};

export const fetchDalamPerawatan = async (date = new Date()) => {
  const query = {
    f: "json",
    returnGeometry: false,
    spatialRel: `esriSpatialRelIntersects`,
    outFields: `*`,
    cacheHint: true,
    // Temp fix using last update
    where: (date) ? where.currentDay(date) : where.lastUpdate(),
    outStatistics: (date) ? `[{statisticType: "sum",onStatisticField: "Jumlah_pasien_dalam_perawatan",outStatisticFieldName: "value"}]` : `[{statisticType: "max",onStatisticField: "Jumlah_pasien_dalam_perawatan",outStatisticFieldName: "value"}]`
    // END
    // where: where.currentDay(date),
    // outStatistics: `[{statisticType: "sum",onStatisticField: "Jumlah_pasien_dalam_perawatan",outStatisticFieldName: "value"}]`
  };
  const result = extractSingleValue(
    await fetchFeatures(endpoints.statistikPerkembangan, query)
  );

  return result > 0 ? result : fetchDalamPerawatan(addDays(date, -1));
};

export const fetchJumlahKasus = async (date = new Date()) => {
  const query = {
    f: "json",
    returnGeometry: false,
    spatialRel: `esriSpatialRelIntersects`,
    outFields: `*`,
    cacheHint: true,
    // Temp fix using last update
    where: (date) ? where.currentDay(date) : where.lastUpdate(),
    outStatistics: (date) ? `[{statisticType: "sum",onStatisticField: "Jumlah_Kasus_Kumulatif",outStatisticFieldName: "value"}]` : `[{statisticType: "max",onStatisticField: "Jumlah_Kasus_Kumulatif",outStatisticFieldName: "value"}]`
    // END
    // where: where.currentDay(date),
    // outStatistics: `[{statisticType: "sum",onStatisticField: "Jumlah_Kasus_Kumulatif",outStatisticFieldName: "value"}]`
  };
  const result = extractSingleValue(
    await fetchFeatures(endpoints.statistikPerkembangan, query)
  );

  return result > 0 ? result : fetchJumlahKasus(addDays(date, -1));
};

export const fetchProvinsiData = async (orderByFields = "Kasus_Posi desc") => {
  return fetchFeatures(
    endpoints.perProvinsi,
    createArrayQuery({
      where: where.all,
      orderByFields
    })
  );
};

export const fetchAllKasus = async () =>
  fetchFeatures(
    endpoints.kasusCOVIDGsheet,
    createArrayQuery({
      where: where.all,
      orderByFields: "Positif asc"
    })
  );

export const fetchCaseGraph = async () => {
  return (
    await fetch(
      `https://covid-monitoring2.kemkes.go.id/surveillance`
    ).then(res => res.json())
  ).sort((a, b) => (a.id_pasien < b.id_pasien ? -1 : 1));
};

export const fetchWismaAtlet = async () => {
  const stats = (
    await fetch(`https://u071.zicare.id/house/getPatientStatus`, {
      method: "POST",
      body: JSON.stringify({})
    }).then(res => res.json())
  ).recap[0];

  return Object.entries(stats).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: parseInt(value as string, 10)
    }),
    {}
  );
};

export const fetchWismaAtletRuangan = async () => {
  return await fetch(`https://u071.zicare.id/masterdata/getRuangRawat`, {
    method: "POST",
    body: JSON.stringify({}),
    headers: {
      "x-requested-with": "XMLHttpRequest"
    }
  }).then(res => res.json());
};

export const fetchWismaAtletKaryawan = async () => {
  return await fetch(`https://u071.zicare.id/masterdata/getKaryawan`, {
    method: "POST",
    body: JSON.stringify({}),
    headers: {
      "x-requested-with": "XMLHttpRequest"
    }
  }).then(res => res.json());
};

export const fetchKasur = async () => {
  return await fetch("https://u071.zicare.id/house/getBedStatus", {
    method: "POST",
    headers: {
      "x-requested-with": "XMLHttpRequest"
    },
    body: JSON.stringify({
      jns_rr: ["RU", "RA", "ICU", "HCU"]
    })
  }).then(res => res.json());
};