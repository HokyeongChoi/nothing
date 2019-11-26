import {useState} from 'react';
import fes from '../2019.json';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Form from '../components/Form.js';

const LeafMap = dynamic(
  () => import('../components/Map'),
  {
    ssr: false
  }
)

const Index = () => {
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
      </Head>
      <Form></Form>
      <LeafMap fes={fes} full={true}></LeafMap>
      <style jsx>{`
        
        body {
          padding: 0;
          margin: 0;
        }
        html, body {
            height: 100%;
            width: 100vw;
        }
      `}</style>
    </>
  )
};


export default Index;