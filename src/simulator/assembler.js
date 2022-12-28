export const makeSymbolTable = input => {
  /*
   * make symbol table from assembly file
   * using SYMBOL_TABLE in constants.js
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
​   */
};

export const recordTextSection = fout => {
  /**
   * textSeg에 있는 text들 한 줄 씩 체크해서 fout에 바이너리 문장으로 추가
   * 명령어 타입별(R, I, J)로 명령어 이름별로 묶어서 번역
   * 
   * parameter로 받는 fout은 list
   *  - fout이라는 list에 명령어를 번역한 binary 문장을 한 줄씩 추가
   *  - return 값은 별도로 없고 함수의 side effect 이용
   *  - ex) fout: ['00000000000000000000000001011000', '00000000000000000000000000001100']
​   */
};

export const recordDataSection = fout => {
  /**
   * dataSeg에 있는 data들 한 줄 씩 체크해서 fout에 바이너리 문장으로 추가
   * data값을 그대로 binary 문자로 번역
   * 
   * parameter로 받는 fout은 list
   *  - fout이라는 list에 명령어를 번역한 binary 문장을 한 줄씩 추가
   *  - return 값은 별도로 없고 함수의 side effect 이용
   *  - ex) fout: ['00000010001000001000100000100100', '00000010010000001001000000100100']
​   */
};

export const makeBinaryFile = fout => {
  /**
   * fout에 text 문장 개수를 binary로 번역해서 추가
   * fout에 data 개수를 binary로 번역해서 추가
   */

  recordTextSection(fout);
  recordDataSection(fout);
};
