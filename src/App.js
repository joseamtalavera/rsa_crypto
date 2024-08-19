// App.js 

// This the process of generating the RSA key pair: public key (e, m) and private key (d, m).
// To generate key pair we need to find the modular inverse of e. 
// The modular inverse of e is the value of d such that d * e ≡ 1 (mod φ(M)).
// From that equation, we can derive the formula for d as follows:
// d * e = 1 + k * φ(M)
// We can rewrite the above equation as:
// d * e + (-k) * φ(M) = 1
// Now using the Bezout's identity, we can find the value of d and k with the formula:
// a * x + b * y = gcd(a, b)
// But we need to make sure that gcd(e, φ(M)) = 1 to confirm make sure the modular inverse exists.

// The extended Euclidean algorithm can be used to solve this equation.
// The extended Euclidean algorithm calculates the greatest common divisor of two numbers.
// It also calculate he coefficients x and y of the Bezout identity ax + by = gcd(a, b).
// The coefficients x and y are the modular inverse of e and the modular inverse of φ(M), respectively.



import React, { useState } from 'react';
import { Container, Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

// Declaring the functions to be used in the App component.

// Function to check that a number is prime.
const isPrime = (num) => {
  //Numbers less than 2 are not prime.

  if (num <= 1) return false;
  // 2 and 3 are prime numbers.
  if (num <= 3) return true;
  // Numbers divisible by 2 or 3 are not prime.
  if (num % 2 === 0 || num % 3 === 0) return false;
  // The loop checks the divisibility of the number by 6k ± 1.
    for(let i= 5; i*i <= num; i+=6){
      if(num % i === 0 || num % (i+2) === 0) return false;
    }
  return true;
}

// Function to create a new prime number taking two parameters min and max.
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

// Function to calculate the greatest common divisor
const gcd = (a, b) => {
  // Using the Eucledian algorithm, the gcd of any number with 0 is the absolute value of the number.
  if(b === 0) return a;
  // The function calls itself recursively until b becomes 0.
  return gcd(b, a % b);
}


// Function to perform the extended euclidean algorithm
const extendedEuclidean = (a, b) => {
  // Extended Eclidian algorith use to calculate x and y of the Bezout identitiy ax + by = gcd(a,b)
  // The base case of the recursive function is when a is 0. 
  // In this case, the GCD is b, and the coefficients are x = 0 and y = 1, because: 0x + by = b = gcd(0,b)
  if(a === 0) return [b, 0, 1];
  // For non-zero 'a', the function recursively calls itself with 'b % a' and 'a'.
  // The recursive call breaks down the problem into smaller subproblems. 
  // The result is the destructured into the variables gcd, x1, and y1.
  const [gcd, x1, y1] = extendedEuclidean(b % a, a);
  // The coefficients x and y are updated using the results from the recursive call.
  // x is calculated as y1 - Math.floor(b / a) * x1.
  // This formula comes from the rearrangement of the recursive relation.
  // y is simply the value of x1 from the previous step.
  const x = y1 - Math.floor(b / a) * x1;
  const y = x1;
  return [gcd, x, y];
}

// Function to calculate the modular inverse with respect to φ(M), which helps to calculate d which is our objective
const modInverse = (a, m) => {
  // The function returns an array containing the gcd and the modular inverse, in this case x
  const [gcd, x] = extendedEuclidean(a, m);
  // If the gcd is not 1, the modular inverse does not exist. It means that a and m are not coprime.
  if(gcd !== 1) return null;
  // the expression (x % m + m) % m is used to guarantee that the result is positive.
  // this makes sure that the result is in the range [0, m-1).
  return (x % m + m) % m;
} 

// Function to generate keys pair
const generateKeyPair = (p, q, e) => {
  // The public key is the pair (e, m), and the private key is the pair (d, m).
  // The RSA module m is the product of the prime numbers p and q.
  const m = p * q;
  // The Euler's totient function φ(M) = (p - 1)(q - 1).
  const phiM = (p - 1) * (q - 1);
  // The modular inverse of e is calculated using the function modInverse().
  let d = modInverse(e, phiM);
  return [[e, m], [d, m]];
}
 
// Generate the key parir using the prime numbers 11, 13 and coprime e = 23.
const keyPair = generateKeyPair(11, 13, 23);
console.log (keyPair);

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
    /* const phiM = (p - 1) * (q - 1);
    // e is initialized to 3 as it makes the process more efficient.
    let e = 3;
    while(gcd(e, phiM) !== 1){
      // Incresing the value of e by 2 it remains odd.
      e += 2;
    }
    setE(e); */
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
      const keyPair = generateKeyPair(parseInt(p, 10), parseInt(q, 10), parseInt(e, 10));
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
