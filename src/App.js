// App.js 

import React, { useState } from 'react';
import { Container, Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

// function to choose prime number
const isPrime = (num) => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
    for(let i= 5; i*i <= num; i+=6){
      if(num % i === 0 || num % (i+2) === 0) return false;
    }
  return true;
}

// Function to creata a new prime number taking two parameters min and max.
const createPrime = (min, max) => {
  // Math.random() fucntion generate a random floating point number between 0 (inclusive ) and 1 (exclusive ).
  // Math.floor() function rounds the number to the nearet whole number.
  // *(max - min) makes the range to [0, max - min). So it generates a random number between 0 and max - min.
  // adding min to the above expression makes the range to [min, max). Where '[' means inclusive and ')' means exclusive. 
  let prime = Math.floor(Math.random() * (max - min)) + min;
  while(!isPrime(prime)){
    // The while loop generates a new prime until the generated number is a prime. 
    prime = Math.floor(Math.random() * (max - min)) + min;
  } 
  return prime;
}

// function to calculate the greatest common divisor
const gcd = (a, b) => {
  if(b === 0) return a;
  return gcd(b, a % b);
}


// function to perform the extended euclidean algorithm
const extendedEuclidean = (a, b) => {
  if(a === 0) return [b, 0, 1];
  const [gcd, x1, y1] = extendedEuclidean(b % a, a);
  const x = y1 - Math.floor(b / a) * x1;
  const y = x1;
  return [gcd, x, y];
}

// function to calculate the modular multiplicative inverse
const modInverse = (a, m) => {
  const [gcd, x, y] = extendedEuclidean(a, m);
  if(gcd !== 1) return null;
  return (x % m + m) % m;
} 

// function to generate keys
const generateKeyPair = (p, q, e) => {
  const n = p * q;
  const phiM = (p - 1) * (q - 1);
  let d = modInverse(e, phiM);
  return [[e, n], [d, n]];
  }
 

const App = () => {
  const [p, setP] = useState('');
  const [q, setQ] = useState('');
  const [m, setM] = useState('');
  const [e, setE] = useState('');
  const [ keys, setKeys ] = useState(null);

  const handleGenerate = () => {
    const primeP = parseInt(p, 10);
    const primeQ = parseInt(q, 10);
    if (isPrime(primeP) && isPrime(primeQ) && primeP !== primeQ) {
      const keyPair = generateKeyPair(primeP, primeQ);
      setKeys(keyPair);
    }else{
      alert('Please enter two different prime numbers');
    }
  }

  // We randomly choose two prime numbers p and q with p ≠ q.

  const handleDifferentRandomPrimes = () => {
    // generate two prime numbers p and q. 
    //It calls the function generatePrime() to generate a prime number between 100 and 1000.
    const primeP = createPrime(100, 1000);
    let primeQ = createPrime(100, 1000);
    // The while loop makes sure tha p and q are different.
    // It generates a new prime number until the p and qu are different.
    while (primeP === primeQ) {
      primeQ = createPrime(100, 1000);
    }
    // The state variables p, q, and n are udpdated with the new prime numbers.
    setP(primeP);
    setQ(primeQ);
    setM(primeP * primeQ);
  }

  const handleGenerateN = () => {
    // p and q are converted to ingegers 
    //p is the string to be converted, and  10 is the radix of decimal number system.
    const primeP = parseInt(p, 10);
    const primeQ = parseInt(q, 10);
    // Now we check the validity of the prime numbers p and q.
    if (!isNaN(primeP) && !isNaN(primeQ)) {
      const manualN = primeP * primeQ;
      // Updating the state variable n.
      setM(manualN);
    } else {
      alert('Please enter two prime numbers');
    }
  }


  const handleGenerateE = () => {
    const phiM = (p - 1) * (q - 1);
    let e = 3;
    while(gcd(e, phiM) !== 1){
      e += 2;
    }
    setE(e);
  }

  const handleGenerateKeys = () => {
    if(p && q && e){
      const keyPair = generateKeyPair(parseInt(p, 10), parseInt(q, 10), parseInt(e, 10));
      setKeys(keyPair);
    } else {
      alert('Please generate prime numbers and e before generating keys');
    }
  }

  return (
    <Container>
    <Box my={4}>
      <Typography variant="h4" component="h1" gutterBottom>
        RSA Key Pair Generator
      </Typography>
      
      {/* Part 1: Generate Primes */}
      <Box my={2}>
        <Typography variant="h6" gutterBottom>
          Step 1: Click the button to generate prime numbers p, q, and RSA module M.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleDifferentRandomPrimes} sx={{ mb: 2 }}>
          Generate Primes
        </Button>
        <TextField
          label="Prime p"
          type="number"
          value={p}
          fullWidth
          margin="normal"
          onChange={(e) => setP(e.target.value)}
          //InputProps={{ readOnly: true }}
        />
        <TextField
          label="Prime q"
          type="number"
          value={q}
          fullWidth
          margin="normal"
          onChange={(e) => setQ(e.target.value)}
          //InputProps={{ readOnly: true }}
        />
        <TextField
          label="RSA module M"
          type="number"
          value={m}
          fullWidth
          margin="normal"
          InputProps={{ 
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleGenerateN}>
                  <RefreshIcon />
                </IconButton>
              </InputAdornment>
            ),
           }}
        />
      </Box>

      {/* Part 2: Generate e */}
      <Box my={2}>
        <Typography variant="h6" gutterBottom>
          Step 2: Click the button to generate the coprime number e.
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleGenerateE} sx={{ mb: 2 }}>
          Generate e
        </Button>
        <TextField
          label="Coprime e"
          type="number"
          value={e}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />
      </Box>

      {/* Part 3: Generate Key Pair */}
      <Box my={2}>
        <Typography variant="h6" gutterBottom>
          Step 3: Click the button to generate the key pair.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGenerateKeys} sx={{ mb: 2 }}>
          Generate Key Pair
        </Button>
        {keys && (
          <Box mt={2}>
            <TextField
              label="Public Key"
              type="text"
              value={`(${keys[0][0]}, ${keys[0][1]})`}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Private Key"
              type="text"
              value={`(${keys[1][0]}, ${keys[1][1]})`}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
          </Box>
        )}
      </Box>
    </Box>
  </Container>
);
}

export default App;
