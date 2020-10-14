import { NowResponse } from "@vercel/node";

import {
  fetchMeninggal,
  fetchSembuh,
  fetchDalamPerawatan,
  fetchJumlahKasus,
  fetchLastUpdate,
  fetchDataStatistik,
  fetchUpdate,
  fetchDataLain
} from "../util/fetcher";

export default async (_, response: NowResponse) => {
  // const [meninggal, sembuh, perawatan, jumlahKasus, lastUpdate] = await Promise.all([
  //   fetchMeninggal(),
  //   fetchSembuh(),
  //   fetchDalamPerawatan(),
  //   fetchJumlahKasus(),
  //   fetchLastUpdate()
  // ]);

  const [{
    perawatan,
    sembuh,
    meninggal,
    jumlahKasus
  }, dataUpdate, dataLain] = await Promise.all([
    fetchDataStatistik(),
    fetchUpdate(),
    fetchDataLain()
  ])
  response.json({
    perawatan,
    sembuh,
    meninggal,
    jumlahKasus,
    penambahan: dataUpdate,
    lainnya: dataLain,
    perKasus: {
      json: "https://indonesia-covid-19.mathdro.id/api/kasus",
      csv: "https://indonesia-covid-19.mathdro.id/api/kasus.csv",
      links: "https://indonesia-covid-19.mathdro.id/api/kasus/links.csv",
      old: "https://indonesia-covid-19.mathdro.id/api/kasus/old"
    },
    perProvinsi: {
      json: "https://indonesia-covid-19.mathdro.id/api/provinsi",
      csv: "https://indonesia-covid-19.mathdro.id/api/provinsi.csv"
    },
    perHari: {
      json: "https://indonesia-covid-19.mathdro.id/api/harian",
      csv: "https://indonesia-covid-19.mathdro.id/api/harian.csv"
    },
    wismaAtlet: {
      json: "https://indonesia-covid-19.mathdro.id/api/wisma-atlet",
      karyawan: "https://indonesia-covid-19.mathdro.id/api/wisma-atlet/karyawan",
      ruangan: "https://indonesia-covid-19.mathdro.id/api/wisma-atlet/ruangan",
      kasur: "https://indonesia-covid-19.mathdro.id/api/wisma-atlet/kasur"
    }
  });
};
