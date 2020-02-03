import React, {useEffect, useState} from 'react';
import fes from '../2019.json';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import TemporaryDrawer from '../components/TemporaryDrawer.js';


const LeafMap = dynamic(
  () => import('../components/LeafMap'),
  {
    ssr: false
  }
)

const Index = () => {
  const [height, setHeight] = useState(null)

  if (process.browser) {
      useEffect(() => {
        setHeight(window.innerHeight);
      }, [
          window.innerHeight
      ])
  }
  
  const resizeHandler = () => {
      setHeight(window.innerHeight);
  }

  useEffect(() => {
      window.addEventListener('resize', resizeHandler);
      resizeHandler();
      return function cleanup() {
        window.removeEventListener('resize', resizeHandler);
      };
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
                    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
                    crossorigin="" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>
      <div className="root2">
        <TemporaryDrawer fes={fes} height={height}></TemporaryDrawer>
        <div className="tabs"></div>
      </div>
      <LeafMap fes={fes} full={true} height={height}></LeafMap>
      <style jsx global>{`
                body {
                    padding: 0;
                    margin: 0;
                }
                html, body {
                    height: 100vh;
                    width: 100vw;
                }
      `}</style>
      <style jsx>{`
                .root2 {
                  display: flex;
                  flex-direction: row;
                  color: rgba(0, 0, 0, 0.87);
                  background-color: #f5f5f5;
                  position: static;
                  min-height: 48px;
                }
                .tabs {
                  flex-grow: 0.9;
                }
      `}</style>
    </>
  )
};


export default Index;