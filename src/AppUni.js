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
    const [gcd,x1, y1] = extendedEuclidean(b % a, a);
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

// Generate a prime number between 100 and 1000.
const primeP = createPrime(100, 1000);
let primeQ = createPrime(100, 1000);
// The while loop makes sure that if p and q are equal, it will generate a new prime number for q.
while (primeP === primeQ) {
      primeQ = createPrime(100, 1000);
}

/* const phiM = (primeP - 1) * (primeQ - 1);
    // e is initialized to 3 as it makes the process more efficient.
    let e = 3;
    while(gcd(e, phiM) !== 1){
      // Incresing the value of e by 2 it remains odd.
      e += 2;
    } */
   
      const phiM = (primeP - 1) * (primeQ - 1);

      // Generate a random odd number for e and ensure it is coprime with φ(M)
      let e;
      do {
          e = Math.floor(Math.random() * (phiM - 3)) + 3;
          if (e % 2 === 0) e++; // Ensure e is odd
      } while (gcd(e, phiM) !== 1);
   
// Generate the key parir using the prime numbers 11, 13 and coprime e = 23.
const keyPair = generateKeyPair(primeP, primeQ, e);
console.log (keyPair);