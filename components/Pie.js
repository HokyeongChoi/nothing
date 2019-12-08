import react, {useEffect} from 'react';
import Chart from 'chart.js';

let pieChart;

const Pie = ({man}) => {
    useEffect(()=>{
        if (pieChart) {
            pieChart.destroy();
        }
        const ctx = 'pie-chart';
        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                datasets: [{
                    data: [man, 1-man],
                    backgroundColor: ['lightblue', 'pink']
                }],
                labels: [
                    '남',
                    '여'
                ]
            },
            options: {
                legend: {
                    reverse: true
                },
                maintainAspectRatio: false
            }
        })
    }, [man])
    
    return (
        <canvas id='pie-chart'></canvas>
    )
}

// const Pie = ({man}) => {
//     useEffect(()=>{
//         const canvas = document.querySelector(".pie");
//         const ctx = canvas.getContext('2d');    
//         let currentAngle = -0.5 * Math.PI;    
//         let sliceAngle = man * 2 * Math.PI;    
//         ctx.beginPath();    
//         ctx.arc(150, 75, 50, currentAngle, currentAngle + sliceAngle);        
//         currentAngle += sliceAngle;    
//         ctx.lineTo(150, 75);    
//         ctx.fillStyle = "lightblue";    
//         ctx.fill();    
//         ctx.arc(150, 75, 50, currentAngle, 1.5 * Math.Pi);    
//         ctx.lineTo(150, 75);    
//         ctx.fillStyle = "pink";    
//         ctx.fill();
//     }, []);
    
//     return (
//         <canvas className="pie"></canvas>
//     )
// }

export default Pie;