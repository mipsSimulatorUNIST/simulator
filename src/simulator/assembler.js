// For indexing of symbol table
let symbol_table_cur_index = 0;

// Temporary file stream pointers
let data_seg;
let text_seg;

// Size of each section
let data_section_size = 0;
let text_section_size = 0;

export const makeSymbolTable = input => {
  // here
};

export const recordTextSection = fout => {
  // here
};

export const recordDataSection = fout => {
  // here
};

export const makeBinaryFile = fout => {
  // here

  recordTextSection(fout);
  recordDataSection(fout);
};
