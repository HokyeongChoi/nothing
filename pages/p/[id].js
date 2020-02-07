import fetch from "isomorphic-unfetch";
import fes from "../../2019.json";
import FullWidthTabs from "../../components/FullWidthTabs";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import getTime from "../../lib/getTime";
import ErrorPage from "next/error";
import Helmet from "../../components/Helmet.js";

const Info = ({ fe, res, err }) => {
  if (err) {
    return <ErrorPage statusCode={err} />;
  }

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#8ebdd8",
        contrastText: "white"
      }
    }
  });

  return (
    <>
      <Helmet />
      <ThemeProvider theme={theme}>
        <FullWidthTabs fe={fe} res={res} fes={fes}></FullWidthTabs>
      </ThemeProvider>
    </>
  );
};

Info.getInitialProps = async function(context) {
  const searchLin = qid => {
    for (let festival of fes) {
      if (festival.id === qid) return festival;
    }
    return false;
  };
  const searchBin = (qid, qtime, l, r) => {
    let low = l,
      high = r;
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
      } else {
        // festivalDate > qtime
        high = mid - 1;
      }
    }
    return false;
  };

  // https://stackoverflow.com/questions/26482645/number-isintegerx-which-is-created-can-not-work-in-ie/26482951
  // Polyfill for Internet Explorer
  Number.isInteger =
    Number.isInteger ||
    function(value) {
      return typeof value === "number" && isFinite(value) && ~~value === value;
    };

  const qqid = context.query.id;

  const [qid, qtime] = qqid.split("&").map(s => Number(s));
  if (!Number.isInteger(qid) || !Number.isInteger(qtime)) {
    return { err: 400 };
  }

  let fe;
  if (qtime === 0) {
    fe = searchLin(qid);
  } else {
    fe = searchBin(qid, qtime, 0, fes.length - 1);
  }
  if (!fe) return { err: 404 };

  let res;
  try {
    try {
      res = await fetch(`https://a.seoulfestival.shop/restaurants?id=${fe.id}`);
      res = await res.json();
    } catch (error) {
      res = await fetch(
        `https://dollhy.pythonanywhere.com/restaurants/${fe.id}`
      );
      res = await res.json();
    }
  } catch (error) {
    res = [];
  }

  return {
    fe: fe,
    res: res
  };
};

export default Info;
