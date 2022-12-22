// For indexing of symbol table
let symbol_table_cur_index = 0;

// Temporary file stream pointers
let data_seg = None;
let text_seg = None;

// Size of each section
let data_section_size = 0;
let text_section_size = 0;

const makeSymbolTable = (input) => {
  // here
};

const recordTextSection = (fout) => {
  // here
};

const recordDataSection = (fout) => {
  // here
};

const makeBinaryFile = (fout) => {
  // here

  recordTextSection(fout);
  recordDataSection(fout);
};
