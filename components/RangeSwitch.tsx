import { FormControlLabel, Switch } from "@material-ui/core";
import React, { useState } from "react";

type Props = {
  disableSlider: (checked: boolean) => void;
};

const RangeSwitch: React.FC<Props> = ({ disableSlider }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setChecked(checked);
    disableSlider(checked);
  };

  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={handleChange}
          value="checked"
          color="primary"
        />
      }
      label="기간 별"
    />
  );
};

export default RangeSwitch;
