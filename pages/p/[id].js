import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import Restaurant from '../../components/Restaurant';
import dynamic from 'next/dynamic';

const LeafMap = dynamic(
  () => import('../../components/Map'),
  {
    ssr: false
  }
)

const Info = ({ fes, res }) => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
          integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
          crossorigin="" />

        <script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js"
          integrity="sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og=="
          crossorigin=""></script>
      </Head>
      <div className="img">
        <img src={`/img/${fes.id}.jpg`}></img>
      </div>
      <p>{fes.name}</p>
      <LeafMap fes={fes} res={res} class="map"></LeafMap>
      <ul>
        {res.map(res => {
          return (
            <li key={res.id}>
              <Restaurant res={res}></Restaurant>
            </li>
          )
        })}
      </ul>
      <footer>
                <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from
                    <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
            </footer>
      <style jsx>{`
        img {
          width: 90vw;
          border: solid;
          margin: 2vw;
        }
        p {
          margin-left: 3vw;
          margin-bottom: 5vw;
        }
        li {
          list-style-type: none;
          margin-bottom: 5vw;
        }
      `}</style>
    </>
  )
}

Info.getInitialProps = async function (context) {
  const fes = JSON.parse(context.query.id);
  const res = await fetch(`https://dollhy.pythonanywhere.com/restaurants/${fes.id}`);
  const dataRes = await res.json();

  return {
    fes: fes,
    res: dataRes
  };
}

export default Info;