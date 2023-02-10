import {
  BYTES_PER_WORD,
  instT,
  instList,
  MEM_DATA_START,
  MEM_TEXT_START,
  section,
  symbolT,
  SYMBOL_TABLE,
  resetSymbolTable,
} from '../utils/constants';
import {numToBits, symbolTableAddEntry, toHexAndPad} from '../utils/functions';

export const makeSymbolTable = (inputs: string[]) => {
  /*
   * make symbol table from assembly file
   * using SYMBOL_TABLE in constants.ts
   * 
   * 'dataSeg'에 data 저장
   * 'textSeg'에 text 저장
   * 
   * .text 
   * - indicates that following items are stored in the user text segment, typically instructions 
   * - It always starts from 0x400000 (MEM_TEXT_START)

   * .data 
   * - indicates that following data items are stored in the data segment 
   * - It always starts from 0x10000000 (MEM_DATA_START)
   * 
   * return
   * {
   *    dataSeg : dataSeg, 
   *    textSeg : textSeg, 
   *    dataSectionSize : dataSectionSize, 
   *    textSectionSize : textSectionSize
   * }
   * 
   * [USAGE EXAMPLE] 
   * const {dataSeg, textSeg, dataSectionSize, textSectionSize} = makeSymbolTable(inputs);
  */
  resetSymbolTable();
  let address = 0;
  let curSection = section.MAX_SIZE;

  let dataSectionSize = 0;
  let textSectionSize = 0;

  const dataSeg: string[] = [];
  const textSeg: string[] = [];
  inputs.forEach((input: string) => {
    const splited: string[] = input.split('\t').filter(s => s !== ''); // ex. ['array:', '.word', '3']
    const symbol: symbolT = new symbolT();

    if (splited[0] == '.data') {
      curSection = section.DATA;
      address = MEM_DATA_START;
      return;
    } else if (splited[0] == '.text') {
      curSection = section.TEXT;
      address = MEM_TEXT_START;
      return;
    } else if (curSection === section.DATA) {
      if (splited.length === 2) {
        // ex. ['.word','123']
        dataSeg.push(splited[1]);
      } else {
        // ex. ['array:', '.word', '3']
        symbol.address = address;
        symbol.name = splited[0].replace(':', '');
        symbolTableAddEntry(symbol);
        dataSeg.push(splited[2]);
      }

      dataSectionSize += BYTES_PER_WORD;
    } else if (curSection === section.TEXT) {
      if (splited.length === 1) {
        // ex. ['main:']
        symbol.name = splited[0].replace(':', '');
        symbol.address = address;
        symbolTableAddEntry(symbol);
        return;
      } else {
        // ex. ['and', '$17, $17, $0']
        const name: string = splited[0];
        textSeg.push(input); // ex. 'and	$17, $17, $0'

        if (name === 'la') {
          const targetSymbol: string = splited[1].split(' ')[1]; // ex. 'data1'
          const targetAddress: string = toHexAndPad(SYMBOL_TABLE[targetSymbol]);
          if (targetAddress.slice(4) !== '0000') {
            textSectionSize += BYTES_PER_WORD;
            address += BYTES_PER_WORD;
          }
        }
      }
      textSectionSize += BYTES_PER_WORD;
    }

    address += BYTES_PER_WORD;
  });
  return {dataSeg, textSeg, dataSectionSize, textSectionSize};
};

export function recordTextSection(textSeg: string[]): [string[], number[][]] {
  /*
   * parameter로 textSeg를 받는다.
   * textSeg 있는 text들 한 줄 씩 체크해서 binaryText 리스트에 바이너리 문장으로 추가
   * 명령어 타입별(R, I, J)로 명령어 이름별로 묶어서 번역
   *
   *  binaryText 이라는 list에 명령어를 번역한 binary 문장을 한 줄씩 추가
   *  return binaryText
   *  binaryText: ['00000000000000000000000001011000', '00000000000000000000000000001100']
   */

  let curAddress: number = MEM_TEXT_START;
  let instruct: string[];
  let address: number;
  let rs: string;
  let rt: string;
  let rd: string;
  let imm: string;
  let shamt: string;
  let immReg: string;
  const binaryText: string[] = [];
  const mappingTable: number[][] = [];

  let binaryInstructionCounter = 0;

  for (let i = 0; i < textSeg.length; i++) {
    const text = textSeg[i];

    mappingTable.push([]);

    instruct = text.slice(1).replace(/ /g, '').split(/,|\t/);
    const opName: string = instruct[0];
    //console.log('instruct', instruct);

    if (opName === 'la') {
      address = SYMBOL_TABLE[instruct[2]];
      rt = numToBits(Number(instruct[1].replace('$', '')), 5);
      imm = numToBits(parseInt(address.toString(16).slice(0, 4), 16), 16);
      binaryText.push('001111' + '00000' + rt + imm);
      //console.log('001111' + '00000' + rt + imm); //LUI opcode

      if (address.toString(16).slice(4, 8) !== '0000') {
        imm = numToBits(parseInt(address.toString(16).slice(4, 8), 16), 16);
        binaryText.push('001101' + rt + rt + imm);
        //console.log('001101' + rt + rt + numToBits(imm, 16)); //ORI opcode
        curAddress += BYTES_PER_WORD;

        // if two binary instructions are made by la instruction, then it should map 'current assembly instruction' to 'two binary instructions'
        mappingTable[i].push(binaryInstructionCounter);
        binaryInstructionCounter++;
      }
    } else if (opName === 'move') {
      //op = ADD op "000000"
      rs = numToBits(Number(instruct[2].replace('$', '')), 5);
      rt = '00000';
      rd = numToBits(Number(instruct[1].replace('$', '')), 5);
      shamt = '00000';
      binaryText.push('000000' + rs + rt + rd + shamt + '100000'); //funct = "100000"
      //console.log('000000' + rs + rt + rd + shamt + '100000');
    } else {
      const opInfo: instT = instList[opName];
      if (opInfo.type === 'R') {
        if (opInfo.name === 'sll' || opInfo.name === 'srl') {
          rs = '00000';
          rt = numToBits(Number(instruct[2].replace('$', '')), 5);
          rd = numToBits(Number(instruct[1].replace('$', '')), 5);
          shamt = numToBits(Number(instruct[3]), 5);
        } else if (opInfo.name === 'jr') {
          rs = numToBits(Number(instruct[1].replace('$', '')), 5);
          rt = '00000';
          rd = '00000';
          shamt = '00000';
        } else {
          rs = numToBits(Number(instruct[2].replace('$', '')), 5);
          rt = numToBits(Number(instruct[3].replace('$', '')), 5);
          rd = numToBits(Number(instruct[1].replace('$', '')), 5);
          shamt = '00000';
        }
        binaryText.push(opInfo.op + rs + rt + rd + shamt + opInfo.funct);
        //console.log(opInfo.op + rs + rt + rd + shamt + opInfo.funct);
      } else if (opInfo.type === 'I') {
        if (opInfo.name === 'lui') {
          rt = numToBits(Number(instruct[1].replace('$', '')), 5);
          rs = '00000';
          imm =
            instruct[2].slice(0, 2) === '0x'
              ? numToBits(parseInt(instruct[2].slice(2), 16), 16)
              : numToBits(Number(instruct[2]), 16);
        } else if (opInfo.name === 'beq' || opInfo.name === 'bne') {
          imm = numToBits(
            Number((SYMBOL_TABLE[instruct[3]] - (curAddress + 4)) / 4),
            16,
          );
          rs = numToBits(Number(instruct[1].replace('$', '')), 5);
          rt = numToBits(Number(instruct[2].replace('$', '')), 5);
        } else if (
          opInfo.name === 'lw' ||
          opInfo.name === 'lhu' ||
          opInfo.name === 'sw' ||
          opInfo.name === 'sh'
        ) {
          immReg = instruct[2].split('(')[1].split(')')[0];
          rs = numToBits(Number(immReg.replace('$', '')), 5);
          rt = numToBits(Number(instruct[1].replace('$', '')), 5);
          imm = numToBits(Number(instruct[2].split('(')[0]), 16);
        } else {
          rs = numToBits(Number(instruct[2].replace('$', '')), 5);
          rt = numToBits(Number(instruct[1].replace('$', '')), 5);

          imm =
            instruct[3].slice(0, 2) === '0x'
              ? numToBits(parseInt(instruct[3].slice(2), 16), 16)
              : numToBits(Number(instruct[3]), 16);
        }
        binaryText.push(opInfo.op + rs + rt + imm);
        //console.log(opInfo.op + rs + rt + numToBits(imm, 16));
      } else if (opInfo.type === 'J') {
        address = Number(SYMBOL_TABLE[instruct[1]]) / 4;
        binaryText.push(opInfo.op + numToBits(address, 26));
        //console.log(opInfo.op + numToBits(address, 26));
      }
    }
    curAddress += BYTES_PER_WORD;

    mappingTable[i].push(binaryInstructionCounter);
    binaryInstructionCounter++;
  }
  return [binaryText, mappingTable];
}

export function recordDataSection(dataSeg: string[]): string[] {
  /*
   * input값을 dataSeg를 받는다.
   * dataSeg에 있는 data들 한 줄 씩 체크해서 binaryData 리스트에 바이너리 문장으로 추가
   * data값을 그대로 binary 문자로 번역
   *
   *  binaryData 이라는 list에 명령어를 번역한 binary 문장을 한 줄씩 추가
   *  return binaryData
   *  ex) binaryData: ['00000010001000001000100000100100', '00000010010000001001000000100100']
   */

  let dataNum: number;
  const binaryData: string[] = [];
  for (const data of dataSeg) {
    dataNum =
      data.slice(0, 2) === '0x' ? parseInt(data.slice(2), 16) : Number(data);
    binaryData.push(numToBits(dataNum));
  }
  //console.log(numToBits(dataNum));
  return binaryData;
}

export function makeBinaryObject(inputs: string[]) {
  const {dataSeg, textSeg, dataSectionSize, textSectionSize} =
    makeSymbolTable(inputs);

  const [binaryText, mappingTable]: [string[], number[][]] =
    recordTextSection(textSeg);
  const binaryData: string[] = recordDataSection(dataSeg);

  return {
    dataSectionSize,
    textSectionSize,
    binaryText,
    binaryData,
    mappingTable,
    textSeg,
  };
}

export function makeBinaryArray(
  dataSectionSize: number,
  textSectionSize: number,
  binaryText: string[],
  binaryData: string[],
): string[] {
  const output: string[] = [
    numToBits(textSectionSize, 32),
    numToBits(dataSectionSize, 32),
    ...binaryText,
    ...binaryData,
  ];

  return output;
}

export function makeBinaryString(
  dataSectionSize: number,
  textSectionSize: number,
  binaryText: string[],
  binaryData: string[],
): string {
  /*
   * output에 text 문장 개수를 binary로 번역해서 추가
   * output에 data 개수를 binary로 번역해서 추가
   *
   */
  const binarySize: string[] = [
    numToBits(textSectionSize, 32),
    numToBits(dataSectionSize, 32),
  ];
  let output = '';

  binarySize.concat(binaryText, binaryData).map(binaryLine => {
    output += `${binaryLine}\n`;
  });
  return output;
}
