import {assemble} from '../../index';
import {resetSymbolTable} from '../../src/utils/constants';
import {makeInput, makeOutput} from '../../src/utils/functions';

for (let i = 1; i <= 1; i++) {
  test(`testing example ${i} for [array output]`, () => {
    resetSymbolTable();

    const input = makeInput('sample_input', `example${i}.s`);
    const {output, mappingDetail} = assemble(input, true, true);
    console.dir(mappingDetail);
    mappingDetail.forEach(ele => {
      console.log(ele.binary);
    });
    const testOutput = makeOutput('sample_output', `example${i}.o`)
      .split('\n') // 문자 -> 문자열 전환
      .filter(ele => ele); // "" 제거, ""는 false와 동일

    expect(output).toEqual(testOutput);
  });
}

for (let i = 1; i <= 7; i++) {
  test(`testing example ${i} for [array output]`, () => {
    resetSymbolTable();

    const input = makeInput('sample_input', `example${i}.s`);
    const {output} = assemble(input, true);
    const testOutput = makeOutput('sample_output', `example${i}.o`)
      .split('\n') // 문자 -> 문자열 전환
      .filter(ele => ele); // "" 제거, ""는 false와 동일

    expect(output).toEqual(testOutput);
  });
}

for (let i = 1; i <= 7; i++) {
  test(`testing example ${i} for [string output]`, () => {
    resetSymbolTable();

    const input = makeInput('sample_input', `example${i}.s`);
    const {output} = assemble(input, false);
    const testOutput = makeOutput('sample_output', `example${i}.o`);
    expect(output).toEqual(testOutput);
  });
}
