# MIPS Simulator v1.0.1

You can use Node.js MIPS Simulator with [**npm**](https://www.npmjs.com/package/mips-simulator-js)

[**_Git Repository_ &rarr;**](https://github.com/mipsSimulatorUNIST/simulator)

### Contribution

We have completed building CI, and test automation is also ready.

**_Always opening_** to join this project for developing this library.

❗️[**_ISSUE_ &rarr;**](https://github.com/mipsSimulatorUNIST/simulator/issues)

✅ [**_Pull Request_ &rarr;**](https://github.com/mipsSimulatorUNIST/simulator/pulls)

### support

![JavaScript](https://img.shields.io/badge/-JavaScript-black?style=flat-square&logo=javascript)
![TypeScript](https://img.shields.io/badge/-TypeScript-black?style=flat-square&logo=typescript)

### Demo GUI

[Not Yet]()

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

### **Assembly Language → Binary Instruction**

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

## Supported Instruction

you can check
[**MIPS Reference**](https://inst.eecs.berkeley.edu/~cs61c/resources/MIPS_Green_Sheet.pdf)

In this library, we support below instructions

| Instruction | Format | opcode | funct  |
| :---------: | :----: | :----: | :----: |
|     SLL     |   R    | 000000 | 000000 |
|     SRL     |   R    | 000000 | 000010 |
|     JR      |   R    | 000000 | 001000 |
|     ADD     |   R    | 000000 | 100000 |
|    ADDU     |   R    | 000000 | 100001 |
|     AND     |   R    | 000000 | 100100 |
|     NOR     |   R    | 000000 | 100111 |
|     OR      |   R    | 000000 | 100101 |
|     SLT     |   R    | 000000 | 101010 |
|    SLTU     |   R    | 000000 | 101011 |
|     SUB     |   R    | 000000 | 100010 |
|    SUBU     |   R    | 000000 | 100011 |
|     LUI     |   I    | 001111 |  null  |
|     BEQ     |   I    | 000100 |  null  |
|     BNE     |   I    | 000101 |  null  |
|     LW      |   I    | 100011 |  null  |
|     LHU     |   I    | 100101 |  null  |
|     SW      |   I    | 101011 |  null  |
|     SH      |   I    | 101001 |  null  |
|    ADDI     |   I    | 001000 |  null  |
|    ADDIU    |   I    | 001001 |  null  |
|    ANDI     |   I    | 001100 |  null  |
|     ORI     |   I    | 001101 |  null  |
|    SLTI     |   I    | 001010 |  null  |
|    SLTIU    |   I    | 001011 |  null  |
|      J      |   J    | 000010 |  null  |
|     JAL     |   J    | 000011 |  null  |

## pseudo Instruction

#### **la (load address)**

`la $2, VAR1`

- `VAR1` is a label in the data section. It should be converted to lui and ori instructions.
- lui $register, upper 16bit address
  ori $register, lower 16bit address
  If the lower 16bit address is 0x0000, the ori instruction is useless.

  - Case1) load address is 0x1000 0000
    <br/>
    lui $2, 0x1000

  - Case2) load address is 0x1000 0004
    <br/>
    lui $2, 0x1000
    <br/>
    ori $2, $2, 0x0004

#### **move**

`move $1, $2`

It should be converted to add instruction with $0 as a target register(rt).

---

## Contribution

If you want to contribute to [**mips-simulator-js**](https://www.npmjs.com/package/mips-simulator-js), please come in [**_Git Repository_**](https://github.com/mipsSimulatorUNIST/simulator) and clone!

We have completed building CI, and test automation is also ready.

We are using testing library with `jest`

**_Always opening_** to join this project for developing this library.

❗️[**_ISSUE_ &rarr;**](https://github.com/mipsSimulatorUNIST/simulator/issues)

✅ [**_Pull Request_ &rarr;**](https://github.com/mipsSimulatorUNIST/simulator/pulls)

### required environment (global)

```bash
$ npm install typescript -g
```

---

## License

Licensed under the MIT License, Copyright © 2023-present MIPS-Simulator-UNIST
