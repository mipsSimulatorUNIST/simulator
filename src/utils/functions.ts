import path from 'path';
import * as fs from 'fs';
import {exit} from 'process';

import {
  process_instruction,
  setFUNC,
  setIMM,
  setOPCODE,
  setRD,
  setRS,
  setRT,
  setSHAMT,
  setTARGET,
} from '../simulator/run';

import {
  bcolors,
  currentState,
  DEBUG,
  DEBUG_SET,
  INST_INFO,
  instAddOne,
  instruction,
  InstructionType,
  memData,
  memStack,
  memRegions,
  MIPS_REGS,
  MEM_GROW_UP,
  MEM_DUMP_SET,
  MEM_NREGIONS,
  MEM_DATA_START,
  MEM_TEXT_START,
  pType,
  RUN_BIT,
  SYMBOL_TABLE,
  SymbolTableType,
} from './constants';

export interface simulatorOutputType {
  PC: string;
  registers: {[key: string]: string};
  dataSection: {[key: string]: string} | Record<string, never>;
  stackSection: {[key: string]: string} | Record<string, never>;
}

export function parseInstr(buffer: string, index: number): instruction {
  const instr: instruction = new instruction();

  setOPCODE(instr, fromBinary(buffer.slice(0, 6)));

  // R type
  if (instr.opcode === 0x0) {
    setRS(instr, fromBinary(buffer.slice(6, 11)));
    setRT(instr, fromBinary(buffer.slice(11, 16)));
    setRD(instr, fromBinary(buffer.slice(16, 21)));
    setSHAMT(instr, fromBinary(buffer.slice(21, 26)));
    setFUNC(instr, fromBinary(buffer.slice(26, 32)));
  }

  // J type
  else if (instr.opcode === 0x2 || instr.opcode === 0x3) {
    setTARGET(instr, fromBinary(buffer.slice(6, 32)));
  }

  // I type
  else {
    setRS(instr, fromBinary(buffer.slice(6, 11)));
    setRT(instr, fromBinary(buffer.slice(11, 16)));
    setIMM(instr, fromBinary(buffer.slice(16, 32)));
  }

  memWrite(MEM_TEXT_START + index, fromBinary(buffer));
  return instr;
}

export function parseData(buffer: string, index: number) {
  //[TODO] Implement this function
  memWrite(MEM_DATA_START + index, fromBinary(buffer));
  return;
}

export function printParseResult(
  INST_INFO: InstructionType[],
  textSize: number,
  dataSize: number,
) {
  console.log('Instruction Information');
  /*
    TYPE I
    0x8: (0x001000)ADDI
    0x9: (0x001001)ADDIU
    0xc: (0x001100)ANDI
    0x4: (0x000100)BEQ
    0x5: (0x000101)BNE
    0x25: (0x011001)LHU
    0xf: (0x001111)LUI
    0x23: (0x100011)LW
    0xd: (0x001101)ORI
    0xa: (0x001010)SLTI
    0xb: (0x001011)SLTIU
    0x29: (0x011101)SH
    0x2b: (0x101011)SW

    TYPE R
    0x0: (0x000000)ADD, ADDU, AND, NOR, OR, SLT, SLTU, SLL, SRL, SUB, SUBU  if JR

    TYPE J
    0x2: (0x000010)J
    0x3: (0x000011)JAL
    */

  const TypeIList = [
    0x8, 0x9, 0xc, 0x4, 0x5, 0x25, 0xf, 0x23, 0xd, 0xa, 0xb, 0x29, 0x2b,
  ];
  const TypeRList = [0x0];
  const TypeJList = [0x2, 0x3];

  for (let i = 0; i < textSize / 4; i++) {
    console.log(`INST_INFO[${i}].value : 0x${INST_INFO[i].value.toString(16)}`);
    console.log(`INST_INFO[${i}].opcode : ${INST_INFO[i].opcode}`);

    if (INST_INFO[i].opcode in TypeIList) {
      console.log(`INST_INFO[${i}].rs : ${INST_INFO[i].rs}`);
      console.log(`INST_INFO[${i}].rt : ${INST_INFO[i].rt}`);
      console.log(`INST_INFO[${i}].imm : ${INST_INFO[i].imm}`);
    } else if (INST_INFO[i].opcode in TypeRList) {
      console.log(`INST_INFO[${i}].funcCode : ${INST_INFO[i].funcCode}`);
      console.log(`INST_INFO[${i}].rs : ${INST_INFO[i].rs}`);
      console.log(`INST_INFO[${i}].rt : ${INST_INFO[i].rt}`);
      console.log(`INST_INFO[${i}].rd : ${INST_INFO[i].rd}`);
      console.log(`INST_INFO[${i}].shamt : ${INST_INFO[i].shamt}`);
    } else if (INST_INFO[i].opcode in TypeJList) {
      console.log(`INST_INFO[${i}].target : ${INST_INFO[i].target}`);
    } else {
      console.log('Not available instrution\n');
    }
  }
  console.log('Memory Dump - Text Segment\n');
  for (let i = 0; i < textSize; i += 4) {
    console.log(
      `text_seg[${i}] : 0x${memRead(MEM_TEXT_START + i).toString(16)}`,
    );
  }
  for (let i = 0; i < dataSize; i += 4) {
    console.log(
      `text_seg[${i}] : 0x${memRead(MEM_DATA_START + i).toString(16)}`,
    );
  }
  console.log(`Current PC: ${currentState.PC.toString(16)}`);
}

export function numToBits(num: number, pad = 32): string {
  // 10진수 정수를 2진수 bit로 변경해서 return
  if (num >= 0) {
    return num.toString(2).padStart(pad, '0'); //양수일때
  } else {
    num = 2 ** pad + num;
    return num.toString(2).padStart(pad, '0'); //음수일때;
  }
}

export function toHexAndPad(num: number, pad = 8): string {
  /*
   * num : Number or String(숫자 형식, 10진법), pad : Number
   * input : 18 => output: '00000012'
   * Recommend | num을 Number 타입으로 넣을 것
   */
  return Number(num).toString(16).padStart(pad, '0');
}

export function symbolTableAddEntry(symbol: SymbolTableType) {
  SYMBOL_TABLE[symbol.name] = symbol.address;
  if (DEBUG) {
    log(1, `${symbol.name}: 0x${toHexAndPad(symbol.address)}`);
  }
}

export function log(printType: number, content: string) {
  console.log(pType[printType] + content);
}

// Check the value is empty or not
export function isEmpty(value: string | null | undefined | object) {
  const emptyArray: string[] = [''];
  if (
    value === '' ||
    value === null ||
    value === undefined ||
    (value !== null &&
      typeof value === 'object' &&
      !Object.keys(value).length) ||
    value === emptyArray
  ) {
    return true;
  } else {
    return false;
  }
}

// Parsing an assembly file(*.s) into a list
export function makeInput(
  inputFolderName: string,
  inputFileName: string,
): string[] {
  /*
   if the inputFilePath is /Users/junghaejune/simulator/sample_input/sample/example1.s,
    currDirectory : /Users/junghaejune/simulator
    inputFolderPath : sample_input/sample
    inputFileName: example1.s
  */

  const currDirectory: string = process.cwd();
  const inputFilePath: string = path.join(
    currDirectory,
    inputFolderName,
    inputFileName,
  );

  try {
    if (fs.existsSync(inputFilePath) === false) throw 'INPUT_PATH_ERROR';

    const input: string = fs.readFileSync(inputFilePath, 'utf-8');

    if (isEmpty(input)) throw 'INPUT_EMPTY';
    return input.split('\n');
  } catch (err) {
    if (err === 'INPUT_PATH_ERROR') {
      log(
        3,
        `No input file ${inputFileName} exists. Please check the file name and path.`,
      );
    } else if (err === 'INPUT_EMPTY') {
      log(
        3,
        `input file ${inputFileName} is not opened. Please check the file`,
      );
    } else console.error(err);
    exit(1);
  }
}

export function simulatorUnitTest(
  testCase: simulatorOutputType,
  output: simulatorOutputType,
) {
  function printResult(
    origin: {[key: string]: string} | Record<string, never>,
    compare: {[key: string]: string} | Record<string, never>,
  ) {
    Object.keys(origin).map(key => {
      if (compare[key]) {
        const color =
          origin[key] === compare[key] ? bcolors.GREEN : bcolors.RED;
        console.log(
          `${color}${key} : ${origin[key]}          ${key} : ${compare[key]}${bcolors.ENDC}`,
        );
      } else {
        console.log(`${bcolors.RED}${key} : ${origin[key]}${bcolors.ENDC}`);
      }
    });
  }

  type keyType = 'registers' | 'dataSection' | 'stackSection';
  const keyList: keyType[] = ['registers', 'dataSection', 'stackSection'];

  console.log(`---------------PC---------------`);
  console.log(
    `${testCase.PC === output.PC ? bcolors.GREEN : bcolors.RED}PC : ${
      testCase.PC
    }          PC : ${output.PC}${bcolors.ENDC}\n`,
  );

  keyList.map(key => {
    console.log(`---------------${key}---------------`);
    printResult(testCase[key], output[key]);
    console.log('\n');
  });
}

export function parseSimulatorOutput(rawOutput: string): simulatorOutputType {
  //input : test simulator input
  //ouput : object type -> { register : {PC:, R0:,...}, dataSection:{}, stackSection{}}

  function splitHelper(input: string): [string, string] {
    const returnValue = input.split(/:|\n/);
    return returnValue.length === 2
      ? [returnValue[0], returnValue[1].trim()]
      : null;
  }

  function setTypeParser(
    input: string,
  ): {[key: string]: string} | Record<string, never> {
    const returnSet = {};
    input
      .split(/\n/)
      .filter(e => e !== '')
      .map(element => {
        const result = splitHelper(element);
        result ? (returnSet[result[0]] = result[1]) : null;
      });

    return returnSet;
  }

  const outputList = rawOutput
    .split(/Program Counter\n|Registers\n|Data section|Stack section\n/)
    .filter(e => e !== '');

  const PC = setTypeParser(outputList[0]);
  const registers = setTypeParser(outputList[1]);
  const dataSection = setTypeParser(outputList[2] || '');
  const stackSection = setTypeParser(outputList[3] || '');

  return {PC: PC.PC, registers, dataSection, stackSection};
}

export function makeOutput(
  inputFolderName: string,
  inputFileName: string,
): string {
  /*
   if the inputFilePath is /Users/junghaejune/simulator/sample_input/sample/example1.s,
    currDirectory : /Users/junghaejune/simulator
    inputFolderPath : sample_input/sample
    inputFileName: example1.s
  */

  const currDirectory: string = process.cwd();
  const inputFilePath: string = path.join(
    currDirectory,
    inputFolderName,
    inputFileName,
  );

  try {
    if (fs.existsSync(inputFilePath) === false) throw 'INPUT_PATH_ERROR';

    const input: string = fs.readFileSync(inputFilePath, 'utf-8');

    if (isEmpty(input)) throw 'INPUT_EMPTY';
    return input;
  } catch (err) {
    if (err === 'INPUT_PATH_ERROR') {
      log(
        3,
        `No input file ${inputFileName} exists. Please check the file name and path.`,
      );
    } else if (err === 'INPUT_EMPTY') {
      log(
        3,
        `input file ${inputFileName} is not opened. Please check the file`,
      );
    } else console.error(err);
    exit(1);
  }
}

// Create an Object file(*.o) in the desired path
export function makeObjectFile(
  outputFolderPath: string,
  outputFileName: string,
  content: string[],
) {
  /*
   if the outputFilePath is /Users/junghaejune/simulator/sample_input/sample/example1.s,
    currDirectory : /Users/junghaejune/simulator
    outputFolderPath : sample_input/sample
    outputFileName: example1.o 
    content : ['01010', '01010']
  */

  const currDirectory: string = process.cwd();
  const outputFilePath: string = path.join(
    currDirectory,
    outputFolderPath,
    outputFileName,
  );

  try {
    if (fs.existsSync(outputFilePath) === true) {
      fs.unlink(outputFilePath, err => {
        err
          ? console.error(err)
          : log(0, `Output file ${outputFileName} exists. Remake the file`);
      });
    } else throw 'OUTPUT_NOT_EXISTS';
    const fd: number = fs.openSync(outputFilePath, 'a');

    for (const item of content) {
      fs.appendFileSync(fd, item + '\n', 'utf-8');
    }

    fs.closeSync(fd);
  } catch (err) {
    if (err === 'OUTPUT_NOT_EXISTS') {
      log(0, `Output file ${outputFileName} does not exists. Make the file`);
    } else console.error(err);
    exit(1);
  }
}

export interface IBinaryData {
  lineNumber: number;
  data: string;
}

export interface IMapDetail {
  key: number;
  assembly: string;
  binary: IBinaryData[];
}

export function makeMappingDetail(
  assemblyFile: string[],
  textSeg: string[],
  mappingTable: number[][],
  output: string[],
) {
  const mappingDetail: IMapDetail[] | null = [] as IMapDetail[];
  let textCounter = 0;

  for (let i = 0; i < assemblyFile.length; i++) {
    const assemblyLine = assemblyFile[i];
    const binaryInstructionNumbers: number[] = [];
    let binaryInstructions: string[] = [];

    if (assemblyLine === textSeg[textCounter]) {
      const binaryIndexes = mappingTable[textCounter];
      binaryInstructions = binaryIndexes.map(index => {
        binaryInstructionNumbers.push(index + 2);
        return output[index + 2];
      });
      textCounter++;
    }

    const binaryData: IBinaryData[] = [];
    binaryInstructions.forEach((inst, j) => {
      const binaryInstructionIndex = binaryInstructionNumbers[j];
      const temp: IBinaryData = {
        lineNumber: binaryInstructionIndex,
        data: inst,
      };
      binaryData.push(temp);
    });
    mappingDetail.push({
      key: i,
      assembly: assemblyLine,
      binary: binaryData,
    });
  }
  return mappingDetail;
}

/*
assignment2 util
*/

/*
  Procedure: fromBinary
  Purpose: From binary to integer
*/

export function fromBinary(bits: string): number {
  return parseInt(bits, 2);
}

/*
  Procedure: memRead
  Purpose: read a 32-bit word from memory
*/

export function memRead(address: number): number {
  for (let i = 0; i < MEM_NREGIONS; ++i) {
    if (
      address >= memRegions[i].start &&
      address < memRegions[i].start + memRegions[i].size
    ) {
      const offset = address - memRegions[i].start;
      const result =
        (memRegions[i].mem[offset + 3] << 24) |
        (memRegions[i].mem[offset + 2] << 16) |
        (memRegions[i].mem[offset + 1] << 8) |
        (memRegions[i].mem[offset + 0] << 0);
      return result;
    }
  }
}

/*
  Procedure: memWrite
  Purpose: Write a 32-bit word to memory
*/

export function memWrite(address: number, value: number): void {
  for (let i = 0; i < MEM_NREGIONS; ++i) {
    if (
      address >= memRegions[i].start &&
      address < memRegions[i].start + memRegions[i].size
    ) {
      const offset = address - memRegions[i].start;

      memRegions[i].mem[offset + 3] = (value >> 24) & 0xff;
      memRegions[i].mem[offset + 2] = (value >> 16) & 0xff;
      memRegions[i].mem[offset + 1] = (value >> 8) & 0xff;
      memRegions[i].mem[offset + 0] = (value >> 0) & 0xff;

      /* set_offBound */
      memRegions[i].dirty = true;
      if (memRegions[i].type === MEM_GROW_UP) {
        memRegions[i].offBound =
          offset + 4 > memRegions[i].offBound
            ? offset + 4
            : memRegions[i].offBound;
      } else
        memRegions[i].offBound =
          offset + 4 < memRegions[i].offBound
            ? offset + 4
            : memRegions[i].offBound;
    }
  }
}

/*
  Procedure: memWriteHalf
  Purpose: Write a half of 32-bit word to memory
*/

export function memWriteHalf(address: number, value: number): void {
  for (let i = 0; i < MEM_NREGIONS; ++i) {
    if (
      address >= memRegions[i].start &&
      address < memRegions[i].start + memRegions[i].size
    ) {
      const offset = address - memRegions[i].start;

      memRegions[i].mem[offset + 1] = (value >> 8) & 0xff;
      memRegions[i].mem[offset + 0] = (value >> 0) & 0xff;

      /* set_offBound */
      memRegions[i].dirty = true;
      if (memRegions[i].type === MEM_GROW_UP)
        memRegions[i].offBound =
          offset + 2 > memRegions[i].offBound
            ? offset + 2
            : memRegions[i].offBound;
      else
        memRegions[i].offBound =
          offset + 2 < memRegions[i].offBound
            ? offset + 2
            : memRegions[i].offBound;
    }
  }
}

/*
  Procedure: initMemory
*/
export function initMemory(): void {
  for (let i = 0; i < MEM_NREGIONS; ++i) {
    memRegions[i].mem = Array.from({length: memRegions[i].size}, () => 0);
  }
}

/*
  Procedure: initInstInfo
*/
export function initInstInfo(
  NUM_INST: number,
  INST_INFO: InstructionType[],
): void {
  for (let i = 0; i < NUM_INST; ++i) {
    INST_INFO[i].value = 0;
    INST_INFO[i].opcode = 0;
    INST_INFO[i].funcCode = 0;
    INST_INFO[i].rs = 0;
    INST_INFO[i].rt = 0;
    INST_INFO[i].rd = 0;
    INST_INFO[i].imm = 0;
    INST_INFO[i].shamt = 0;
    INST_INFO[i].target = 0;
  }
}

/*
  Procedure: get_inst_info
  Purpose: Read instruction information
*/
export function getInstInfo(pc: number): instruction {
  return INST_INFO[(pc - MEM_TEXT_START) >> 2];
}

/*
  Procedure: main process
*/

export async function mainProcess(
  INST_INFO: instruction[],
  cycles: number,
  CYCLES: simulatorOutputType[],
): Promise<simulatorOutputType> {
  let i = cycles;
  let result = '';

  return new Promise<simulatorOutputType>((resolve, reject) => {
    try {
      if (DEBUG_SET) {
        console.log(`Simulating for ${cycles} cycles...!!\n`);
        console.log('MAIN PROCESS', CYCLES);
        while (i > 0) {
          cycle();
          rdump();

          if (MEM_DUMP_SET) dumpMemory();

          i -= 1;

          if (RUN_BIT === 0) break;
        }
      } else {
        running(i, CYCLES);
        result += rdump();

        if (MEM_DUMP_SET) {
          result += dumpMemory();
        }

        let EachCycle: string = rdump();
        if (MEM_DUMP_SET) EachCycle += dumpMemory();
        CYCLES.push(parseSimulatorOutput(EachCycle));
      }
      const returnObject = parseSimulatorOutput(result);
      resolve(returnObject);
    } catch (error) {
      reject(error);
    }
  });
}

/*
  Procedure: cycle
  Purpose: Execute a cycle
*/

export function cycle(): void {
  process_instruction();
  instAddOne();
}

export function dumpMemory(): string {
  let dump_string = '';
  if (memData.dirty) {
    const dstart = memData.start;
    const dstop = memData.start + memData.offBound;
    dump_string += `Data section\n`;
    dump_string += mdump(dstart, dstop);
    dump_string += '\n';
  }

  if (memStack.dirty) {
    const dstart = memStack.start + memStack.offBound;
    const dstop = memStack.start + memStack.size - 4;
    dump_string += `Stack section\n`;
    dump_string += mdump(dstart, dstop);
    dump_string += '\n';
  }

  return dump_string;
}

/*
  Procedure: mdump
  Purpose: Dump a word-aligned region of memory to the output file.
*/
export function mdump(start: number, stop: number): string {
  let mdump_string = '';
  for (let i = start; i < stop + 1; i += 4) {
    mdump_string += `0x${toHexAndPad(i)}: 0x${toHexAndPad(memRead(i))}\n`;
    // mdump_string += `0x${i.toString(16).padStart(8, '0')}: 0x${memRead(i)
    //   .toString(16)
    //   .padStart(8, '0')}\n`;
  }
  mdump_string += '\n';
  return mdump_string;
}

/*
  Procedure: rdump
  Purpose:  Dump current register and bus values to the output file.
*/
export function rdump(): string {
  let rdump_string = '';
  rdump_string += 'Program Counter\n';
  rdump_string += `PC: 0x${toHexAndPad(currentState.PC)}\n`;
  // rdump_string += `PC: 0x${currentState.PC.toString(16).padStart(8, '0')}\n`;
  rdump_string += `Registers\n`;
  for (let k = 0; k < MIPS_REGS; ++k) {
    rdump_string += `R${k}: 0x${toHexAndPad((currentState.REGS[k] >>>= 0))}\n`;
    // rdump_string += `R${k}: 0x${(currentState.REGS[k] >>>= 0)
    //   .toString(16)
    //   .padStart(8, '0')}\n`;
  }

  rdump_string += '\n';
  return rdump_string;
}

/*
  Procedure: run n
  Purpose: Simulate MIPS for n cycles
*/
export function running(num_cycles: number, CYCLES: simulatorOutputType[]) {
  let running_string = '';
  if (RUN_BIT === 0) {
    running_string = "Can't simulate, Simulator is halted\n";
    //console.log(running_string);
  }

  running_string = `Simulating for ${num_cycles} cycles...\n\n`;

  for (let i = 0; i < num_cycles; ++i) {
    if (RUN_BIT === 0) {
      running_string += 'Simulator halted\n\n';
      break;
    }
    let EachCycle: string = rdump();
    if (MEM_DUMP_SET) EachCycle += dumpMemory();
    CYCLES.push(parseSimulatorOutput(EachCycle));
    cycle();
  }

  console.log(running_string);
}
