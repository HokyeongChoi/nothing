import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import fes from "../2019.json";
import TemporaryDrawer from "../components/TemporaryDrawer.js";

const MainMap = dynamic(() => import("../components/MainMap"), {
  ssr: false
});

const Index = () => {
  const [height, setHeight] = useState(null);
  const [init, setInit] = useState(false);


  const resizeHandler = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    resizeHandler();
    setInit(true);
    return function cleanup() {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <>
      <div className="root2">
        <TemporaryDrawer fes={fes} height={height} />
        <div className="tabs"></div>
      </div>
      {init && <MainMap fes={fes} />}
      <style jsx global>{`
        body {
          padding: 0;
          margin: 0;
        }
        html,
        body {
          height: 100vh;
          width: 100vw;
        }
        #map {
          height: ${height - 48}px;
          width: 100vw;
          z-index: 1;
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
  );
};

export default Index;
