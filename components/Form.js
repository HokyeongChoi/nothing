import Link from 'next/link'
import { useEffect } from 'react';

const Form = () => {

    Date.prototype.toDateInputValue = (function () {
        let local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0, 10);
    });

    return (
        <>
            <div className="dropdown">
                <span>축제검색</span>
                <div className="dropdown-content">
                    <label htmlFor="male">
                        <input type="radio" name="gender" value="male" id="male"></input>
                        남자
      </label>
                    <label htmlFor="female">
                        <input type="radio" name="gender" value="female" id="female"></input>
                        여자
      </label><br></br>
                    나이:
      <input type="text" id="age"></input><br></br>
                    관심사:
      <input type="text" id="interest"></input><br></br>
                    날짜:
      <input type="date" defaultValue={new Date().toDateInputValue()} id="date"></input><br></br>
                    <Link href="fest">
                        <button>축제 검색</button>
                    </Link>
                </div>
            </div>
            <style jsx>{`
        .dropdown {
          position: relative;
          display: inline-block;
        }
        .dropdown-content {
          display: none;
          position: absolute;
          background-color: #f9f9f9;
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
          padding: 12px 16px;
          z-index: 600;
        }
        .dropdown:hover .dropdown-content {
          display: block;
        }
        
      `}</style>
        </>
    )
}

export default Form;