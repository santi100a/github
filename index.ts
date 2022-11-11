import { Command } from "commander";
import { textSync } from "figlet";
import { promises as FSPromises, type PathLike } from "node:fs";

const VERSION = 'v1.0.0';
const CLI_NAME = 'File to Base64';
const program = new Command()
.version(VERSION)
.description('Encodes a file in Base64 format.')
.option('-p, --picture [image-type]', 'If the file is an image, specify image format. Default is JPEG.')
.requiredOption('-f, --file <filename>', 'Filename to encode.')
.parse(process.argv);

console.clear();
console.log('\x1b[32m%s\x1b[0m', textSync(CLI_NAME));
const options = program.opts();
async function read(filename: PathLike, encoding?: BufferEncoding): Promise<
[string | Buffer, null] | [null, Error]
> {
    try {
        return [await FSPromises.readFile(filename, encoding), null];
    } catch (error) {
        return [null, error as Error];
    }
}
(async function () {
    const [ file, error ] = await read(options.file, 'utf8');
    

    if (error) {
        if (error.message.includes('no such file or directory')) {
            console.log('\x1b[31m%s\x1b[0m', `✗ File doesn't exist.`);
            process.exit(1);
        } 
        console.log('\x1b[31m%s\x1b[0m', `✗ An error has ocurred while reading the file. ${error}.`);
        process.exit(1);
    }

    if (options.picture) {
        const base64 = 
        `data:image/${options.picture || 'jpeg'};base64,${Buffer.from(file).toString('base64')}.`;
        console.log('Encoded file is: %s', base64);
        process.exit(0);
    }
    const base64 = Buffer.from(file).toString('base64');

    console.log('Encoded file is: %s', base64);
})();
