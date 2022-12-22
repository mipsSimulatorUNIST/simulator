const DEBUG = 0;

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

const start = '[' + bcolors.BLUE + 'START' + bcolors.ENDC + ']  ';
const done = '[' + bcolors.YELLOW + 'DONE' + bcolors.ENDC + ']   ';
const success = '[' + bcolors.GREEN + 'SUCCESS' + bcolors.ENDC + ']';
const error = '[' + bcolors.RED + 'ERROR' + bcolors.ENDC + ']  ';

export const pType = [start, done, success, error];
// Structure Declaration

export class inst_t {
  constructor(name, op, type, funct) {
    this.name = name;
    this.op = op;
    this.type = type;
    this.funct = funct;
  }
}

export class symbol_t {
  constructor() {
    this.name = 0;
    this.address = 0;
  }
}

export class la_struct {
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

const ADD = new inst_t('add', '000000', 'R', '100000');
const ADDI = new inst_t('addi', '001000', 'I', '');
const ADDIU = new inst_t('addiu', '001001', 'I', '');
const ADDU = new inst_t('addu', '000000', 'R', '100001');
const AND = new inst_t('and', '000000', 'R', '100100');
const ANDI = new inst_t('andi', '001100', 'I', '');
const BEQ = new inst_t('beq', '000100', 'I', '');
const BNE = new inst_t('bne', '000101', 'I', '');
const J = new inst_t('j', '000010', 'J', '');
const JAL = new inst_t('jal', '000011', 'J', '');
const JR = new inst_t('jr', '000000', 'R', '001000');
const LHU = new inst_t('lhu', '100101', 'I', '');
const LUI = new inst_t('lui', '001111', 'I', '');
const LW = new inst_t('lw', '100011', 'I', '');
const NOR = new inst_t('nor', '000000', 'R', '100111');
const OR = new inst_t('or', '000000', 'R', '100101');
const ORI = new inst_t('ori', '001101', 'I', '');
const SLT = new inst_t('slt', '000000', 'R', '101010');
const SLTI = new inst_t('slti', '001010', 'I', '');
const SLTIU = new inst_t('sltiu', '001011', 'I', '');
const SLTU = new inst_t('sltu', '000000', 'R', '101011');
const SLL = new inst_t('sll', '000000', 'R', '000000');
const SRL = new inst_t('srl', '000000', 'R', '000010');
const SH = new inst_t('sh', '101001', 'I', '');
const SW = new inst_t('sw', '101011', 'I', '');
const SUB = new inst_t('sub', '000000', 'R', '100010');
const SUBU = new inst_t('subu', '000000', 'R', '100011');

const inst_list = [
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
export const symbol_struct = new symbol_t();
export const SYMBOL_TABLE = [];
