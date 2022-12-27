import * as fs from 'fs';

let fd;

try {
    fd = fs.openSync('message.txt', 'a');
    fs.appendFileSync(fd, "good\n", 'utf-8');
} catch (err) {
    console.error(err);
} finally {
    if (fd !== undefined)
        fs.closeSync(fd);
}
