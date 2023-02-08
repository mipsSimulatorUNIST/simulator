import {makeBinaryFile, makeBinaryObject} from './src/simulator/assembler';
import {CYCLES, initialize, initializeMem} from './src/utils/constants';
import {mainProcess} from './src/utils/functions';

export function assemble(assemblyFile: string[]): string {
  /*  
   * input : assemblyFile: string[]
   * Enter the path where the assembly file is located.
   
   * If the assemlbyFile path is /Users/junghaejune/simulator/sample_input/example1.s
   * you can enter path /Users/junghaejune/simulator/sample_input/example1.s into assemblyFile.
   * If you don't know the path exactly, you can use makeInput function in functions.ts
   * Let your current directory is simulator (/Users/junghaejune/simulator).
   * Then you only put makeInput("sample_input", "example1.s") into assemblyFile

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
  /*
   * input : assemblyFile: string[], cycle: number, returnCycles: boolean
   * assemblyFile is same as assemblyFile in assemble function above.
   * cycle is the number of cycles you want to execute.
   * Executing one cycle means that executing one instruction.
   * returnCycles determines the type of return.
   * If returnCycles = false (default), Returns only the final form of the result.
   * If returnCycles = true, Returns an object containing information of all cycles.
   
    ex) returnCycles = false, you can use this function as below form.
    const result = simulator(makeInput('sample_input', 'example1.s'), 10000, false)

    ex) returnCycles = true, you can use this function as below form.
    interface SimulatorResult {
      output: simulatorOutputType;
      cycles: simulatorOutputType[];
    }

    const result = simulator(
      makeInput('sample_input', 'example1.s'),
      10000,
      true,
    ) as SimulatorResult;

    * output : The object of Register File.

    ex)
    [
    {
      PC: '0x00400000',
      registers: {
        R0: '0x00000000',
        R1: '0x00000000',
        ...
        R31: '0x00000000'
      },
      dataSection: {
        '0x10000000': '0x00000064',
        ...
      },
      stackSection: {}
    } 
    ]
  */
  const {dataSectionSize, textSectionSize, binaryText, binaryData} =
    makeBinaryObject(assemblyFile);

  initializeMem();
  const INST_INFO = initialize(
    binaryText.concat(binaryData),
    textSectionSize,
    dataSectionSize,
  );

  const output = mainProcess(INST_INFO, cycle);
  return returnCycles ? {output, cycles: CYCLES} : output;
}
