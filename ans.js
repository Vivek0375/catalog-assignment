const fs = require('fs');


function baseToDecimal(value, base) {
    return parseInt(value, base);
}


function lagrangeInterpolation(points, k) {
    let secret = 0;
    
    
    const selectedPoints = points.slice(0, k);
    
    for (let i = 0; i < k; i++) {
        let xi = selectedPoints[i].x;
        let yi = selectedPoints[i].y;
        
        let li = 1; 
        
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = selectedPoints[j].x;
                li *= (0 - xj) / (xi - xj);
            }
        }
        
        secret += yi * li;
    }
    
    return Math.round(secret); 
}


function findSecret(jsonData) {
    const data = JSON.parse(jsonData);
    const n = data.keys.n;
    const k = data.keys.k;
    
    console.log(`n = ${n}, k = ${k}`);
    
   
    const points = [];
    
    for (let key in data) {
        if (key !== 'keys') {
            const x = parseInt(key);
            const base = parseInt(data[key].base);
            const encodedValue = data[key].value;
            
            
            const y = baseToDecimal(encodedValue, base);
            
            points.push({ x: x, y: y });
            console.log(`Point (${x}, ${y}) - decoded from "${encodedValue}" in base ${base}`);
        }
    }
    
   
    points.sort((a, b) => a.x - b.x);
    
    
    const secret = lagrangeInterpolation(points, k);
    
    console.log(`\nSecret (constant term): ${secret}`);
    return secret;
}


const testCase1 = `{
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "2",
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
}`;

const testCase2 = `{
    "keys": {
        "n": 10,
        "k": 7
    },
    "1": {
        "base": "6",
        "value": "13444211440455345511"
    },
    "2": {
        "base": "15",
        "value": "aed7015a346d63"
    },
    "3": {
        "base": "15",
        "value": "6aeeb69631c227c"
    },
    "4": {
        "base": "16",
        "value": "e1b5e05623d881f"
    },
    "5": {
        "base": "8",
        "value": "316034514573652620673"
    },
    "6": {
        "base": "3",
        "value": "2122212201122002221120200210011020220200"
    },
    "7": {
        "base": "3",
        "value": "20120221122211000100210021102001201112121"
    },
    "8": {
        "base": "6",
        "value": "20220554335330240002224253"
    },
    "9": {
        "base": "12",
        "value": "45153788322a1255483"
    },
    "10": {
        "base": "7",
        "value": "1101613130313526312514143"
    }
}`;


function solveFromFile(filename) {
    try {
        const jsonData = fs.readFileSync(filename, 'utf8');
        return findSecret(jsonData);
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
}


console.log("=== Test Case 1 ===");
findSecret(testCase1);

console.log("\n=== Test Case 2 ===");
findSecret(testCase2);


module.exports = { findSecret, solveFromFile };