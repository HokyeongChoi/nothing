import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import Restaurant from '../../components/Restaurant';
import dynamic from 'next/dynamic';
import TemporaryDrawer from '../../components/TemporaryDrawer';
import fes from '../../2019.json';

const LeafMap = dynamic(
  () => import('../../components/Map'),
  {
    ssr: false
  }
)

const Info = ({ fe, res }) => {
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
      <TemporaryDrawer fes={fes}></TemporaryDrawer>
      <div>
        <img className="info-img" src={`/img/${fe.id}.jpg`}></img>
      </div>
      <p className="info-name">{fe.name}</p>
      <LeafMap fes={fe} res={res} class="map"></LeafMap>
      <ul>
        {res.map(res => 
          (
            <li className="info-li" key={res.id}>
              <Restaurant res={res}></Restaurant>
            </li>
          )
        )}
      </ul>
      <footer>
        <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from
                    <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
      </footer>
      <style jsx>{`
        body {
          padding: 0;
          margin: 0;
        }
        html, body {
          height: 100vh;
          width: 100vw;
        }
        .info-img {
          display: block;
          width: 90vw;
          border: solid;
          margin: 2vw;
        }
        .info-name {
          margin-left: 3vw;
          margin-bottom: 5vw;
        }
        .info-li {
          list-style-type: none;
          margin-bottom: 5vw;
        }
      `}</style>
    </>
  )
}

Info.getInitialProps = async function (context) {
  const fe = JSON.parse(context.query.id);
  const res = await fetch(`https://dollhy.pythonanywhere.com/restaurants/${fe.id}`);
  // const res = await fetch(`http://127.0.0.1:5000/restaurants/${fe.id}`);
  const dataRes = await res.json();

  return {
    fe: fe,
    res: dataRes
  };
}

export default Info;