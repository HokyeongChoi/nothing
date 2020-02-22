import {
  Checkbox,
  FormControlLabel,
  Input,
  InputLabel
} from "@material-ui/core";

const Form = ({ searchHandler, prevHandler }) => {
  return (
    <>
      <div className="dropdown">
        <InputLabel htmlFor="search">축제검색: </InputLabel>
        <Input
          id="search"
          onInput={e => {
            searchHandler(e.target.value);
          }}
        />
        <br />
        <FormControlLabel
          control={
            <Checkbox
              onChange={e => {
                prevHandler(e.target.checked);
              }}
              color="primary"
            />
          }
          label="지난 축제"
        />
        <style jsx>{`
          .dropdown {
            padding: 4%;
          }
        `}</style>
      </div>
    </>
  );
};

export default Form;
