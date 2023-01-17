import {
  DEBUG,
  pType,
  SYMBOL_TABLE,
  SymbolTableType,
  MEM_NREGIONS,
  memRegions,
  MEM_GROW_UP,
  MEM_GROW_DOWN,
  RUN_BIT,
  MIPS_REGS,
  memData,
  memText,
  memStack,
  MEM_DATA_START,
  MEM_TEXT_START,
  MEM_STACK_START,
  MEM_STACK_SIZE,
  currentState,
  instAdd,
  NUM_INST_SET,
  DEBUG_SET,
  MEM_DUMP_SET,
  INST_INFO,
  instruction,
  InstructionType,
  TEXT_SIZE,
  DATA_SIZE,
} from './constants';
import * as fs from 'fs';
import path from 'path';
import {exit} from 'process';
import {process_instruction} from '../simulator/run';

export function parseInstr(buffer: string, index: number): InstructionType {
  //[TODO] Implement this function
  let instr: InstructionType = new instruction();
  return instr;
}

export function parseData(buffer: string, index: number) {
  //[TODO] Implement this function
  return;
}

export function printParseResult(INST_INFO: InstructionType[]) {
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

  for (let i = 0; i < TEXT_SIZE / 4; i++) {
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
  for (let i = 0; i < TEXT_SIZE; i += 4) {
    console.log(
      `text_seg[${i}] : 0x${memRead(MEM_TEXT_START + i).toString(16)}`,
    );
  }
  for (let i = 0; i < DATA_SIZE; i += 4) {
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
  if (
    address >= memRegions[0].start &&
    address < memRegions[0].start + memRegions[0].size
  ) {
    const offset = address - memRegions[0].start;
    return (
      memRegions[0].mem[offset + 3] << 24 ||
      memRegions[0].mem[offset + 2] << 16 ||
      memRegions[0].mem[offset + 1] << 8 ||
      memRegions[0].mem[offset + 0] << 0
    );
  }

  if (
    address >= memRegions[1].start &&
    address < memRegions[1].start + memRegions[1].size
  ) {
    const offset = address - memRegions[1].start;
    return (
      memRegions[1].mem[offset + 3] << 24 ||
      memRegions[1].mem[offset + 2] << 16 ||
      memRegions[1].mem[offset + 1] << 8 ||
      memRegions[1].mem[offset + 0] << 0
    );
  }

  if (
    address >= memRegions[2].start &&
    address < memRegions[2].start + memRegions[2].size
  ) {
    const offset = address - memRegions[2].start;
    return (
      memRegions[2].mem[offset + 3] << 24 ||
      memRegions[2].mem[offset + 2] << 16 ||
      memRegions[2].mem[offset + 1] << 8 ||
      memRegions[2].mem[offset + 0] << 0
    );
  }
}

/*
  Procedure: memWrite
  Purpose: Write a 32-bit word to memory
*/

function memWrite(address: number, value: number): void {
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

function memWriteHalf(address: number, value: number): void {
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
  Procedure: cycle
  Purpose: Execute a cycle
*/

export function cycle(): void {
  process_instruction();
  // INSTRUCTION_COUNT += 1;
  instAdd();
}

/*
  Procedure: run n
  Purpose: Simulate MIPS for n cycles
*/
export function running(num_cycles: number): void {
  if (RUN_BIT === 0) {
    console.log("Can't simulate, Simulator is halted\n");
    return;
  }
  console.log('Simulating for ', num_cycles, ' cycles...\n');
  for (let i = 0; i < num_cycles; ++i) {
    if (RUN_BIT === 0) {
      console.log('Simulator halted\n');
      break;
    }
    cycle();
  }
}

/*
  Procedure: go
  Purpose: Simulate MIPS until HALTed
*/
export function go(): void {
  if (RUN_BIT === 0) {
    console.log("Can't simulate, Simulator is halted\n");
    return;
  }
  console.log('Simulating...\n');
  while (RUN_BIT) cycle();
  console.log('Simulator halted\n');
}

export function dumpMemory(): void {
  if (memData.dirty) {
    const dstart = memData.start;
    const dstop = memData.start + memData.offBound;
    console.log(
      'Data section [' +
        dstart.toString(16).padStart(8, '0') +
        '..' +
        dstop.toString(16).padStart(8, '0') +
        '] :',
    );
    // console.log("Data section [0x%8X..0x%8x] :" % (dstart, dstop))
    mdump(dstart, dstop);
    console.log('');
  }

  if (memStack.dirty) {
    const dstart = memStack.start + memStack.offBound;
    const dstop = memStack.start + memStack.size - 4;
    console.log(
      'Stack section [' +
        dstart.toString(16).padStart(8, '0') +
        '..' +
        dstop.toString(16).padStart(8, '0') +
        '] :',
    );
    // console.log("Stack section [0x%8X..0x%8x] :" % (dstart, dstop))
    mdump(dstart, dstop);
    console.log('');
  }
}

/*
  Procedure: mdump
  Purpose: Dump a word-aligned region of memory to the output file.
*/
export function mdump(start: number, stop: number): void {
  console.log('-------------------------------------');
  for (let i = start; i < stop + 1; i += 4) {
    console.log(
      i.toString(16).padStart(8, '0') + ': ',
      memRead(i).toString(16).padStart(8, '0'),
    );
    // console.log("0x%08x: 0x%08x" % (i, memRead(i)))
  }
  console.log('');
}

/*
  Procedure: rdump
  Purpose:  Dump current register and bus values to the output file.
*/
export function rdump(): void {
  console.log('Current register values :');
  console.log('-------------------------------------');
  console.log('PC:' + currentState.PC.toString(16).padStart(8, '0'));
  console.log('Registers:');
  for (let k = 0; k < MIPS_REGS; ++k) {
    console.log(
      'R',
      k,
      ':' + currentState.REGS[k].toString(16).padStart(8, '0'),
    );
  }
  // console.log("PC: 0x%08x" % currentState.PC)
  // console.log("Registers:")
  // for k in range(MIPS_REGS):
  //     console.log("R%d: 0x%08x" % (k, ctypes.c_uint(currentState.REGS[k]).value))
  console.log('');
}

export function initMemory(): void {
  for (let i = 0; i < MEM_NREGIONS; ++i) {
    memRegions[i].mem = Array.from({length: memRegions[i].size}, () => 0);
    // memRegions[i].mem = [0] * memRegions[i].size;
  }
}

export function initInstInfo(NUM_INST: number): void {
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
export function getInstInfo(pc: number): InstructionType {
  return INST_INFO[(pc - MEM_TEXT_START) >> 2];
}

export function mainProcess(): void {
  if (DEBUG_SET) {
    console.log('Simulating for ', NUM_INST_SET, ' cycles');

    while (NUM_INST_SET > 0) {
      cycle();
      rdump();

      if (MEM_DUMP_SET) {
        dumpMemory();
      }
    }
  } else {
    running(NUM_INST_SET);
    rdump();

    if (MEM_DUMP_SET) {
      dumpMemory();
    }
  }
}
