// App.js 

import React, { useState } from 'react';
import { Container, Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

// Declaring the functions to be used in the App component.

/// The function checkPrime checks if a number is prime.
const checkPrime = (num) => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
    for(let i= 5; i*i <= num; i+=6){
      if(num % i === 0 || num % (i+2) === 0) return false;
    }
  return true;
}

// The function createPrime generates a new prime number taking two parameters min and max.
const createPrime = (min, max) => {
  let prime = Math.floor(Math.random() * (max - min)) + min;
  while(!checkPrime(prime)){
    prime = Math.floor(Math.random() * (max - min)) + min;
  } 
  return prime;
}

// The function gcd calculates the Greatest Common Divisor
const gcd = (a, b) => {
  if(b === 0) return a;
  return gcd(b, a % b);
}

// The extendedEuclideanAlgorithm function performs the extended euclidean algorithm.
const extendedEuclideanAlgorithm = (a, b) => {
  if(a === 0) return [b, 0, 1];
  const [gcd, x1, y1] = extendedEuclideanAlgorithm(b % a, a);
  const x = y1 - Math.floor(b / a) * x1;
  const y = x1;
  return [gcd, x, y];
}

// The modularInverse function calculates the modular inverse with respect to φ(M), which we needed to calculate d.
const modularInverse = (a, m) => {
  const [gcd, x] = extendedEuclideanAlgorithm(a, m);
  if(gcd !== 1) return null;
  return (x % m + m) % m;
} 

// The keyPairGeneration generates keys pair.
const keyPairGeneration = (p, q, e) => {
  const m = p * q;
  const phiM = (p - 1) * (q - 1);
  let d = modularInverse(e, phiM);
  return [[e, m], [d, m]];
}
 
const App = () => {
  // The state variables p, q, m, e, and keys are initialized using the useState() hook.
  const [p, setP] = useState('');
  const [q, setQ] = useState('');
  const [m, setM] = useState('');
  const [e, setE] = useState('');
  const [ keys, setKeys ] = useState(null);


  // The handleDifferentRandomPrimes() function generates two prime numbers p and q.
  const handleDifferentRandomPrimes = () => {
    // It calls the function createPrime() to generate a prime number between 100 and 1000.
    const primeP = createPrime(100, 1000);
    let primeQ = createPrime(100, 1000);
    // The while loop makes sure that if p and q are equal, it will generate a new prime number for q.
    while (primeP === primeQ) {
      primeQ = createPrime(100, 1000);
    }
    // The state variables p, q, and n are udpdated with the new prime numbers.
    setP(primeP);
    setQ(primeQ);
    setM(primeP * primeQ);
  }
  // The handleGenerateM() function generates the RSA module M manually.
  // I have include this function to check the app is working properly using 11 and 13 as prime numbers.
  const handleGenerateM = () => {
    // p and q are converted to ingegers 
    // p and q are the strings to be converted, and  10 is the radix of decimal number system.
    const primeP = parseInt(p, 10);
    const primeQ = parseInt(q, 10);
    // Now we check the validity of the prime numbers p and q.
    if (!isNaN(primeP) && !isNaN(primeQ)) {
      const manualN = primeP * primeQ;
      // Updating the state variable m.
      setM(manualN);
    } else {
      alert('Please enter two prime numbers');
    }
  }

  // The handleGenerateE() function generates the coprime number e.
  const handleGenerateE = () => {
    // To generate e, fist we calculate the Euler's totient function φ(M) = (p - 1)(q - 1).
    const primeP = parseInt(p, 10);
    const primeQ = parseInt(q, 10);
    const phiM = (primeP - 1) * (primeQ - 1);
    // Generate a random odd number for e and ensure it is coprime with φ(M)
    let e;
    do {
      e = Math.floor(Math.random() * (phiM - 3)) + 3;
      if (e % 2 === 0) e++; // Ensure e is odd
    } while (gcd(e, phiM) !== 1);
    setE(e);
  }

  // The handleGenerateKeys() function generates the public and private keys.
  const handleGenerateKeys = () => {
    // If p, q, and e exist, the function generateKeyPair() is called to generate the key pair.
    if(p && q && e){
      const keyPair = keyPairGeneration(parseInt(p, 10), parseInt(q, 10), parseInt(e, 10));
      setKeys(keyPair);
    } else {
      alert('Please generate prime numbers and e before generating keys');
    }
  }

  // The App component has three parts:
  // The TextField components display the prime numbers p and q, the RSA module M, the coprime number e, the public key, and the private key.
  // The Button components generate prime numbers, the RSA module M, the coprime number e, and the key pair.
  // The IconButton component refreshes the RSA module M.
  return (
    <Container>
    <Box my={4}>
      <Typography variant="h4" component="h1" gutterBottom>
        RSA Key Pair Generator
      </Typography>
      
      {/* Part 1: Generate Primes. It generate the prime number p, q. It also generate RSA module */}
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
                <IconButton onClick={handleGenerateM}>
                  <RefreshIcon />
                </IconButton>
              </InputAdornment>
            ),
           }}
        />
      </Box>

      {/* Part 2: It generates the e coprime */}
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
          onChange={(e) => setE(e.target.value)}
          //InputProps={{ readOnly: true }}
        />
      </Box>

      {/* Part 3: Generate Key Pair */}
      <Box my={2}>
        <Typography variant="h6" gutterBottom>
          Step 3: Click the button to generate the key pair.
        </Typography>
        <Button variant="contained" onClick={handleGenerateKeys} sx={{ mb: 2, backgroundColor: 'green' }}>
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

// Exporting the App component as the default component.
export default App;
