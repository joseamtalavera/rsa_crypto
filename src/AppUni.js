// AppUni.js

// The code generates the RSA key pair: public key (e, m) and private key (d, m).
// The first step in generating the key pair is to find the modular inverse of e. 
// The modular inverse of e is the value of d where d * e ≡ 1 (mod φ(M)).
// From this equation we can derive the following formula for d
// d * e = 1 + k * φ(M)
// We can rewrite the above equation as
// d * e + (-k) * φ(M) = 1
// Now, using the Bezout identity, we can find the value of d and k with the formula:
// a * x + b * y = gcd(a, b)
// But we need to make sure that gcd(e, φ(M)) = 1 to confirm that the modular inverse exists.

// The extended Euclidean algorithm can be used to solve this equation.
// The extended Euclidean algorithm calculates the greatest common divisor of two numbers.
// It also calculates the coefficients x and y of the Bezout identity a * x + b * y = gcd(a, b).
// The coefficients x and y are the modular inverse of e and the modular inverse of φ(M) respectively.

// The function checkPrime checks if a number is prime.
const checkPrime = (num) => {
  // Number less than 2 are not prime numbers.
  if (num <= 1) return false;
  // 2 and 3 are prime numbers.
  if (num <= 3) return true;
  // Numbers divisible by 2 or 3 are not prime numbers.
  if (num % 2 === 0 || num % 3 === 0) return false;
  // Initialize i to 5 because numbers less than 5 are already checked.
  // The loop continues until i*i is less than or equal to the number.
  // It checks that i*i is less than or equal to the number because the factors of a number are always less than or equal to the square root of the number.
  // So if the number is not divisible by any number up to its square root, it is a prime.
  // The loop increments i by 6 because all prime numbers greater than 3 are of the form 6k ± 1.
  // The loop checks whether the number is divisible by i or i+2.
  for(let i= 5; i*i <= num; i+=6){
    if(num % i === 0 || num % (i+2) === 0) return false;
  }
    return true;
}
  
// The function createPrime generates a new prime number taking two parameters min and max.
const createPrime = (min, max) => {
  // The Math.random() function generates a random floating point number between 0 (inclusive) and 1 (exclusive).
  // The Math.floor() function rounds the number to the nearest integer.
  // *(max - min) makes the range [0, max - min). It generates a random number between 0 and max - min.
  // Adding min to the above expression makes the range [min, max). Here '[' means inclusive. And ')' means exclusive. 
  let primeNumber = Math.floor(Math.random() * (max - min)) + min;
  while(!checkPrime(primeNumber)){
    // The while loop generates a new prime until the generated number is a prime. 
    primeNumber = Math.floor(Math.random() * (max - min)) + min;
  } 
  return primeNumber;
}
  
// The function gcd calculates the Greatest Common Divisor.
const gcd = (a, b) => {
  // Using the Euclidean algorithm, the gcd of any number with 0 is the absolute value of the number.
  // In this case, when b is 0, gcd is a.
  if(b === 0) return a;
  // The function gcd calls itself recursively until b becomes 0.
  return gcd(b, a % b);
}
  
// The extendedEuclideanAlgorithm function performs the extended euclidean algorithm.
const extendedEuclideanAlgorithm = (a, b) => {
  // The Extended Euclidean algorithm is use to calculate x and y of the Bezout identity a * x + b * y = gcd(a,b)
  // The base case of the recursive function is when a is 0. 
  // In this case, the GCD is b, and the coefficients are x = 0 and y = 1, because: 0 * x + b * y = b = gcd(0,b).
  if(a === 0) return [b, 0, 1];
  // For non-zero a, the function calls itself recursively with b % a and a.
  // The result is destructured into the variables gcd, x1, and y1.
const [gcd,x1, y1] = extendedEuclideanAlgorithm(b % a, a);
  // The coefficients x and y are updated with the results of the recursive call.
  // x is calculated as y1 - Math.floor(b / a) * x1.
  // This formula comes from the rearrangement of the recursive relation.
  // y is the value of x1 from the previous step.
const x = y1 - Math.floor(b / a) * x1;
const y = x1;
return [gcd, x, y];
}
  
// The modularInverse function calculates the modular inverse with respect to φ(M), which we needed to calculate d.
const modularInverse = (a, m) => {
  // The function returns an array containing the gcd and the modular inverse, in this case x.
  const [gcd, x] = extendedEuclideanAlgorithm(a, m);
  // If the gcd is not 1, the modular inverse does not exist. It means that a and m are not coprime.
  if(gcd !== 1) return null;
  // The expression (x % m + m) % m is used to guarantee that the result is positive.
  return (x % m + m) % m;
} 
  
// The keyPairGeneration generates keys pair.
const keyPairGeneration = (p, q, e) => {
  // The public key is the tuple (e, m), and the private key is the tuple (d, m).
  // The RSA module m is the product of the prime numbers p and q.
  const m = p * q;
  // The Euler's totient function φ(M) = (p - 1)(q - 1).
  const phiM = (p - 1) * (q - 1);
  // The modular inverse of e is calculated using the function modularInverse().
  let d = modularInverse(e, phiM);
  return [[e, m], [d, m]];
}

// We generate a prime number between 100 and 1000.
const primeP = createPrime(100, 1000);
let primeQ = createPrime(100, 1000);
// The while loop ensures if p and q are equal, it will generate a new prime number for q.
while (primeP === primeQ) {
  primeQ = createPrime(100, 1000);
}

// We alculate the Euler's totient function φ(M) = (p - 1)(q - 1).
const phiM = (primeP - 1) * (primeQ - 1);
// Then a random odd number is generated for e, making sure that it is coprime with φ(M).
let e;
// We use a do-while loop to genereate e until it is coprime with φ(M).
do {
  // Generate a random number between 3 and φ(M) - 1.
  e = Math.floor(Math.random() * (phiM - 3)) + 3;
  // Check if e is even (reminder 0) and increment it by 1 if it is.
  if (e % 2 === 0) e++;
  // Check if e is coprime with φ(M) using the gcd function.
} while (gcd(e, phiM) !== 1);
   
// Finally the key pair are generated using the prime numbers primeP, primeQ and coprime e.
const rsaKeyPair = keyPairGeneration(primeP, primeQ, e);
console.log (rsaKeyPair);

// To test the implementation, the exercise from the cours Mathematics I is used.
// In that exercise, the key pair are generated using the prime numbers 11, 13 and coprime e = 23. 
// It confirms that is correct. There result is [[23, 143], [107, 143]].
console.log(keyPairGeneration(11, 13, 23));
