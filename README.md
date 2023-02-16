# MIPS Simulator

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/mipsSimulatorUNIST/simulator/ci.yml?style=plastic)
![Weekly Downloads](https://img.shields.io/npm/dw/mips-simulator-js?style=plastic)
![version](https://img.shields.io/npm/v/mips-simulator-js?style=plastic)
![types](https://img.shields.io/npm/types/mips-simulator-js?style=plastic)

You can use Node.js MIPS Simulator with [npm](https://www.npmjs.com/package/mips-simulator-js)

[_Git Repository_ &rarr;](https://github.com/mipsSimulatorUNIST/simulator)

[_Coverage Status_ &rarr;](https://mipssimulatorunist.github.io/simulator/)

> ⚠️ [Changes](#changes)
>
> Example code in this document is working in `>= version 2.1.3`
>
> if you are using previous version, please read ⚠️ [Changes](#changes)

## Introduction

This open source provides functions to implement MIPS simulation in node.js environment.

We currently support functions that
[assembler - convert an assembly file to a binary file](#assembler)
and
[simulator - simulate actual assembly files](#simulator).

## Installation

```bash
$ npm install --save mips-simulator-js
```

## assembler

> assemble provides some functions for making binary file to assembly file.

### makeInput

function for parsing `binary file` to `string array`.

```typescript
export function makeInput(inputFolderName: string, inputFileName : string) {
    return assemblyInput : string[]
}
```

### makeObjectFile

function for making file from `string array` to `binary file`.

```typescript
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

function for convert `assembly instructions` to `binary instructions`.

> #### >= version 2.1.0
>
> `arrayOutputType` : if you want to get output with string, it should be false (default : true (string array))
>
> `mappingDetailRequest`: if you want to get mapping data (which assembly instruction map into specific binary instruction), it should be true (default : false)

```typescript
interface IAssemble {
  output: string[] | string;
  mappingDetail: IMapDetail[] | null;
}

export function assemble = (
  assemblyInstructions: string[],
  arrayOutputType = true,
  mappingDetailRequest = false,
) {
  ...
  return {output, mappingDetail} : IAssemble
};
```

> **Mapping Detail Sample**
>
> ```typescript
> const mappingDetailOutput: IMapDetail[] = [
>   {key: 0, assembly: '\t.data', binary: []},
>   {key: 1, assembly: 'data1:\t.word\t100', binary: []},
>   ...{
>     key: 6,
>     assembly: '\tand\t$17, $17, $0',
>     binary: [{lineNumber: 2, data: '00000010001000001000100000100100'}],
>   },
>   {
>     key: 7,
>     assembly: '\tand\t$18, $18, $0',
>     binary: [{lineNumber: 3, data: '00000010010000001001000000100100'}],
>   },
>   ...{
>     key: 9,
>     assembly: '\tla\t$9, data2',
>     binary: [
>       {lineNumber: 5, data: '00111100000010010001000000000000'},
>       {lineNumber: 6, data: '00110101001010010000000000000100'},
>     ],
>   },
>   ...{
>     key: 29,
>     assembly: '\tj\tlab1',
>     binary: [{lineNumber: 22, data: '00001000000100000000000000000110'}],
>   },
>   {key: 30, assembly: 'lab5:', binary: []},
>   {
>     key: 31,
>     assembly: '\tori\t$16, $16, 0xf0f0',
>     binary: [{lineNumber: 23, data: '00110110000100001111000011110000'}],
>   },
> ];
> ```

## simulator

> function for getting `simulating data` as result or process

`cycle`: the number of step requested by user for instructions

`returnCycles`: if user want to get process data, returnCycles should be True. (default : false)

```typescript

export interface simulatorOutputType {
  PC: string;
  registers: {[key: string]: string};
  dataSection: {[key: string]: string} | Record<string, never>;
  stackSection: {[key: string]: string} | Record<string, never>;
}

export interface ISimulatorOutput {
  result: simulatorOutputType;
  history: simulatorOutputType[] | null;
}

export function simulator(
  assemblyInstructions: string[],
  cycleNum: number,
  returnHistory = false,
): Promise<ISimulatorOutput> {
  ...
  return  returnHistory ? {result, history: CYCLES} : {result, history: null};
};
```

> **output (after number of cycle)**
>
> ```js
> {
>      PC: '0x00400058',
>      registers: {
>        R0: '0x00000000',
>        R1: '0x00000000',
>        R2: '0x00000000',
>        R3: '0x0000000a',
>        R4: '0x10000000',
>        R5: '0x00000000',
>        R6: '0x00000000',
>        R7: '0x00000000',
>        R8: '0x00000000',
>        R9: '0x00000000',
>        R10: '0x00000000',
>        R11: '0x00000000',
>        R12: '0x00000000',
>        R13: '0x00000000',
>        R14: '0x00000000',
>        R15: '0x00000000',
>        R16: '0x00000000',
>        R17: '0x00000000',
>        R18: '0x00000000',
>        R19: '0x00000000',
>        R20: '0x00000000',
>        R21: '0x00000000',
>        R22: '0x00000000',
>        R23: '0x00000000',
>        R24: '0x00000000',
>        R25: '0x00000000',
>        R26: '0x00000000',
>        R27: '0x00000000',
>        R28: '0x00000000',
>        R29: '0x80000000',
>        R30: '0x00000000',
>        R31: '0x00000000'
>      },
>      dataSection: {
>        '0x10000000': '0x00000001',
>        '0x10000004': '0x0000000a',
>        '0x10000008': '0x00000000'
>      },
>      stackSection: {
>        '0x7ffffff4': '0x0000000a',
>        '0x7ffffff8': '0x00000000',
>        '0x7ffffffc': '0x00000000'
>      }
>    }
> ```

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

const assemblyInstructions = makeInput(inputFolderName, inputFileName);
const binary = assemble(assemblyInstructions);

makeObjectFile(outputFolderPath, outputFileName, binary);
```

### Input/Output

<p align="center">
<img src="https://user-images.githubusercontent.com/44657722/211183736-c79836ed-8922-4a80-aacd-2aef353098dd.png" width="48%"/> 
<img src="https://user-images.githubusercontent.com/44657722/211183724-1fccb82f-bc03-4598-8d19-af0a5fc0e77e.png" width="45%"/> 
</p>

### **Simulator**

```typescript
// import functions
const inputFolderName = 'sample_input/sample';
const inputFileName = 'example1.s';

/*
   * input : assemblyInstructions: string[], cycle: number, returnCycles: boolean
   
   * assemblyInstructions is same as assemblyInstructions in assemble function above.
   
   * cycle is the number of cycles you want to execute.
   * Executing one cycle means that executing one instruction.
   
   * returnCycles determines the type of return.
   * If returnCycles = false (default), Returns only the final form of the result.
   * If returnCycles = true, Returns an object containing information of all cycles.
   
    ex) returnCycles = false, you can use this function as below form.
    const result = simulator(makeInput('sample_input', 'example1.s'), 10000, false)

    ex) returnCycles = true, you can use this function as below form.
    interface SimulatorResult {
      output: simulatorOutputType;
      cycles: simulatorOutputType[];
    }
*/

const assemblyInstructions = makeInput(inputFolderName, inputFileName);

const fetchSimulator = async (fileContent: string[] | null) => {
  const output = await simulator(fileContent, 1000, true);
  return output;
};

const {result, history} = fetchSimulator(assemblyInstructions);
```

### Input/Output

<p align="center">
<img src="https://user-images.githubusercontent.com/38162871/217744454-41d88eed-b9d3-4924-9e96-c821b967e43a.png" width="48%"/> 
<img src="https://user-images.githubusercontent.com/38162871/217744658-bb1b3f46-54c3-4bc7-abfe-dafb71e89bdf.png" width="45%"/> 
</p>

## Usage for React/Next

### Problem

If you use this npm package in your `react` or `next` project, problems will occur in the 'fs', 'path', and 'process' parts that load files.

<img width="1315" alt="reactError" src="https://user-images.githubusercontent.com/64965613/216809659-1dde2240-5461-45b2-948a-bff631e5c528.png">

This problem is caused by the webpack version. For details, refer to the [**webpack official documentation**](https://webpack.kr/migrate/5/#upgrade-webpack-4-and-its-pluginsloaders).

### Solution

The solution is to change the webpack configuration to `false` as shown below and import the file using `fetch`.

1. Change webpack config and package settings

```js
// node_modules/react-scripts/config/webpack.config.json
module.exports = function (webpackEnv) {
  // ...
  return {
    // ...
    resolve: {
      // ...
      // Add This!👇
      fallback: {
        "fs": false,
        "path": false,
        "process": false,
      },
      // ...
    }
  }
}
// package.json
{
	// ...
  "dependencies": {},
  "devDependencies": {},

  // Add This👇️
  "browser": {
    "fs": false,
    "os": false,
    "path": false
  }
}
```

2. Creating a file calling function using fetch (This function is a replacement for 'makeInput' provided by the library for use in `React` / `Next`.)

```js
const fetchFile = async (filePath: string) => {
  await fetch(filePath)
    .then(response => response.text())
    .then(text => {
      // Create a function to use and put it here!
    });
};

// Example

const [fileContent, setFileContent] = useState('');
const [binaryInstruction, setBinaryInstruction] = useState<string[] | null>(
    null
  );

useEffect(() => {
  const fetchFile = async (filePath: string) => {
    await fetch(filePath)
      .then(response => response.text())
      .then(text => {
        setFileContent(text.split('\n'));
      });
  };
  const filePath = `sample_input/example01.s`;
  fetchFile(filePath);
}, [setFileContent]);

useEffect(() => {
  if (fileContent)
    setBinaryInstruction(assemble(fileContent).split("\n"));
}, [fileContent]);

```

### ⚠️ Caution

In the browser, unlike in the local environment, only files or documents in the public path can be used, and the default path is automatically designated as public. Therefore, the assembly file to be converted into an object file using assembler must be stored in the `public` folder.

## Changes

### >= version 2.1.3

#### new parameter for assemble `>= version 2.1.1`

`arrayOutputType` : if you want to get output with string, it should be false (default : true (string array))

`mappingDetailRequest`: if you want to get mapping data (which assembly instruction map into specific binary instruction), it should be true (default : false)

#### parameter naming changes: `>= version 2.1.1`

- `assemblerFile` => `assemblyInstructions` (in `assemble`, `simulator`)
- `cycle` => `cycleNum` (in `simulator`)
- `returnCycles` => `returnHistory` (in `simulator`)

#### return type changes:

`>= version 2.1.3`

- `ISimulatorOutput` => `Promise<ISimulatorOutput>` (in `simulator`)

`>= version 2.1.1`

- `output` => `{output, mappingDetail}` (in `assemble`)
- `ISimulatorOutput | simulatorOutputType` => `ISimulatorOutput` (in `simulator`)

```typescript
interface IAssemble {
  output: string[] | string;
  mappingDetail: IMapDetail[] | null;
}

export function assemble = (
  assemblyInstructions: string[],
  arrayOutputType = true,
  mappingDetailRequest = false,
) {
  ...
  return {output, mappingDetail} : IAssemble
};
```

```typescript
export interface simulatorOutputType {
  PC: string;
  registers: {[key: string]: string};
  dataSection: {[key: string]: string} | Record<string, never>;
  stackSection: {[key: string]: string} | Record<string, never>;
}

export interface ISimulatorOutput {
  result: simulatorOutputType;
  history: simulatorOutputType[] | null;
}

export function simulator(
  assemblyInstructions: string[],
  cycleNum: number,
  returnHistory = false,
): Promise<ISimulatorOutput> {
  ...
  return  returnHistory ? {result, history: CYCLES} : {result, history: null};
};
```

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

## Contribution

If you want to contribute to [**mips-simulator-js**](https://www.npmjs.com/package/mips-simulator-js), please come in [**_Git Repository_**](https://github.com/mipsSimulatorUNIST/simulator) and clone!

We have completed building CI, and test automation is also ready.

We are using testing library with `jest`

**_Always opening_** to join this project for developing this library.

❗️[_ISSUE_ &rarr;](https://github.com/mipsSimulatorUNIST/simulator/issues)

✅ [_Pull Request_ &rarr;](https://github.com/mipsSimulatorUNIST/simulator/pulls)

### required environment (global)

```bash
$ npm install typescript -g
```

## License

Licensed under the MIT License, Copyright © 2023-present MIPS-Simulator-UNIST
