import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import fes from '../../2019.json';
import FullWidthTabs from '../../components/FullWidthTabs';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import getTime from '../../lib/getTime';
import ErrorPage from 'next/error';


const Info = ({ fe, res, err }) => {
  if (err) {
    return <ErrorPage statusCode={err} />
  }

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#8ebdd8',
        contrastText: 'white'
      }
    },
  });

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
          integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
          crossorigin="" />

        <script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js"
          integrity="sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og=="
          crossorigin=""></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>
      <ThemeProvider theme={theme}>
        <FullWidthTabs fe={fe} res={res} fes={fes}></FullWidthTabs>
      </ThemeProvider>

    </>
  )
}

Info.getInitialProps = async function (context) {
  const searchLin = (qid) => {
    for (let festival of fes) {
      if (festival.id === qid) return festival;
    }
    return false;
  }
  const searchBin = (qid, qtime, l, r) => {
    let low = l, high = r;
    while (low <= high) {
      const mid = ~~((low + high) / 2); // there's no overflow, ~~ is for floor division
      const festival = fes[mid];
      const festivalDate = getTime(festival.date);
      // console.log(festivalDate);
      if (festival.id === qid) {
        return festival;
      } else if (festivalDate === 0 || festivalDate === qtime) {
        const res = searchBin(qid, qtime, low, mid - 1);
        if (res) return res;
        return searchBin(qid, qtime, mid + 1, high);
      } else if (festivalDate < qtime) {
        low = mid + 1;
      } else { // festivalDate > qtime
        high = mid - 1;
      }
    }
    return false;
  }

  // https://stackoverflow.com/questions/26482645/number-isintegerx-which-is-created-can-not-work-in-ie/26482951
  // Polyfill for Internet Explorer
  Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
           isFinite(value) &&
           ~~(value) === value;
  };

  const qqid = context.query.id;
  
  let [qid, qtime] = qqid.split('&').map(s => Number(s));
  if (!Number.isInteger(qid) || !Number.isInteger(qtime)) {
    return {err: 400};
  }

  let fe;
  if (qtime === 0) {
    fe = searchLin(qid);
  } else {
    fe = searchBin(qid, qtime, 0, fes.length - 1);
  }
  if (!fe) return {err: 404};
  
  let res;
  try {
    try {
      res = await fetch(`https://a.seoulfestival.shop/restaurants?id=${fe.id}`);
      res = await res.json();
    } catch (error) {
      res = await fetch(`https://dollhy.pythonanywhere.com/restaurants/${fe.id}`);
      res = await res.json();
    }
  } catch (error) {
    res = [];
  }

  return {
    fe: fe,
    res: res
  };
}

export default Info;
