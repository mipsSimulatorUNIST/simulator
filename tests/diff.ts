import {bcolors} from '../src/utils/constants';

export function diffString(o: string, n: string) {
  o = o.replace(/\s+$/, '');
  n = n.replace(/\s+$/, '');

  const out = diff(
    o == '' ? [] : o.split(/\s+/),
    n == '' ? [] : n.split(/\s+/),
  );
  let str = '';

  if (out.n.length == 0) {
    for (let i: number = 0; i < out.o.length; i++) {
      str += i + '. ' + bcolors.RED + out.o[i] + '\n' + bcolors.ENDC;
    }
  } else {
    if (out.n[0].text == null) {
      for (let j: number = 0; j < out.o.length && out.o[j].text == null; j++) {
        str += '  ' + bcolors.RED + out.o[j] + '\n' + bcolors.ENDC;
      }
    }

    for (let i = 0; i < out.n.length; i++) {
      if (out.n[i].text == null) {
        str += i + '. ' + bcolors.GREEN + out.n[i] + '\n' + bcolors.ENDC;
      } else {
        let pre = '';

        for (
          let j: number = out.n[i].row + 1;
          j < out.o.length && out.o[n].text == null;
          j++
        ) {
          pre += i + '. ' + bcolors.RED + out.o[n] + '\n' + bcolors.ENDC;
        }
        str += i + '.  ' + out.n[i].text + '\n' + pre;
      }
    }
  }

  console.log(str);
}

export function diffString2(o: string, n: string) {
  o = o.replace(/\s+$/, '');
  n = n.replace(/\s+$/, '');

  let out = diff(o == '' ? [] : o.split(/\s+/), n == '' ? [] : n.split(/\s+/));

  let os = '';
  for (let i = 0; i < out.o.length; i++) {
    if (out.o[i].text != null) {
      os += bcolors.GREEN + out.o[i].text + '\n' + bcolors.ENDC;
    } else {
      os += bcolors.RED + out.o[i] + '\n' + bcolors.ENDC;
    }
  }

  let ns = '';
  for (let i = 0; i < out.n.length; i++) {
    if (out.n[i].text != null) {
      ns += bcolors.GREEN + out.n[i].text + '\n' + bcolors.ENDC;
    } else {
      ns += bcolors.RED + out.n[i] + '\n' + bcolors.ENDC;
    }
  }

  console.log(`[TEST OUTPUT]  `);
  console.log(os);
  console.log(`[YOUR OUTPUT]  `);
  console.log(ns);
}

export function diffList(o: string[], n: string[]) {
  let out = diff(o, n);

  let os = '';
  for (let i = 0; i < out.o.length; i++) {
    if (out.o[i].text != null) {
      os += bcolors.GREEN + out.o[i].text + '\n' + bcolors.ENDC;
    } else {
      os += bcolors.RED + out.o[i] + '\n' + bcolors.ENDC;
    }
  }

  let ns = '';
  for (let i = 0; i < out.n.length; i++) {
    if (out.n[i].text != null) {
      ns += bcolors.GREEN + out.n[i].text + '\n' + bcolors.ENDC;
    } else {
      ns += bcolors.RED + out.n[i] + '\n' + bcolors.ENDC;
    }
  }

  console.log(`[TEST OUTPUT]  `);
  console.log(os);
  console.log(`[YOUR OUTPUT]  `);
  console.log(ns);
}

export function diffList2(o: string[], n: string[]) {
  let out = diff(o, n);

  let str = '';

  if (out.n.length == 0) {
    for (let i = 0; i < out.o.length; i++) {
      str += i + '. ' + bcolors.RED + out.o[i] + '\n' + bcolors.ENDC;
    }
  } else {
    if (out.n[0].text == null) {
      for (let j = 0; j < out.o.length && out.o[j].text == null; j++) {
        str += '   ' + bcolors.RED + out.o[j] + '\n' + bcolors.ENDC;
      }
    }

    for (let i = 0; i < out.n.length; i++) {
      if (out.n[i].text == null) {
        str += '   ' + bcolors.RED + out.n[i] + '\n' + bcolors.ENDC;
      } else {
        let pre = '';

        for (
          let j = out.n[i].row + 1;
          j < out.o.length && out.o[j].text == null;
          j++
        ) {
          pre += j + '. ' + bcolors.GREEN + out.o[j] + '\n' + bcolors.ENDC;
        }
        str += i + '. ' + out.n[i].text + '\n' + pre;
      }
    }
  }

  console.log(str);
}

function diff(o: any, n: any) {
  let newSeq: any = {};
  let oldSeq: any = {};

  for (let i = 0; i < n.length; i++) {
    if (newSeq[n[i]] == null) newSeq[n[i]] = {rows: new Array(), o: null};
    newSeq[n[i]].rows.push(i);
  }

  for (let i = 0; i < o.length; i++) {
    if (oldSeq[o[i]] == null) oldSeq[o[i]] = {rows: new Array(), n: null};
    oldSeq[o[i]].rows.push(i);
  }

  for (let i in newSeq) {
    if (
      newSeq[i].rows.length == 1 &&
      typeof oldSeq[i] != 'undefined' &&
      oldSeq[i].rows.length == 1
    ) {
      n[newSeq[i].rows[0]] = {
        text: n[newSeq[i].rows[0]],
        row: oldSeq[i].rows[0],
      };
      o[oldSeq[i].rows[0]] = {
        text: o[oldSeq[i].rows[0]],
        row: newSeq[i].rows[0],
      };
    }
  }

  for (let i = 0; i < n.length - 1; i++) {
    if (
      n[i].text != null &&
      n[i + 1].text == null &&
      n[i].row + 1 < o.length &&
      o[n[i].row + 1].text == null &&
      n[i + 1] == o[n[i].row + 1]
    ) {
      n[i + 1] = {text: n[i + 1], row: n[i].row + 1};
      o[n[i].row + 1] = {text: o[n[i].row + 1], row: i + 1};
    }
  }

  for (let i = n.length - 1; i > 0; i--) {
    if (
      n[i].text != null &&
      n[i - 1].text == null &&
      n[i].row > 0 &&
      o[n[i].row - 1].text == null &&
      n[i - 1] == o[n[i].row - 1]
    ) {
      n[i - 1] = {text: n[i - 1], row: n[i].row - 1};
      o[n[i].row - 1] = {text: o[n[i].row - 1], row: i - 1};
    }
  }

  return {o: o, n: n};
}
