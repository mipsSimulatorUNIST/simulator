import {
  DEBUG,
  pType,
  SYMBOL_TABLE,
  SymbolTableType,
  MEM_NREGIONS,
  MEM_REGIONS,
  MEM_GROW_UP,
  MEM_GROW_DOWN,
  RUN_BIT,
  MIPS_REGS,
  MEM_DATA,
  MEM_TEXT,
  MEM_STACK,
  MEM_DATA_START,
  MEM_TEXT_START,
  MEM_STACK_START,
  MEM_STACK_SIZE,
  CURRENT_STATE,
  INST_ADD,
  NUM_INST_SET,
  DEBUG_SET,
  MEM_DUMP_SET,
  INST_INFO,
  instruction,
  InstructionType,
} from './constants';
import * as fs from 'fs';
import path from 'path';
import {exit} from 'process';
import {process_instruction} from '../simulator/run';

export function parseInstr(buffer: string, index: number) {
  //[TODO] Implement this function
  let instr: InstructionType = new instruction();
  return instr;
}

export function parseData(buffer: string, index: number) {
  //[TODO] Implement this function
  return;
}

export function printParseResult(INST_INFO: InstructionType[]) {
  //[TODO] Implement this function
  return;
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

export function fromBinary(bits: string) {
  return parseInt(bits, 2);
}

/*
  Procedure: memRead
  Purpose: read a 32-bit word from memory
*/

export function memRead(address: number) {
  for (let i = 0; i < MEM_NREGIONS; ++i) {
    if (
      address >= MEM_REGIONS[i].start &&
      address < MEM_REGIONS[i].start + MEM_REGIONS[i].size
    ) {
      const offset = address - MEM_REGIONS[i].start;
      return (
        MEM_REGIONS[i].mem[offset + 3] << 24 ||
        MEM_REGIONS[i].mem[offset + 2] << 16 ||
        MEM_REGIONS[i].mem[offset + 1] << 8 ||
        MEM_REGIONS[i].mem[offset + 0] << 0
      );
    }
  }
}

/*
  Procedure: memWrite
  Purpose: Write a 32-bit word to memory
*/

function memWrite(address: number, value: number) {
  for (let i = 0; i < MEM_NREGIONS; ++i) {
    if (
      address >= MEM_REGIONS[i].start &&
      address < MEM_REGIONS[i].start + MEM_REGIONS[i].size
    ) {
      const offset = address - MEM_REGIONS[i].start;

      MEM_REGIONS[i].mem[offset + 3] = (value >> 24) & 0xff;
      MEM_REGIONS[i].mem[offset + 2] = (value >> 16) & 0xff;
      MEM_REGIONS[i].mem[offset + 1] = (value >> 8) & 0xff;
      MEM_REGIONS[i].mem[offset + 0] = (value >> 0) & 0xff;

      /* set_off_bound */
      MEM_REGIONS[i].dirty = true;
      if (MEM_REGIONS[i].type === MEM_GROW_UP)
        MEM_REGIONS[i].off_bound =
          offset + 4 > MEM_REGIONS[i].off_bound
            ? offset + 4
            : MEM_REGIONS[i].off_bound;
      else
        MEM_REGIONS[i].off_bound =
          offset + 4 < MEM_REGIONS[i].off_bound
            ? offset + 4
            : MEM_REGIONS[i].off_bound;
    }
  }
}

/*
  Procedure: memWriteHalf
  Purpose: Write a half of 32-bit word to memory
*/

function memWriteHalf(address: number, value: number) {
  for (let i = 0; i < MEM_NREGIONS; ++i) {
    if (
      address >= MEM_REGIONS[i].start &&
      address < MEM_REGIONS[i].start + MEM_REGIONS[i].size
    ) {
      const offset = address - MEM_REGIONS[i].start;

      MEM_REGIONS[i].mem[offset + 1] = (value >> 8) & 0xff;
      MEM_REGIONS[i].mem[offset + 0] = (value >> 0) & 0xff;

      /* set_off_bound */
      MEM_REGIONS[i].dirty = true;
      if (MEM_REGIONS[i].type === MEM_GROW_UP)
        MEM_REGIONS[i].off_bound =
          offset + 2 > MEM_REGIONS[i].off_bound
            ? offset + 2
            : MEM_REGIONS[i].off_bound;
      else
        MEM_REGIONS[i].off_bound =
          offset + 2 < MEM_REGIONS[i].off_bound
            ? offset + 2
            : MEM_REGIONS[i].off_bound;
    }
  }
}

/*
  Procedure: cycle
  Purpose: Execute a cycle
*/

export function cycle() {
  process_instruction();
  // INSTRUCTION_COUNT += 1;
  INST_ADD();
}

/*
  Procedure: run n
  Purpose: Simulate MIPS for n cycles
*/
export function running(num_cycles: number) {
  if (RUN_BIT === 0) {
    console.log("Can't simulate, Simulator is halted\n");
    return;
  }
  console.log('Simulating for ' + num_cycles + ' cycles...\n');
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
export function go() {
  if (RUN_BIT === 0) {
    console.log("Can't simulate, Simulator is halted\n");
    return;
  }
  console.log('Simulating...\n');
  while (RUN_BIT) cycle();
  console.log('Simulator halted\n');
}

export function dumpMemory() {
  if (MEM_DATA.dirty) {
    const dstart = MEM_DATA.start;
    const dstop = MEM_DATA_START + MEM_DATA.off_bound;
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

  if (MEM_STACK.dirty) {
    const dstart = MEM_STACK.start + MEM_STACK.off_bound;
    const dstop = MEM_STACK_START + MEM_STACK_SIZE - 4;
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
export function mdump(start: number, stop: number) {
  console.log('-------------------------------------');
  for (let i = start; i < stop + 1; i += 4) {
    console.log(
      i.toString(16).padStart(8, '0') +
        ': ' +
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
export function rdump() {
  console.log('Current register values :');
  console.log('-------------------------------------');
  console.log('PC:' + CURRENT_STATE.PC.toString(16).padStart(8, '0'));
  console.log('Registers:');
  for (let k = 0; k < MIPS_REGS; ++k) {
    console.log(
      'R' + k + ':' + CURRENT_STATE.REGS[k].toString(16).padStart(8, '0'),
    );
  }
  // console.log("PC: 0x%08x" % CURRENT_STATE.PC)
  // console.log("Registers:")
  // for k in range(MIPS_REGS):
  //     console.log("R%d: 0x%08x" % (k, ctypes.c_uint(CURRENT_STATE.REGS[k]).value))
  console.log('');
}

export function initMemory() {
  for (let i = 0; i < MEM_NREGIONS; ++i) {
    MEM_REGIONS[i].mem = Array.from({length: MEM_REGIONS[i].size}, () => 0);
    // MEM_REGIONS[i].mem = [0] * MEM_REGIONS[i].size;
  }
}

export function initInstInfo(NUM_INST: number) {
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

/* assignment2 run*/
export function OPCODE(INST) {
  return INST.opcode;
}

export function setOPCODE(INST, VAL) {
  INST.opcode = VAL;
}

export function FUNC(INST) {
  return INST.funcCode;
}

export function setFUNC(INST, VAL) {
  INST.funcCode = VAL;
}

export function RS(INST) {
  return INST.rs;
}

export function setRS(INST, VAL) {
  INST.rs = VAL;
}

export function RT(INST) {
  return INST.rt;
}

export function setRT(INST, VAL) {
  INST.rt = VAL;
}

export function RD(INST) {
  return INST.rd;
}

export function setRD(INST, VAL) {
  INST.rd = VAL;
}

export function FS(INST) {
  return RD(INST);
}

export function setFS(INST, VAL) {
  setRD(INST, VAL);
}

export function FT(INST) {
  return RT(INST);
}

export function SET_FT(INST, VAL) {
  setRT(INST, VAL);
}

export function FD(INST) {
  return SHAMT(INST);
}

export function setFD(INST, VAL) {
  setSHAMT(INST, VAL);
}

export function SHAMT(INST) {
  return INST.shamt;
}

export function setSHAMT(INST, VAL) {
  INST.shamt = VAL;
}

export function IMM(INST) {
  return INST.imm;
}

export function setIMM(INST, VAL) {
  INST.imm = VAL;
}

export function BASE(INST) {
  return RS(INST);
}

export function setBASE(INST, VAL) {
  setRS(INST, VAL);
}

export function IOFFSET(INST) {
  return IMM(INST);
}

export function setIOFFSET(INST, VAL) {
  setIMM(INST, VAL);
}

export function IDISP(INST) {
  const X = INST.imm << 2;
  return SIGN_EX(X);
}

export function COND(INST) {
  return RS(INST);
}

export function setCOND(INST, VAL) {
  setRS(INST, VAL);
}

export function CC(INST) {
  return RT(INST) >> 2;
}

export function ND(INST) {
  return (RT(INST) & 0x2) >> 1;
}

export function TF(INST) {
  return RT(INST) & 0x1;
}

export function TARGET(INST) {
  return INST.target;
}

export function setTARGET(INST, VAL) {
  INST.target = VAL;
}

export function ENCODING(INST) {
  return INST.encoding;
}

export function setENCODIGN(INST, VAL) {
  INST.encoding = VAL;
}

export function EXPR(INST) {
  return INST.expr;
}

export function setEXPR(INST, VAL) {
  INST.expr = VAL;
}

export function SOURCE(INST) {
  return INST.source_line;
}

export function setSOURCE(INST, VAL) {
  INST.source_line = VAL;
}

/* Sign Extension */
export function SIGN_EX(X) {
  if (X & 0x8000) return X | 0xffff0000;
  else return X;
}

export function branchINST(TEST, TARGET) {
  if (TEST) {
    const target = TARGET;
    jumpINST(target);
  }
}

export function jumpINST(TARGET) {
  CURRENT_STATE.PC = TARGET;
}

export function loadINST(LD, MASK) {
  return LD & MASK;
}

/*
  Procedure: get_inst_info
  Purpose: Read instruction information
*/
// export function getInstInfo(pc) {
//   return INST_INFO[(pc - MEM_TEXT_START) >> 2];
// }

export function mainProcess() {
  if (DEBUG_SET) {
    console.log('Simulating for ' + NUM_INST_SET + ' cycles');

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
