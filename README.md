# IEEE-754 binary-32 floating point operation

## How to Use
- Input: (1) Two operands in binary and base-2 (2) Choice of Rounding (G/R/S or
rounding) (3) Number of digits supported
- Process: addition of two operands
- Output:
  - a. Step-by-step operation
    - 1. Initial normalization
    - 2. operation
    - 3. post-operation normalization
    - 4. final answer;
  - b. Option to output in a text file

## Usage

### Running Locally
1. Through Github Clone
  Clone the repository
  ```
  $ git clone https://github.com/Ford-Chung/IEEE-754-binary-32-floating-point-operation app
  ```
  
  Run the application via Node.js
  ```
  $ cd app && node app.js
  ```
2. Download As ZIP
  Download the ZIP file from the github browser

### Download dependecies
```
npm init
npm i express express-handlebars body-parser
```

### Run the Code
```
node app.js
```

Visit the Web application locally by clicking [here](http://localhost:9090/)
```
http://localhost:9090/
```
### Via Render Web Service
*Note that the website might take around a couple seconds to load*

Visit <https://ieee-754-binary-32-floating-point.onrender.com>
