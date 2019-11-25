import fetch from 'isomorphic-unfetch';
import Link from 'next/link';

const FesList = ({ fes }) => {

    return (
        <div>
            <p>찾는 축제 목록</p>
            <ul>
                {fes.map((fes, idx) => {
                    return (
                        <li key={idx}>
                            <Link href="p/[id]" as={`p/${JSON.stringify({
                                id: fes.id,
                                name: fes.name,
                                x: fes.x,
                                y: fes.y
                                
                            })}`}>
                                <a>
                                    <h1>{fes.name}</h1>
                                    <img src={`/img/${fes.id}.jpg`}></img>
                                </a>
                            </Link>
                        </li>
                    )
                })}

            </ul>
            <style jsx>{`
                
                p {
                    margin-left: 4vw;
                    margin-top: 7vw;
                }
                li, img {
                    width: 80vw;
                }
                a {
                    text-decoration: none;
                    color: black;
                }
                li {
                    list-style-type: none;
                    border: solid;
                    margin-bottom: 2vw;
                }
                
            `}</style>
        </div>
    )
}

FesList.getInitialProps = async function () {

    const response = await fetch(`https://dollhy.pythonanywhere.com/festival`);
    let fes = await response.json();
    const re = /\b(\d{1,2})(\.|월)\s?(\d{1,2})/g;
    const arr = [];
    for (let f of fes) {
        let matches = re.exec(f.period);
        if (!matches) continue;
        let last = [Number(matches[1]), Number(matches[3])];
        while (matches = re.exec(f.period)) {
            let temp = [Number(matches[1]), Number(matches[3])];
            if (last[0] * 40 + last[1] > temp[0] * 40 + temp[1]) {
                last = temp;
            }
        }
        f.date = { month: last[0], day: last[1] };
        arr.push(f);
    }
    arr.sort((a, b) => {
        if (a.date.month * 40 + a.date.day < b.date.month * 40 + b.date.day) {
            return -1
        } else {
            return a.date.month * 40 + a.date.day > b.date.month * 40 + b.date.day ? 1 : 0;
        }
    });
    fes = arr;

    return {
        fes: fes
    };
}

export default FesList;