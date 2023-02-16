import {initMemory, initInstInfo, parseData, parseInstr} from './functions';

export const DEBUG = 0;
export const MAX_SYMBOL_TABLE_SIZE = 1024;

export const MEM_TEXT_START = 0x00400000;
export const MEM_TEXT_SIZE = 0x00100000;
export const MEM_DATA_START = 0x10000000;
export const MEM_DATA_SIZE = 0x00100000;
export const MEM_STACK_START = 0x80000000;
export const MEM_STACK_SIZE = 0x00100000;

export const BYTES_PER_WORD = 4;
export const INST_LIST_LEN = 27;

export const MIPS_REGS = 32;
export const MEM_GROW_UP = 1;
export const MEM_GROW_DOWN = -1;
export const MEM_NREGIONS = 3;
export const DEBUG_SET = 0;
export const MEM_DUMP_SET = 1;

export let RUN_BIT = 1;
export let INSTRUCTION_COUNT = 0;

/*
  Main memory
  memory will be dynamically allocated at initialization
*/
export let memText: memRegionT;
export let memData: memRegionT;
export let memStack: memRegionT;
export let memRegions: memRegionT[];
export let currentState: cpuState;
export let NUM_INST: number;

export const INST_INFO: InstructionType[] = [];

export type InstructionType = {
  opcode: number;
  funcCode: number;
  value: number;
  target: number;
  rs: number;
  rt: number;
  imm: number;
  rd: number;
  shamt: number;
  encoding: number;
  expr: number;
};

type BcolorsType = {
  BLUE: string;
  YELLOW: string;
  GREEN: string;
  RED: string;
  ENDC: string;
};

type SectionType = {
  DATA: number;
  TEXT: number;
  MAX_SIZE: number;
};

export interface SymbolTableType {
  name: string;
  address: number;
}

export const section: SectionType = {
  DATA: 0,
  TEXT: 1,
  MAX_SIZE: 2,
};

export const bcolors: BcolorsType = {
  BLUE: '\x1B[34m',
  YELLOW: '\x1B[33m',
  GREEN: '\x1B[32m',
  RED: '\x1B[31m',
  ENDC: '\x1B[0m',
};

const start = `[${bcolors.BLUE}START${bcolors.ENDC}]  `;
const done = `[${bcolors.YELLOW}DONE${bcolors.ENDC}]  `;
const success = `[${bcolors.GREEN}SUCCESS${bcolors.ENDC}]  `;
const error = `[${bcolors.RED}ERROR${bcolors.ENDC}]  `;

export const pType: string[] = [start, done, success, error];
// Structure Declaration
export class instT {
  name: string;
  type: string;
  op: string;
  funct: string;

  constructor(name: string, op: string, type: string, funct: string) {
    this.name = name;
    this.op = op;
    this.type = type;
    this.funct = funct;
  }
}

export class symbolT {
  name: string;
  address: number;

  constructor() {
    this.name = '';
    this.address = 0;
  }
}

export class laStruct {
  op: string;
  rt: string;
  imm: string;

  constructor(op: string, rt: string, imm: string) {
    this.op = op;
    this.rt = rt;
    this.imm = imm;
  }
}

export class cpuState {
  PC: number;
  REGS: number[];
  constructor() {
    this.PC = 0;
    this.REGS = Array.from({length: 32}, () => 0);
    this.REGS[29] = MEM_STACK_START;
  }
}

export class instruction {
  opcode: number;
  funcCode: number;
  value: number;
  target: number;
  rs: number;
  rt: number;
  imm: number;
  rd: number;
  shamt: number;
  encoding: number;
  expr: number;

  constructor() {
    this.opcode = 0;
    this.funcCode = 0;
    this.value = 0;
    this.target = 0;
    this.rs = 0;
    this.rt = 0;
    this.imm = 0;
    this.rd = 0;
    this.shamt = 0;
    this.encoding = 0;
    this.expr = 0;
  }
}

export function initialize(
  binary: string[],
  textSize: number,
  dataSize: number,
): InstructionType[] {
  initMemory();

  // Load program and service routines into mem
  let textIndex = 0;
  let buffer: string;
  let size = 0;
  const instructs: InstructionType = new instruction();

  NUM_INST = ~~(textSize / 4); //몫

  // initial memory allocation of text segment
  for (let i = 0; i < NUM_INST; i++) INST_INFO.push(instructs);
  initInstInfo(NUM_INST, INST_INFO);

  for (let i = 0; i < binary.length; i++) {
    buffer = binary[i];
    if (size < textSize) {
      INST_INFO[textIndex] = parseInstr(buffer, size);
      textIndex += 1;
    } else if (size < textSize + dataSize) {
      parseData(buffer, size - textSize);
    }
    size += 4;
  }
  //printParseResult(INST_INFO, textSize, dataSize);
  currentState.PC = MEM_TEXT_START;

  RUN_BIT = 1;
  return INST_INFO;
}
/*
  All simulated memory will be managed by this class
  use the mem_write and mem_read functions to
  access/modify the simulated memory
*/
export class memRegionT {
  start: number;
  size: number;
  mem: number[]; ////////////////////////////////////
  offBound: number;
  type: number;
  dirty: boolean;
  constructor(start: number, size: number, type: number = MEM_GROW_UP) {
    this.start = start;
    this.size = size;
    this.mem = [];
    this.offBound = -(size - 4) * type;
    this.type = type;
    this.dirty = false;
  }
}

// Global Variable Declaration
const SLL = new instT('sll', '000000', 'R', '000000');
const SRL = new instT('srl', '000000', 'R', '000010');
const JR = new instT('jr', '000000', 'R', '001000');
const ADD = new instT('add', '000000', 'R', '100000');
const ADDU = new instT('addu', '000000', 'R', '100001');
const AND = new instT('and', '000000', 'R', '100100');
const NOR = new instT('nor', '000000', 'R', '100111');
const OR = new instT('or', '000000', 'R', '100101');
const SLT = new instT('slt', '000000', 'R', '101010');
const SLTU = new instT('sltu', '000000', 'R', '101011');
const SUB = new instT('sub', '000000', 'R', '100010');
const SUBU = new instT('subu', '000000', 'R', '100011');
const LUI = new instT('lui', '001111', 'I', '');
const BEQ = new instT('beq', '000100', 'I', '');
const BNE = new instT('bne', '000101', 'I', '');
const LW = new instT('lw', '100011', 'I', '');
const LHU = new instT('lhu', '100101', 'I', '');
const SW = new instT('sw', '101011', 'I', '');
const SH = new instT('sh', '101001', 'I', '');
const ADDI = new instT('addi', '001000', 'I', '');
const ADDIU = new instT('addiu', '001001', 'I', '');
const ANDI = new instT('andi', '001100', 'I', '');
const ORI = new instT('ori', '001101', 'I', '');
const SLTI = new instT('slti', '001010', 'I', '');
const SLTIU = new instT('sltiu', '001011', 'I', '');
const J = new instT('j', '000010', 'J', '');
const JAL = new instT('jal', '000011', 'J', '');

export interface IinstList {
  [key: string]: instT;
}

export const instList: IinstList = {
  add: ADD,
  addi: ADDI,
  addiu: ADDIU,
  addu: ADDU,
  and: AND,
  andi: ANDI,
  beq: BEQ,
  bne: BNE,
  j: J,
  jal: JAL,
  jr: JR,
  lhu: LHU,
  lui: LUI,
  lw: LW,
  nor: NOR,
  or: OR,
  ori: ORI,
  slt: SLT,
  slti: SLTI,
  sltiu: SLTIU,
  sltu: SLTU,
  sll: SLL,
  srl: SRL,
  sh: SH,
  sw: SW,
  sub: SUB,
  subu: SUBU,
};

// Global symbol table
export const symbolStruct = new symbolT();

export interface ISYMBOL_TABLE {
  [key: string]: number;
}
export let SYMBOL_TABLE: ISYMBOL_TABLE = {};

export const resetSymbolTable = () => {
  SYMBOL_TABLE = {};
};

export const initializeMem = () => {
  INSTRUCTION_COUNT = 0;
  RUN_BIT = 1;
  memText = new memRegionT(MEM_TEXT_START, MEM_TEXT_SIZE);
  memData = new memRegionT(MEM_DATA_START, MEM_DATA_SIZE);
  memStack = new memRegionT(
    MEM_STACK_START - MEM_STACK_SIZE,
    MEM_STACK_SIZE,
    MEM_GROW_DOWN,
  );
  memRegions = [memText, memData, memStack];
  currentState = new cpuState();
};

/* INSTRUCTION COUNT ADD */
export const instAddOne = () => {
  INSTRUCTION_COUNT += 1;
};

export const numInstSub = () => {
  NUM_INST -= 1;
};

export const changeRunBit = () => {
  RUN_BIT = 0;
};
