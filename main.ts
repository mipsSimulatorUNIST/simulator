import {makeBinaryFile, makeBinaryObject} from './src/simulator/assembler';
import {CYCLES, initialize, initializeMem} from './src/utils/constants';
import {mainProcess} from './src/utils/functions';

export function assemble(assemblyFile: string[]): string {
  /*  
   * input : assemblyFile: string[]
   * Enter the path where the assembly file is located.
   
  If the assemlbyFile path is /Users/junghaejune/simulator/sample_input/example1.s
  you can enter path /Users/junghaejune/simulator/sample_input/example1.s into assemblyFile.
   
  If you don't know the path exactly, you can use makeInput function in functions.ts
  Let your current directory is simulator (/Users/junghaejune/simulator).
  Then you only put makeInput("sample_input", "example1.s") into assemblyFile

   * output : output: string
   * The assembly file is converted to a string in binary form.
    
  ex) 
  input: sample_input/example1.s
  ...
  main:
    and	$17, $17, $0 
    and	$18, $18, $0
  ...
  
  output:
  ...
  00000010001000001000100000100100
  00000010010000001001000000100100
  ...
  */

  const {dataSectionSize, textSectionSize, binaryText, binaryData} =
    makeBinaryObject(assemblyFile);

  const output = makeBinaryFile(
    dataSectionSize,
    textSectionSize,
    binaryText,
    binaryData,
  );

  return output;
}

export function simulator(
  assemblyFile: string[],
  cycle: number,
  returnCycles = false,
): object {
  const {dataSectionSize, textSectionSize, binaryText, binaryData} =
    makeBinaryObject(assemblyFile);

  initializeMem();
  const {INST_INFO} = initialize(
    binaryText.concat(binaryData),
    textSectionSize,
    dataSectionSize,
  );

  const output = mainProcess(INST_INFO, cycle);
  return returnCycles ? {output, cycles: CYCLES} : output;
}
