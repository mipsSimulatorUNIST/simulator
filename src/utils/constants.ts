export const DEBUG: number = 0;

export const MAX_SYMBOL_TABLE_SIZE: number = 1024;

export const MEM_TEXT_START: number = 0x00400000;
export const MEM_TEXT_SIZE: number = 0x00100000;
export const MEM_DATA_START: number = 0x10000000;
export const MEM_DATA_SIZE: number = 0x00100000;
export const MEM_STACK_START: number = 0x80000000;
export const MEM_STACK_SIZE: number = 0x00100000;

export const BYTES_PER_WORD: number = 4;
export const INST_LIST_LEN: number = 27;

export const MIPS_REGS: number = 32;
export const MEM_GROW_UP: number = 1;
export const MEM_GROW_DOWN: number = -1;
export const MEM_NREGIONS: number = 3;
export const DEBUG_SET = 1;
export const MEM_DUMP_SET = 1;

export let NUM_INST_SET = 10000; // how many cycles

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

const start: string = `[${bcolors.BLUE}START${bcolors.ENDC}]  `;
const done: string = `[${bcolors.YELLOW}DONE${bcolors.ENDC}]  `;
const success: string = `[${bcolors.GREEN}SUCCESS${bcolors.ENDC}]  `;
const error: string = `[${bcolors.RED}ERROR${bcolors.ENDC}]  `;

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

export class CPU_State {
  PC: number;
  REGS: Array<number>;
  constructor() {
    this.PC = 0; // program counter
    this.REGS = Array.from({length: 32}, () => 0); // register file
    this.REGS[29] = MEM_STACK_START; // initialize $sp
  }
}

export class instruction {
  opcode: number;
  func_code: number;
  value: number;
  target: number;
  rs: number;
  rt: number;
  imm: number;
  rd: number;
  shamt: number;
  constructor() {
    this.opcode = 0; //short
    this.func_code = 0; // short
    this.value = 0; // uint32_t
    this.target = 0; // uint32_t
    this.rs = 0; // unsigned char
    this.rt = 0; // unsigned char
    this.imm = 0; // short
    this.rd = 0; // unsigned char
    this.shamt = 0; // unsigned char
  }
}

/*
  All simulated memory will be managed by this class
  use the mem_write and mem_read functions to
  access/modify the simulated memory
*/
export class mem_region_t {
  start: number;
  size: number;
  mem: any; ////
  off_bound: number; // For useful memory dump
  type: number;
  dirty: boolean;
  constructor(start: number, size: number, type: number = MEM_GROW_UP) {
    this.start = start;
    this.size = size;
    this.mem = [];
    this.off_bound = -(size - 4) * type;
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

export const instList = {
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
export let SYMBOL_TABLE: object = {};

export const resetSymbolTable = () => {
  SYMBOL_TABLE = {};
};

/*
  Main memory
  memory will be dynamically allocated at initialization
*/
export const MEM_TEXT = new mem_region_t(MEM_TEXT_START, MEM_TEXT_SIZE);
export const MEM_DATA = new mem_region_t(MEM_DATA_START, MEM_DATA_SIZE);
export const MEM_STACK = new mem_region_t(
  MEM_STACK_START - MEM_STACK_SIZE,
  MEM_STACK_SIZE,
  MEM_GROW_DOWN,
);
export const MEM_REGIONS = [MEM_TEXT, MEM_DATA, MEM_STACK];
export let CURRENT_STATE = new CPU_State();
export let RUN_BIT: number = 0;
export let INSTRUCTION_COUNT: number = 0;

/* INSTRUCTION COUNT ADD */
export function INST_ADD() {
  INSTRUCTION_COUNT += 1;
}

export function NUM_INST_SUB() {
  NUM_INST_SET -= 1;
}
