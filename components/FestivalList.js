import React, { useState } from "react";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Form from "./Form";
import Link from "next/link";
import getTime from "../lib/getTime";
import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import { makeStyles } from "@material-ui/core/styles";
import FestivalImage from "./FestivalImage";

const isCurrent = fes =>
  fes.date.length > 0 &&
  (new Date().getFullYear() < fes.date[fes.date.length - 1].year ||
    (new Date().getFullYear() === fes.date[fes.date.length - 1].year &&
      new Date().getMonth() <= fes.date[fes.date.length - 1].month - 1));

const useStyles = makeStyles(() => ({
  festImg: {
    width: "50vmin",
    minWidth: "200px",
    maxWidth: "256px",
    height: "50vmin",
    maxHeight: "256px"
  }
}));

const FestivalList = ({ fes }) => {
  const [word, setWord] = useState("");
  const [prev, setPrev] = useState(false);

  const getSorted = (fes, prev) =>
    fes.filter(f => f.name.indexOf(word) != -1 && isCurrent(f) ^ prev);

  const classes = useStyles();

  return (
    <>
      <div className="fest-list-in">
        <div className="fest-list-in2">
          <Form searchHandler={setWord} prevHandler={setPrev} />
          <Divider />
          <p className="fest-list-p">찾는 축제 목록</p>
        </div>
        <div className="fest-list-in3">
          <List>
            {getSorted(fes, prev).map(fes => (
              <ListItem button key={fes.id}>
                <Link href="/p/[id]" as={`/p/${fes.id}&${getTime(fes.date)}`}>
                  <a className="fest-list-a">
                    <ListItemIcon>
                      <FestivalImage
                        className={classes.festImg + " lazyload"}
                        id={fes.id}
                      />
                    </ListItemIcon>
                    <ListItemText primary={fes.name} />
                    <span>{fes.period}</span>
                  </a>
                </Link>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
      <style jsx>{`
        .fest-list-a {
          text-decoration: none;
          color: black;
          cursor: pointer;
          background-color: #f9f9f9;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          width: 50vmin;
          min-width: 200px;
          max-width: 256px;
          padding: 4px 4px;
        }
        .fest-list-p {
          margin: 4%;
        }
        .fest-list-in {
          display: grid;
          height: inherit;
        }
        .fest-list-in2 {
          position: sticky;
          top: 0;
        }
        .fest-list-in3 {
          overflow: auto;
        }
      `}</style>
    </>
  );
};

export default FestivalList;
