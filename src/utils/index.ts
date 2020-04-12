import path from 'path'
import shelljs from 'shelljs'
import unzipper from 'unzipper'
import tar from 'tar'
import execa from 'execa'
import fs from 'fs'
import os from 'os'

const getLibPath = () => path.join(process.cwd(), 'greenworks', 'lib')

const extractTar = async (from, to) => {
    shelljs.mkdir('-p', to)

    console.log('all files with be outputted to ', to)

    return tar.extract({
        file: from,
        cwd: to,
    })
}

const extractZip = async (from, to) =>
    new Promise((resolve) => {
        shelljs.mkdir('-p', to)
        fs.createReadStream(from)
            .pipe(unzipper.Extract({ path: to }))
            .on('close', async () => resolve(to))
    })

const extractArchive = async (from, to) => {
    const type = path.extname(from)

    console.log('archive of type', type)

    if (type === '.tar.gz' || type === '.gz') {
        return extractTar(from, to)
    }
    if (type === '.zip') {
        return extractZip(from, to)
    }
    console.log('File type not recognized!')
    return null
}

const execTemplate = async (binary, libPath, templatePath, flags = []) => {
    console.log('Content of binary path parent directory')
    if (os.platform() === 'darwin') {
        shelljs.ls('-R', path.dirname(binary)).forEach((file) => {
            console.log('file', file)
        })
    }

    if (!fs.existsSync(libPath)) {
        console.log(`Creating ${libPath}`)
        shelljs.mkdir(libPath)
    }
    console.log(`Creating ${libPath} to ${templatePath}`)
    shelljs.cp('-R', libPath, templatePath)

    console.log(`Chmod ${binary}`)
    shelljs.chmod('+x', binary)
    console.log(`Executing ${binary} [${templatePath}, ${flags}]`)
    return execa(binary, [templatePath, ...flags])
}

export { getLibPath, extractZip, extractTar, extractArchive, execTemplate }