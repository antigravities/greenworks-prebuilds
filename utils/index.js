const path = require('path');
const shelljs = require('shelljs');
const unzipper = require('unzipper');
const tar = require('tar');
const execa = require('execa');
const fs = require('fs');

const getLibPath = () => {
    return path.join(process.cwd(), 'greenworks', 'lib');
};

const extractTar = async (from, to) => {
    shelljs.mkdir('-p', to);

    console.log('all files with be outputted to ', to);

    return tar.extract({
        file: from,
        cwd: to
    });
};

const extractZip = async (from, to) => {
    return new Promise((resolve, reject) => {
        shelljs.mkdir('-p', to);
        fs.createReadStream(from)
            .pipe(unzipper.Extract({path: to}))
            .on('close', async () => {
                return resolve(to);
            });
    });
};

const extractArchive = async (from, to) => {
    const type = path.extname(from);
    if (type === '.tar.gz') {
        return extractTar(from, to);
    } else if (type === '.zip') {
        return extractZip(from, to);
    }
};

const execTemplate = async (binary, libPath, templatePath, flags = []) => {
    if (!fs.existsSync(libPath)) {
        console.log(`Creating ${libPath}`);
        shelljs.mkdir(libPath);
    }
    console.log(`Creating ${libPath} to ${templatePath}`);
    shelljs.cp('-R', libPath, templatePath);

    console.log(`Chmod ${binary}`);
    shelljs.chmod('+x', binary);
    console.log(`Executing ${binary} [${templatePath}]`);
    return execa(binary, [templatePath, ...flags]);
};

module.exports = {
    getLibPath,
    extractZip,
    extractTar,
    extractArchive,
    execTemplate
};
