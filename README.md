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


### `npm run eject`


## Generation of the Key Pair

Before we can encrypt messages with the RSA algorithm, we must first generate a key pair consisting of a public and private key. To this end we proceed as follows:

1. We randomly choose two prime numbers p and q with p ≠ q.
2. We calculate the product of the two prime numbers M := p · q. We call M the RSA module.
3. We calculate Euler’s φ function of M. Because M is a product of prime numbers and Euler’s φ function is multiplicative it applies that:
   
   φ(M) = φ(p · q) = φ(p) · φ(q) = (p − 1) · (q − 1).

4. We choose a number e that is coprime to φ(M) with 1 < e < φ(M). Thus gcd(e, φ(M)) = 1.
5. We determine a number d with ed ≡ 1 mod φ(M), thus φ(M)|(1 − ed). For this we can use, for example, the extended Euclidean algorithm.
6. The public key is the tuple (e, M). The private key is the tuple (d, M). The numbers p, q and φ(M) are no longer needed after the key pair has been generated and can be deleted or destroyed.