const { readFileSync, writeFileSync, readdirSync} = require('fs');

const sum = {
    "responseEnd": 0,
    "domInteractive": 0,
    "domContentLoadedEventEnd": 0,
    "loadEventEnd": 0
};
let cnt = 0;
for (let f of readdirSync(__dirname + '/logs/bb')) {
    const data = readFileSync(__dirname + '/logs/bb/' + f);
    const j = JSON.parse(data);
    for (let key of Object.keys(j)) {
        sum[key] += j[key];
    }
    cnt += 1;
}

for (let key of Object.keys(sum)) {
    sum[key] /= cnt;
}

const report = JSON.stringify(sum, null, 2);

writeFileSync(__dirname + '/logs/b/b.json', report);