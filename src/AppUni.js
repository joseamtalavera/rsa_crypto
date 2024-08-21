// AppUni.js

// This the process of generating the RSA key pair: public key (e, m) and private key (d, m).
// To generate the key pair we need to find the modular inverse of e. 
// The modular inverse of e is the value of d such that d * e ≡ 1 (mod φ(M)).
// From that equation, we can derive the formula for d as follows:
// d * e = 1 + k * φ(M)
// We can rewrite the above equation as:
// d * e + (-k) * φ(M) = 1
// Now using the Bezout's identity, we can find the value of d and k with the formula:
// a * x + b * y = gcd(a, b)
// But we need to ensure that gcd(e, φ(M)) = 1 to confirm the modular inverse exists.

// The extended Euclidean algorithm can be used to solve this equation.
// The extended Euclidean algorithm calculates the greatest common divisor of two numbers.
// It also calculate he coefficients x and y of the Bezout identity a * x + b * y = gcd(a, b).
// The coefficients x and y are the modular inverse of e and the modular inverse of φ(M), respectively.

// Function to check that a number is prime.
const isPrimeNumber = (num) => {
  //Numbers less than 2 are not prime.
  if (num <= 1) return false;
  // 2 and 3 are prime numbers.
  if (num <= 3) return true;
  // Numbers divisible by 2 or 3 are not prime.
  if (num % 2 === 0 || num % 3 === 0) return false;
  // Initialize i to 5 because less than 5 are already checked.
  // The loop runs until i*i is less than or equal to the number.
  // It checks if i*i is less than or equal to the number because the factors of a number are always less than or equal to the square root of the number.
  // Therefore, if the number is not divisible by any number up to its square root, it is a prime number.
  // The loop increments i by 6 because all prime numbers greater than 3 are in the form 6k ± 1.
  // The loop checks if the number is divisible by i or i+2.
  for(let i= 5; i*i <= num; i+=6){
    if(num % i === 0 || num % (i+2) === 0) return false;
  }
    return true;
}
  
// Function to create a new prime number taking two parameters min and max.
const createPrime = (min, max) => {
  // Math.random() fucntion generate a random floating point number between 0 (inclusive ) and 1 (exclusive ).
  // Math.floor() function rounds the number to the nearest whole number.
  // *(max - min) makes the range to [0, max - min). It generates a random number between 0 and max - min.
  // Adding min to the above expression makes the range to [min, max). Here, '[' means inclusive and ')' means exclusive. 
  let prime = Math.floor(Math.random() * (max - min)) + min;
  while(!isPrimeNumber(prime)){
    // The while loop generates a new prime until the generated number is a prime. 
    prime = Math.floor(Math.random() * (max - min)) + min;
  } 
  return prime;
}
  
// Function for calculating the greatest common divisor
const gcd = (a, b) => {
  // Using the Euclidean algorithm, the gcd of any number with 0 is the absolute value of the number.
  if(b === 0) return a;
  // The function calls itself recursively until b becomes 0.
  return gcd(b, a % b);
}
  
  
// Function to perform the extended euclidean algorithm
const extendedEuclidean = (a, b) => {
  // Extended Euclidean algorith use to calculate x and y of the Bezout identitiy a * x + b * y = gcd(a,b)
  // The base case of the recursive function is when a is 0. 
  // In this case, the GCD is b, and the coefficients are x = 0 and y = 1, because: 0 * x + b * y = b = gcd(0,b).
  if(a === 0) return [b, 0, 1];
  // For non-zero 'a', the function recursively calls itself with 'b % a' and 'a'.
  // The result is destructured into the variables gcd, x1, and y1.
const [gcd,x1, y1] = extendedEuclidean(b % a, a);
  // The coefficients x and y are updated using the results of the recursive call.
  // x is calculated as y1 - Math.floor(b / a) * x1.
  // This formula comes from the rearrangement of the recursive relation.
  // y is simply the value of x1 from the previous step.
const x = y1 - Math.floor(b / a) * x1;
const y = x1;
return [gcd, x, y];
}
  
// Function to calculate the modular inverse with respect to φ(M), which helps to calculate d which is our objective
const modularInverse = (a, m) => {
  // The function returns an array containing the gcd and the modular inverse, in this case x.
  const [gcd, x] = extendedEuclidean(a, m);
  // If the gcd is not 1, the modular inverse does not exist. It means that a and m are not coprime.
  if(gcd !== 1) return null;
  // the expression (x % m + m) % m is used to guarantee that the result is positive.
  return (x % m + m) % m;
} 
  
// Function to generate keys pair
const generateKeyPair = (p, q, e) => {
  // The public key is the pair (e, m), and the private key is the pair (d, m).
  // The RSA module m is the product of the prime numbers p and q.
  const m = p * q;
  // The Euler's totient function φ(M) = (p - 1)(q - 1).
  const phiM = (p - 1) * (q - 1);
  // The modular inverse of e is calculated using the function modularInverse().
  let d = modularInverse(e, phiM);
  return [[e, m], [d, m]];
}

// Generate a prime number between 100 and 1000.
const primeP = createPrime(100, 1000);
let primeQ = createPrime(100, 1000);
// The while loop ensures if p and q are equal, it will generate a new prime number for q.
while (primeP === primeQ) {
  primeQ = createPrime(100, 1000);
}

// Calculate the Euler's totient function φ(M) = (p - 1)(q - 1).
const phiM = (primeP - 1) * (primeQ - 1);
// Generate a random odd number for e and ensure it is coprime with φ(M)
let e;
// We use a do-while loop to genereate e until it is coprime with φ(M).
do {
  // Generate a random number between 3 and φ(M) - 1.
  e = Math.floor(Math.random() * (phiM - 3)) + 3;
  // Check if e is even (reminder 0) and increment it by 1 if it is.
  if (e % 2 === 0) e++;
  // Check if e is coprime with φ(M) using the gcd function.
} while (gcd(e, phiM) !== 1);
   
// Generate the key pair using the prime numbers primeP, primeQ and coprime e.
const keyPair = generateKeyPair(primeP, primeQ, e);
console.log (keyPair);

// Generate the key pair using the prime numbers 11, 13 and coprime e = 23.
// This is the example used in Mathematics I. 
// It confirms that is correct.
console.log(generateKeyPair(11, 13, 23));
