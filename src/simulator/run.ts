import {
  BYTES_PER_WORD,
  currentState,
  changeRunBit,
  instruction,
  MEM_TEXT_START,
  NUM_INST,
} from '../utils/constants';
import {getInstInfo, memRead, memWrite, memWriteHalf} from '../utils/functions';

/* assignment2 run*/
export function OPCODE(INST: instruction): number {
  return INST.opcode;
}

export function setOPCODE(INST: instruction, VAL: number): void {
  INST.opcode = VAL;
}

export function FUNC(INST: instruction): number {
  return INST.funcCode;
}

export function setFUNC(INST: instruction, VAL: number): void {
  INST.funcCode = VAL;
}

export function RS(INST: instruction): number {
  return INST.rs;
}

export function setRS(INST: instruction, VAL: number): void {
  INST.rs = VAL;
}

export function RT(INST: instruction): number {
  return INST.rt;
}

export function setRT(INST: instruction, VAL: number): void {
  INST.rt = VAL;
}

export function RD(INST: instruction): number {
  return INST.rd;
}

export function setRD(INST: instruction, VAL: number): void {
  INST.rd = VAL;
}

export function FS(INST: instruction): number {
  return RD(INST);
}

export function setFS(INST: instruction, VAL: number): void {
  setRD(INST, VAL);
}

export function FT(INST: instruction): number {
  return RT(INST);
}

export function SET_FT(INST: instruction, VAL: number): void {
  setRT(INST, VAL);
}

export function FD(INST: instruction): number {
  return SHAMT(INST);
}

export function setFD(INST: instruction, VAL: number): void {
  setSHAMT(INST, VAL);
}

export function SHAMT(INST: instruction): number {
  return INST.shamt;
}

export function setSHAMT(INST: instruction, VAL: number): void {
  INST.shamt = VAL;
}

export function IMM(INST: instruction): number {
  return INST.imm;
}

export function setIMM(INST: instruction, VAL: number): void {
  INST.imm = VAL;
}

export function BASE(INST: instruction): number {
  return RS(INST);
}

export function setBASE(INST: instruction, VAL: number): void {
  setRS(INST, VAL);
}

export function IOFFSET(INST: instruction): number {
  return IMM(INST);
}

export function setIOFFSET(INST: instruction, VAL: number): void {
  setIMM(INST, VAL);
}

export function IDISP(INST: instruction): number {
  const X = INST.imm << 2;
  return signEX(X);
}

export function COND(INST: instruction): number {
  return RS(INST);
}

export function setCOND(INST: instruction, VAL: number): void {
  setRS(INST, VAL);
}

export function CC(INST: instruction): number {
  return RT(INST) >> 2;
}

export function ND(INST: instruction): number {
  return (RT(INST) & 0x2) >> 1;
}

export function TF(INST: instruction): number {
  return RT(INST) & 0x1;
}

export function TARGET(INST: instruction): number {
  return INST.target;
}

export function setTARGET(INST: instruction, VAL: number): void {
  INST.target = VAL;
}

export function ENCODING(INST: instruction): number {
  return INST.encoding;
}

export function setENCODIGN(INST: instruction, VAL: number): void {
  INST.encoding = VAL;
}

export function EXPR(INST: instruction): number {
  return INST.expr;
}

export function setEXPR(INST: instruction, VAL: number): void {
  INST.expr = VAL;
}

// export function SOURCE(INST: instruction) {
//   return INST.source_line;
// }

// export function setSOURCE(INST: instruction, VAL) {
//   INST.source_line = VAL;
// }

/* Sign Extension */
export function signEX(X: number): number {
  if (X & 0x8000) return X | 0xffff0000;
  else return X;
}

export function zeroEX(X: number): number {
  return X & 0x0000ffff;
}

export function branchINST(TEST, TARGET: number): void {
  if (TEST) {
    const target = TARGET;
    jumpINST(target);
  }
}

export function jumpINST(TARGET: number): void {
  currentState.PC = TARGET;
}

export function loadINST(LD: number, MASK: number): number {
  return LD & MASK;
}

/*
  Procedure: process_instruction
  Purpose: Process one instruction
*/
export function process_instruction() {
  const info: instruction = getInstInfo(currentState.PC);

  // R type
  if (OPCODE(info) === 0x0) {
    const rs: number = RS(info);
    const rt: number = RT(info);
    const rd: number = RD(info);
    const shamt: number = SHAMT(info);
    const funcCode: number = FUNC(info);

    // ADD
    if (funcCode === 32) {
      currentState.REGS[rd] = currentState.REGS[rs] + currentState.REGS[rt];
    }
    // ADDU
    else if (funcCode === 33) {
      currentState.REGS[rd] = currentState.REGS[rs] + currentState.REGS[rt];
    }
    // SUB
    else if (funcCode === 34) {
      currentState.REGS[rd] = currentState.REGS[rs] - currentState.REGS[rt];
    }
    // SUBU
    else if (funcCode === 35) {
      currentState.REGS[rd] = currentState.REGS[rs] - currentState.REGS[rt];
    }
    // AND
    else if (funcCode === 36) {
      currentState.REGS[rd] = currentState.REGS[rs] & currentState.REGS[rt];
    }
    // OR
    else if (funcCode === 37) {
      currentState.REGS[rd] = currentState.REGS[rs] | currentState.REGS[rt];
    }
    // NOR
    else if (funcCode === 39) {
      currentState.REGS[rd] = ~(currentState.REGS[rs] | currentState.REGS[rt]);
    }
    // SLT
    else if (funcCode === 42) {
      if (currentState.REGS[rs] < currentState.REGS[rt])
        currentState.REGS[rd] = 1;
      else currentState.REGS[rd] = 0;
    }
    // SLTU
    else if (funcCode === 43) {
      if (currentState.REGS[rs] < currentState.REGS[rt])
        currentState.REGS[rd] = 1;
      else currentState.REGS[rd] = 0;
    }
    // SLL
    else if (funcCode === 0) {
      currentState.REGS[rd] = currentState.REGS[rt] << shamt;
    }
    // SRL
    else if (funcCode === 2) {
      currentState.REGS[rd] = currentState.REGS[rt] >> shamt;
    }
    // JR
    else if (funcCode === 8) {
      currentState.PC = currentState.REGS[rs];
    }

    if (funcCode !== 8) currentState.PC += BYTES_PER_WORD;
  }
  // J
  else if (OPCODE(info) === 0x2) {
    const target: number = TARGET(info) << 2;
    jumpINST(target);
  }
  // JAL
  else if (OPCODE(info) === 0x3) {
    const target: number = TARGET(info) << 2;
    currentState.REGS[31] = currentState.PC + 8;
    jumpINST(target);
  }
  // I type
  else {
    const rs: number = RS(info);
    const rt: number = RT(info);
    const imm: number = IMM(info);
    const opcode: number = OPCODE(info);

    // ADDI
    if (opcode === 0x8) {
      currentState.REGS[rt] = currentState.REGS[rs] + signEX(imm);
    }
    // ADDIU
    else if (opcode === 0x9) {
      currentState.REGS[rt] = currentState.REGS[rs] + signEX(imm);
    }
    // ANDI
    else if (opcode === 0xc) {
      currentState.REGS[rt] = currentState.REGS[rs] & zeroEX(imm);
    }
    // BEQ
    else if (opcode === 0x4) {
      if (currentState.REGS[rs] === currentState.REGS[rt])
        currentState.PC += imm * 4;
    }
    // BNE
    else if (opcode === 0x5) {
      if (currentState.REGS[rs] !== currentState.REGS[rt]) {
        currentState.PC += signEX(imm) * 4;
      }
    }
    // LHU
    else if (opcode === 0x25) {
      currentState.REGS[rt] = loadINST(
        memRead(currentState.REGS[rs] + signEX(IOFFSET(info))),
        0x0000ffff,
      );
    }
    // LUI
    else if (opcode === 0xf) {
      currentState.REGS[rt] = imm << 16;
    }
    // LW
    else if (opcode == 0x23) {
      currentState.REGS[rt] = memRead(
        currentState.REGS[rs] + signEX(IOFFSET(info)),
      );
    }
    // ORI
    else if (opcode === 0xd) {
      currentState.REGS[rt] = currentState.REGS[rs] | zeroEX(imm);
    }
    // SLTI
    else if (opcode === 0xa) {
      if (currentState.REGS[rs] < signEX(imm)) currentState.REGS[rt] = 1;
      else currentState.REGS[rt] = 0;
    }

    // SLTIU
    else if (opcode === 0xb) {
      if (currentState.REGS[rs] < signEX(imm)) currentState.REGS[rt] = 1;
      else currentState.REGS[rt] = 0;
    }
    // SH
    else if (opcode === 0x29) {
      memWriteHalf(
        currentState.REGS[rs] + signEX(IOFFSET(info)),
        currentState.REGS[rt],
      );
    }
    // SW
    else if (opcode === 0x2b) {
      memWrite(
        currentState.REGS[rs] + signEX(IOFFSET(info)),
        currentState.REGS[rt],
      );
    }

    currentState.PC += BYTES_PER_WORD;
  }

  if (currentState.PC - MEM_TEXT_START === NUM_INST * 4) {
    changeRunBit();
  }
}
