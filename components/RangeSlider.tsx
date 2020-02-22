import DateFnsUtils from "@date-io/date-fns";
import { Paper, Slider, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import koLocale from "date-fns/locale/ko";
import L from "leaflet";
import React, { useEffect, useState } from "react";
import RangeSwitch from "./RangeSwitch";

type Props = {
  map: L.Map;
  handleFilter: (value: number | number[]) => void;
  handleOff: () => void;
  handleOn: () => void;
};

const useStyles = makeStyles({
  root: {
    width: 300
  },
  paper: {
    opacity: 0.75,
    padding: "1rem"
  }
});

const getNumber = (date: Date): number => {
  return (date.getFullYear() - 2019) * 12 + date.getMonth();
};

const getSemantics = (value: number): string => {
  const year = 2019 + ~~(value / 12);
  const month = (value % 12) + 1;
  return `${year}.${month}`;
};

const max = getNumber(new Date());

const ValueLabelComponent = (props: {
  children: any;
  open: any;
  value: any;
}) => {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
};

const RangeSlider: React.FC<Props> = ({
  map,
  handleFilter,
  handleOff,
  handleOn
}) => {
  const classes = useStyles({});
  const [value, setValue] = useState([max, max]);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (!disabled) handleFilter(value);
  }, [value]);

  const handleChange = (
    _: React.ChangeEvent<{}>,
    newValue: number | number[]
  ) => {
    setValue(newValue as number[]);
  };

  const handleMouseDown = (
    _: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    map.dragging.disable();
    function unregister() {
      map.dragging.enable();
      window.removeEventListener("mouseup", unregister);
    }
    window.addEventListener("mouseup", unregister);
  };

  const handleTouchStart = (_: React.TouchEvent<HTMLSpanElement>) => {
    map.dragging.disable();
    function unregister() {
      map.dragging.enable();
      window.removeEventListener("touchend", unregister);
    }
    window.addEventListener("touchend", unregister);
  };

  const handleDateChangeL = (date: MaterialUiPickersDate) => {
    setValue([getNumber(date as Date), value[1]]);
  };

  const handleDateChangeH = (date: MaterialUiPickersDate) => {
    setValue([value[0], getNumber(date as Date)]);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <RangeSwitch
          disableSlider={checked => {
            setDisabled(!checked);
            if (checked) {
              setValue(value);
              handleFilter(value);
              handleOn();
            } else {
              handleOff();
            }
          }}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={koLocale}>
          <DatePicker
            views={["year", "month"]}
            helperText="부터"
            minDate={new Date("2019-01-01")}
            maxDate={getSemantics(value[1])}
            value={getSemantics(value[0])}
            onChange={handleDateChangeL}
            format="yyyy년 MM월"
            disabled={disabled}
          />
          <DatePicker
            views={["year", "month"]}
            helperText="까지"
            minDate={getSemantics(value[0])}
            maxDate={new Date()}
            value={getSemantics(value[1])}
            onChange={handleDateChangeH}
            format="yyyy년 MM월"
            disabled={disabled}
          />
        </MuiPickersUtilsProvider>
        <Slider
          value={value}
          min={0}
          max={max}
          marks={true}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          valueLabelDisplay="auto"
          valueLabelFormat={getSemantics}
          getAriaValueText={getSemantics}
          disabled={disabled}
          ValueLabelComponent={ValueLabelComponent}
        />
      </Paper>
    </div>
  );
};

export default RangeSlider;
