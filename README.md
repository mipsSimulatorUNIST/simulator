# MIPS Simulator v0.0.1

**_npm_ link** [Not Yet]()

**_Git Repository_** [Not Yet]()

- **_Always opening_** to join this project for developing this library.
- **_Typescript_** is supported.

**_View Demo_** [Not Yet]()

---

## Introduction

This open source provides functions to implement MIPS simulation in node.js environment.

Currently, we support a function to convert an assembly file to a binary file. In the future, we plan to add the function of simulating with actual assembly files.

---

## Install

    npm install --save mips-simulator

---

## Format

### makeInput

```js
export function makeInput(inputFolderName: string, inputFileName : string) {
    return assemblyInput : string[]
}
```

### makeObjectFile

```js
export function makeObjectFile(
  outputFolderPath: string,
  outputFileName: string,
  content: string[],
) {
  return;
  // make .o file to outputFolderPath
}
```

### assemble

```js
export const assemble = (assemblyFile : string[]) => {
  ...
  return output : string[]
};
```

---

## Usage

```js
// import functions

/*
 *   if the inputFilePath is '/Users/user/simulator/sample_input/sample/example1.s',
 *   currDirectory : '/Users/user/simulator'
 *   inputFolderPath : 'sample_input/sample'
 *   inputFileName: 'example1.s'
 */
const inputFolderName = 'sample_input/sample';
const inputFileName = 'example1.s';
/*
 *   if the outputFilePath is '/Users/user/simulator/sample_input/sample/example1.s',
 *   currDirectory : '/Users/user/simulator'
 *   outputFolderPath : 'sample_input/sample'
 *   outputFileName: 'example1.o'
 *   content : ['01010', '01010']
 */
const outputFolderPath = 'sample_input/sample';
const outputFileName = 'example1.o';

const assemblyFile = makeInput(inputFolderName, inputFileName);
const binary = assemble(assemblyFile);

makeObjectFile(outputFolderPath, outputFileName, binary);
```

### Input/Output

<p align="center">
<img src="https://user-images.githubusercontent.com/44657722/211183736-c79836ed-8922-4a80-aacd-2aef353098dd.png" width="48%"/> 
<img src="https://user-images.githubusercontent.com/44657722/211183724-1fccb82f-bc03-4598-8d19-af0a5fc0e77e.png" width="45%"/> 
</p>

---

## Contributing

If you want to contribute to `mips-simulator`, please contact me 'Email address'

---

## License

Licensed under the MIT License, Copyright © 2023-present MIPS-Simulator-UNIST
