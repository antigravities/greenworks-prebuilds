/* eslint-disable no-await-in-loop */
import fs from 'fs'
import path from 'path'
//
const Archs = ['ia32', 'x64', 'arm64']

const Runtimes = ['electron']

const OSs = ['macos-latest', 'ubuntu-latest', 'windows-latest']

const run = async (/* release: Release */): Promise<void> => {
  const json: any = {}
  const matrix: any[] = []

  OSs.forEach((os) => {
    Runtimes.forEach((runtime) => {
      Archs.forEach((arch) => {
        if (os !== 'macos-latest' && arch === 'arm64') return;
        if (os === 'macos-latest' && arch === 'ia32') return;

        matrix.push({
          runtime,
          arch,
          os,
        })
      })
    })
  })

  // eslint-disable-next-line
  json.include = matrix

  console.log(json)
  console.log(matrix.length)
  // eslint-disable-next-line
  fs.writeFileSync(path.join(__dirname, '..', 'matrix.json'), JSON.stringify(json), 'utf8')
}

// eslint-disable-next-line
(async () => {
  await run()
})()
