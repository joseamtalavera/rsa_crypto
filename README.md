## Generation of the Key Pair

I have recently completed the Mathematics I course corresponding to this Computer Science degree, in which I gained a deep understanding of the RSA cryptosystem and how we can generate a private key and a public key, which are later used in encryption and decryption. We can see how from a prime number we can generate public and private keys, which are often used in cryptography. This is something I find interesting and important for future studies. I think the best way to put this knowledge into practice is to develop an application that demonstrates how JavaScript can generate an RSA key pair. Through the implementation of JavaScript, we have observed how it is possible to write algorithms that apply these mathematical concepts learned in another course of this degree. It has undoubtedly helped me to understand every detail of the RSA cryptosystem. It will be a method that I will use for learning in the future.
 
In this assignment we will follow the following steps to generate an RSA key pair (Paar & Pelzl, 2010):
 
- Pick two prime random numbers p and q.
- Calculate the RSA modulus (M), represented as the product of the two primes M:= p - q.
- Calculate Eurle's φ of M: φ(M) = φ(p - q) = φ(p) - φ(q) = (p - 1) - (q - 1).
- Generate prime e and coprine with φ (M) with 1 < e < φ(M). Then gcd(e, φ(M)) = 1, which is essential for computing the modular inverse d.
- We get the modular inverse (d) of e with ed ≡ 1 mod φ(M), so φ(M)|(1 - ed). In this case we use
 Extended Euclidean Algorithm and Bezóut Identity.
- The public key is generated as a tuple (e, M) and the private key is generated as a tuple (d, M).

# Getting Started with rsa_crypto App

This project was bootstrapped with [Create React App].

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests].

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!



