import react, {useEffect} from 'react';
import Chart from 'chart.js';

let barChart;

const BarChart = ({data}) => {
    useEffect(()=>{
        if (barChart) {
            barChart.destroy();
        }
        const ctx = "bar-chart";
        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['10대', '20대', '30대', '40대', '50대', '60대'],
                datasets: [{
                    // label: '나이별예상분포',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: true,
                    text: '나이별예상분포'
                },
                legend: {
                    display: false
                },
                maintainAspectRatio: false
            }
        })
    }, [data]);
    
    return (
        <canvas id="bar-chart"></canvas>
    )
}

// const colors = ['#43A19E', '#7B43A1', '#F2317A', '#FF9824', '#58CF6C', 'black'];
// const colors = ['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f'];
// const colors = ['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02'];
// const colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c'];

// const Chart = ({ data }) => {
//     const max = Math.max(...data);
//     return (
//         <div className="outer-chart">
//             <label>나이별분포예상</label>
//             <div className="chart">
//             {data.map((size, idx) => {
//                 const color = colors[idx];
//                 return (
//                 <div
//                     className="item"
//                     key={idx}
//                     style={{
//                     backgroundColor: color,
//                     height: size/max * 100 + '%',
//                     zIndex: size*100
//                 }}
//                 >
//                     <b style={{ color: color }}>{idx+1 + "0대"}</b>
//                 </div>
//                 );
//             })}
//             </div>
//             <style jsx>{`
                
//                 .outer-chart {
//                     margin: 0;
//                     background-color: #f9f9f9;
//                     display: flex;
//                     padding: 50px;
//                     align-items: stretch;
//                 }
                
//                 .chart {
//                     margin: 0 0 0 0;
//                     display: inline-block;
//                     flex: 1;
//                     display: flex;
//                     align-items: flex-end;
//                     transform-origin: 0 100%;
//                     animation: slideUp .6s;
//                     position: relative;
//                     border-bottom: 1px solid #c2c2c2;
//                 }
    
//                 .item {
//                     background-color: #43A19E;
//                     display: inline-block;
//                     margin: 0 5px 0 0;
//                     flex: 1;
//                     transition: height 1s ease-out, width 1s ease-out;
//                     position: relative;
//                     text-align: center;
//                     border-radius: 2px 2px 0 0;
//                 }
    
//                 b {
//                     position: relative;
//                     font-family: Helvetica, sans-serif;
//                     font-size: 10px;
//                     top: -20px;
//                     color: #43A19E;
//                 }
    
//                 label {			
//                     position: absolute;
//                     left: 0;
//                     right: 0;
//                     bottom: 12px;
//                     font-family: Helvetica, sans-serif;
//                     font-size: 10px;
//                     text-align: center;
//                     color: #808080;
//                 }
    
//                 @keyframes slideUp {
//                     from { transform: scaleY(0); }
//                     to { transform: scaleY(1); }
//             `}</style>
//         </div>
//     );
// }

export default BarChart;
