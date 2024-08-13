// App.js is the root component of the application. It is a functional component that returns a div element with the text "Hello, React!".

import React, { useState } from 'react';
//import bigInt from 'big-integer';
import { Container, Box, Typography, Button, TextField } from '@mui/material';

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

// function to generate prime number
const generatePrime = (min, max) => {
  let prime = Math.floor(Math.random() * (max - min)) + min;
  while(!isPrime(prime)){
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
  const [n, setN] = useState('');
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

  const handleGenerateRandomPrimes = () => {
    const primeP = generatePrime(100, 1000);
    const primeQ = generatePrime(100, 1000);
    setP(primeP);
    setQ(primeQ);
    setN(primeP * primeQ);
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
          Step 1: Click the button to generate prime numbers p, q, and RSA modulus n.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGenerateRandomPrimes} sx={{ mb: 2 }}>
          Generate Primes
        </Button>
        <TextField
          label="Prime p"
          type="number"
          value={p}
          fullWidth
          margin="normal"
          //InputProps={{ readOnly: true }}
        />
        <TextField
          label="Prime q"
          type="number"
          value={q}
          fullWidth
          margin="normal"
          //InputProps={{ readOnly: true }}
        />
        <TextField
          label="RSA modulus n"
          type="number"
          value={n}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
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
