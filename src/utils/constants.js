const DEBUG = 0;

const MAX_SYMBOL_TABLE_SIZE = 1024;
const MEM_TEXT_START = 0x00400000;
const MEM_DATA_START = 0x10000000;
const BYTES_PER_WORD = 4;
const INST_LIST_LEN = 27;

// Additional Components
const bcolors = {
  BLUE: "\033[94m",
  YELLOW: "\033[93m",
  GREEN: "\033[92m",
  RED: "\033[91m",
  ENDC: "\033[0m",
};

const start = "[" + bcolors.BLUE + "START" + bcolors.ENDC + "]  ";
const done = "[" + bcolors.YELLOW + "DONE" + bcolors.ENDC + "]   ";
const success = "[" + bcolors.GREEN + "SUCCESS" + bcolors.ENDC + "]";
const error = "[" + bcolors.RED + "ERROR" + bcolors.ENDC + "]  ";

pType = [start, done, success, error];

function log(printType, content) {
  console.log(pType[printType] + content);
}

// Structure Declaration

class inst_t {
  constructor(name, op, type, funct) {
    this.name = name;
    this.op = op;
    this.type = type;
    this.funct = funct;
  }
}

class symbol_t {
  constructor() {
    this.name = 0;
    this.address = 0;
  }
}

class la_struct {
  constructor(op, rt, imm) {
    this.op = op;
    this.rt = rt;
    this.imm = imm;
  }
}

const section = {
  DATA: 0,
  TEXT: 1,
  MAX_SIZE: 2,
};

// Global Variable Declaration

ADD = new inst_t("add", "000000", "R", "100000");
ADDI = new inst_t("addi", "001000", "I", "");
ADDIU = new inst_t("addiu", "001001", "I", "");
ADDU = new inst_t("addu", "000000", "R", "100001");
AND = new inst_t("and", "000000", "R", "100100");
ANDI = new inst_t("andi", "001100", "I", "");
BEQ = new inst_t("beq", "000100", "I", "");
BNE = new inst_t("bne", "000101", "I", "");
J = new inst_t("j", "000010", "J", "");
JAL = new inst_t("jal", "000011", "J", "");
JR = new inst_t("jr", "000000", "R", "001000");
LHU = new inst_t("lhu", "100101", "I", "");
LUI = new inst_t("lui", "001111", "I", "");
LW = new inst_t("lw", "100011", "I", "");
NOR = new inst_t("nor", "000000", "R", "100111");
OR = new inst_t("or", "000000", "R", "100101");
ORI = new inst_t("ori", "001101", "I", "");
SLT = new inst_t("slt", "000000", "R", "101010");
SLTI = new inst_t("slti", "001010", "I", "");
SLTIU = new inst_t("sltiu", "001011", "I", "");
SLTU = new inst_t("sltu", "000000", "R", "101011");
SLL = new inst_t("sll", "000000", "R", "000000");
SRL = new inst_t("srl", "000000", "R", "000010");
SH = new inst_t("sh", "101001", "I", "");
SW = new inst_t("sw", "101011", "I", "");
SUB = new inst_t("sub", "000000", "R", "100010");
SUBU = new inst_t("subu", "000000", "R", "100011");

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
const symbol_struct = new symbol_t();
const SYMBOL_TABLE = [];
