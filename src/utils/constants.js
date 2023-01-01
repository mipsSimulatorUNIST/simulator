export const DEBUG = 0;

export const MAX_SYMBOL_TABLE_SIZE = 1024;
export const MEM_TEXT_START = 0x00400000;
export const MEM_DATA_START = 0x10000000;
export const BYTES_PER_WORD = 4;
export const INST_LIST_LEN = 27;

export const bcolors = {
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

export const pType = [start, done, success, error];
// Structure Declaration

export class instT {
  constructor(name, op, type, funct) {
    this.name = name;
    this.op = op;
    this.type = type;
    this.funct = funct;
  }
}

export class symbolT {
  constructor() {
    this.name = 0;
    this.address = 0;
  }
}

export class laStruct {
  constructor(op, rt, imm) {
    this.op = op;
    this.rt = rt;
    this.imm = imm;
  }
}

export const section = {
  DATA: 0,
  TEXT: 1,
  MAX_SIZE: 2,
};

// Global Variable Declaration

const ADD = new instT('add', '000000', 'R', '100000');
const ADDI = new instT('addi', '001000', 'I', '');
const ADDIU = new instT('addiu', '001001', 'I', '');
const ADDU = new instT('addu', '000000', 'R', '100001');
const AND = new instT('and', '000000', 'R', '100100');
const ANDI = new instT('andi', '001100', 'I', '');
const BEQ = new instT('beq', '000100', 'I', '');
const BNE = new instT('bne', '000101', 'I', '');
const J = new instT('j', '000010', 'J', '');
const JAL = new instT('jal', '000011', 'J', '');
const JR = new instT('jr', '000000', 'R', '001000');
const LHU = new instT('lhu', '100101', 'I', '');
const LUI = new instT('lui', '001111', 'I', '');
const LW = new instT('lw', '100011', 'I', '');
const NOR = new instT('nor', '000000', 'R', '100111');
const OR = new instT('or', '000000', 'R', '100101');
const ORI = new instT('ori', '001101', 'I', '');
const SLT = new instT('slt', '000000', 'R', '101010');
const SLTI = new instT('slti', '001010', 'I', '');
const SLTIU = new instT('sltiu', '001011', 'I', '');
const SLTU = new instT('sltu', '000000', 'R', '101011');
const SLL = new instT('sll', '000000', 'R', '000000');
const SRL = new instT('srl', '000000', 'R', '000010');
const SH = new instT('sh', '101001', 'I', '');
const SW = new instT('sw', '101011', 'I', '');
const SUB = new instT('sub', '000000', 'R', '100010');
const SUBU = new instT('subu', '000000', 'R', '100011');

const instList = [
  ADD,
  ADDI,
  ADDIU,
  ADDU,
  AND,
  ANDI,
  BEQ,
  BNE,
  J,
  JAL,
  JR,
  LHU,
  LUI,
  LW,
  NOR,
  OR,
  ORI,
  SLT,
  SLTI,
  SLTIU,
  SLTU,
  SLL,
  SRL,
  SH,
  SW,
  SUB,
  SUBU,
];

// Global symbol table
export const symbolStruct = new symbolT();
export const SYMBOL_TABLE = {};
