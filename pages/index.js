import Link from 'next/link';


const Index = () => {

  Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
  });

  return (
    <>
      <label for="male">
        <input type="radio" name="gender" value="male" id="male"></input>
        남자
      </label>
      <label for="female">
        <input type="radio" name="gender" value="female" id="female"></input>
        여자
      </label><br></br>
      나이:
      <input type="text" value="" id="age"></input><br></br>
      관심사:
      <input type="text" value="" id="interest"></input><br></br>
      날짜:
      <input type="date" defaultValue={new Date().toDateInputValue()} id="date"></input><br></br>
      <Link href="fest">
        <button>축제 검색</button>
      </Link>
    </>
  )
};


export default Index;