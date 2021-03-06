import Head from "next/head";

export default () => (
  <>
    <Head>
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:title" content="Indonesia COVID-19 API" />
      <meta property="og:url" content="https://indonesia-covid-19.mathdro.id" />
      <meta property="og:type" content="website" />
      <meta
        property="og:description"
        content="Indonesia COVID-19 data as a service, made by @mathdroid"
      />
      <meta
        property="og:image"
        content="https://covid19.mathdro.id/api/countries/ID/og"
      />
    </Head>
    <p>Go to:</p>
    <a href="https://indonesia-covid-19.mathdro.id/api">
      https://indonesia-covid-19.mathdro.id/api
    </a>
  </>
);
