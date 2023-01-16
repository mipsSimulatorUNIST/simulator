import {InstructionType, currentState} from '../utils/constants';

/* assignment2 run*/
export function OPCODE(INST: InstructionType): number {
  return INST.opcode;
  // return INST.opcode;
}

export function setOPCODE(INST: InstructionType, VAL: number): void {
  INST.opcode = VAL;
}

export function FUNC(INST: InstructionType): number {
  return INST.funcCode;
}

export function setFUNC(INST: InstructionType, VAL: number): void {
  INST.funcCode = VAL;
}

export function RS(INST: InstructionType): number {
  return INST.rs;
}

export function setRS(INST: InstructionType, VAL: number): void {
  INST.rs = VAL;
}

export function RT(INST: InstructionType): number {
  return INST.rt;
}

export function setRT(INST: InstructionType, VAL: number): void {
  INST.rt = VAL;
}

export function RD(INST: InstructionType): number {
  return INST.rd;
}

export function setRD(INST: InstructionType, VAL: number): void {
  INST.rd = VAL;
}

export function FS(INST: InstructionType): number {
  return RD(INST);
}

export function setFS(INST: InstructionType, VAL: number): void {
  setRD(INST, VAL);
}

export function FT(INST: InstructionType): number {
  return RT(INST);
}

export function SET_FT(INST: InstructionType, VAL: number): void {
  setRT(INST, VAL);
}

export function FD(INST: InstructionType): number {
  return SHAMT(INST);
}

export function setFD(INST: InstructionType, VAL: number): void {
  setSHAMT(INST, VAL);
}

export function SHAMT(INST: InstructionType): number {
  return INST.shamt;
}

export function setSHAMT(INST: InstructionType, VAL: number): void {
  INST.shamt = VAL;
}

export function IMM(INST: InstructionType): number {
  return INST.imm;
}

export function setIMM(INST: InstructionType, VAL: number): void {
  INST.imm = VAL;
}

export function BASE(INST: InstructionType): number {
  return RS(INST);
}

export function setBASE(INST: InstructionType, VAL: number): void {
  setRS(INST, VAL);
}

export function IOFFSET(INST: InstructionType): number {
  return IMM(INST);
}

export function setIOFFSET(INST: InstructionType, VAL: number): void {
  setIMM(INST, VAL);
}

export function IDISP(INST: InstructionType): number {
  const X = INST.imm << 2;
  return SIGN_EX(X);
}

export function COND(INST: InstructionType): number {
  return RS(INST);
}

export function setCOND(INST: InstructionType, VAL: number): void {
  setRS(INST, VAL);
}

export function CC(INST: InstructionType): number {
  return RT(INST) >> 2;
}

export function ND(INST: InstructionType): number {
  return (RT(INST) & 0x2) >> 1;
}

export function TF(INST: InstructionType): number {
  return RT(INST) & 0x1;
}

export function TARGET(INST: InstructionType): number {
  return INST.target;
}

export function setTARGET(INST: InstructionType, VAL: number): void {
  INST.target = VAL;
}

export function ENCODING(INST: InstructionType): number {
  return INST.encoding;
}

export function setENCODIGN(INST: InstructionType, VAL: number): void {
  INST.encoding = VAL;
}

export function EXPR(INST: InstructionType): number {
  return INST.expr;
}

export function setEXPR(INST: InstructionType, VAL: number): void {
  INST.expr = VAL;
}

// export function SOURCE(INST: InstructionType) {
//   return INST.source_line;
// }

// export function setSOURCE(INST: InstructionType, VAL) {
//   INST.source_line = VAL;
// }

/* Sign Extension */
export function SIGN_EX(X: number): number {
  if (X & 0x8000) return X | 0xffff0000;
  else return X;
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
  return;
}
