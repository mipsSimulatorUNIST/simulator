import {makeBinaryObject, makeBinaryArray} from './src/simulator/assembler';
import {initialize, initializeMem} from './src/utils/constants';
import {
  IMapDetail,
  mainProcess,
  makeMappingDetail,
  simulatorOutputType,
} from './src/utils/functions';

export interface IAssemble {
  readonly output: string[];
  readonly mappingDetail: IMapDetail[] | null;
}

export interface ISimulatorOutput {
  readonly result: simulatorOutputType;
  history: simulatorOutputType[] | null;
}

export function assemble(
  assemblyInstructions: string[],
  mappingDetailRequest = false,
): IAssemble {
  /*  
   * input : assemblyInstructions: string[]
   * Enter the path where the assembly file is located.
   
   * If the assemlbyFile path is /Users/junghaejune/simulator/sample_input/example1.s
   * you can enter path /Users/junghaejune/simulator/sample_input/example1.s into assemblyInstructions.
   * If you don't know the path exactly, you can use makeInput function in functions.ts
   * Let your current directory is simulator (/Users/junghaejune/simulator).
   * Then you only put makeInput("sample_input", "example1.s") into assemblyInstructions

   * output: string[]
   * The assembly file is converted to a string in binary form.
    
    ex) 
    input: sample_input/example1.s
    ...
    main:
      and	$17, $17, $0 
      and	$18, $18, $0
    ...
    
    output:
    [00000010001000001000100000100100,
      ...
    00000010010000001001000000100100]

  */

  const {
    dataSectionSize,
    textSectionSize,
    binaryText,
    binaryData,
    mappingTable,
    dataSeg,
    textSeg,
  } = makeBinaryObject(assemblyInstructions);

  let mappingDetail: IMapDetail[] | null = null;

  const output: string[] = makeBinaryArray(
    dataSectionSize,
    textSectionSize,
    binaryText,
    binaryData,
  );

  if (mappingDetailRequest) {
    mappingDetail = makeMappingDetail(
      assemblyInstructions,
      dataSeg,
      textSeg,
      mappingTable,
      output,
    );
  }

  return {output, mappingDetail};
}

export async function simulator(
  assemblyInstructions: string[],
  cycleNum: number,
  returnHistory = false,
): Promise<ISimulatorOutput> {
  /*
   * input : assemblyInstructions: string[], cycle: number, returnCycles: boolean
   * assemblyInstructions is same as assemblyInstructions in assemble function above.
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
    makeBinaryObject(assemblyInstructions);

  initializeMem();

  const CYCLES: simulatorOutputType[] = new Array<simulatorOutputType>();
  const INST_INFO = initialize(
    binaryText.concat(binaryData),
    textSectionSize,
    dataSectionSize,
  );

  const result = await mainProcess(INST_INFO, cycleNum, CYCLES);

  return new Promise<ISimulatorOutput>((resolve, reject) => {
    try {
      const output: ISimulatorOutput = {result, history: null};
      if (returnHistory) output.history = CYCLES;
      resolve(output);
    } catch (error) {
      reject(error);
    }
  });
}
