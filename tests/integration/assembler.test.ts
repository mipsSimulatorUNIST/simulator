import {assemble} from '../../main';
import {resetSymbolTable} from '../../src/utils/constants';
import {makeInput, makeOutput} from '../../src/utils/functions';

for (let i = 1; i <= 7; i++) {
  test(`testing example ${i}`, () => {
    resetSymbolTable();

    const input = makeInput('sample_input', `example${i}.s`);
    const output = assemble(input);
    const testOutput = makeOutput('sample_output', `example${i}.o`);
    expect(output.toString()).toEqual(testOutput.toString());
  });
}
