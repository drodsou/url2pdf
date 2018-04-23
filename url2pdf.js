const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')


;(async ()=>{   // ; is important!

  // process url parameter
  let param = process.argv[2]
  if (!param) {
    console.log('ERROR: I need one paramenter: the url of the page, or the path to a text file with a list of urls')
    process.exit(-1)
  }

  // possible argument option
  // docs: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
  pagePdfOptions = {
    format: 'A4',
    landscape:false, 
    printBackground:true
  }
  let paramOptions = process.argv.slice(3).map(e=>e.toLowerCase())
  if (paramOptions.includes('landscape')) { pagePdfOptions.landscape = true }
  if (paramOptions.includes('a3')) { pagePdfOptions.format = 'A3' }

  console.log('page.pdf options:', pagePdfOptions)

  // build array of urls
  let outputDir
  let urls
  if (param.startsWith('http')) {
    // asume parameter is a single url
    outputDir = process.cwd()
    urls = [param]

  }
  else  {
    // asume parameter is path to a file
    outputDir = path.dirname(param) // the same folder of passed urls file
    let fileContents = fs.readFileSync(param, 'UTF8')
    urls = fileContents.split('\n')
  }
 

  // enter puppeteer, genearte pdf for each 'urls' element
  let localChrome = './node_modules/puppeteer/.local-chromium/win64-549031/chrome-win32/chrome.exe'
  let chromePath = 'chrome'   // Chrome needs to be en PATH
  if (fs.existsSync(localChrome)) {
    console.log('using local Chromium')
    chromePath = localChrome
  }
  else {
    console.log(`Using system's Chrome (must be in PATH)`)
  }

  const browser = await puppeteer.launch( {
    executablePath: chromePath,   // pkg needs this
    ignoreHTTPSErrors: true,    // ignore self-signed certificate errors
    headless: true
  } )
  var page
  //let url = 'http://localhost:3000/#printReport?nome=%22JORGE%22&apelidos=%22ALVAREZ%20SEVILLA%22&nif=%2252932334L%22&modulos=%5B%22%22%5D&titulo=%22Arquitectura%20sobre%20Amazon%20Web%20Services%20(AWS%20Solutions%20Architect%20Associate)%22&dataInicio=%2226%2F02%2F2018%22&dataFin=%2209%2F03%2F2018%22&horaInicio=%2216%3A30%22&horaFin=%2220%3A30%22&dataSinatura=%2226%20de%20febreiro%20de%202018%22&tipoEdicion=%22TIPED_2%22&codEdicion=%22XTIFCT1702%22&totalHorasPrograma=40&idActividadeFormativa=%22406102%22&temario=null&report=%22Diploma%22'
  for (let url of urls) {
    page = await browser.newPage()
    
    console.log('• pdfing', url)    
    await page.goto(url, {waitUntil: 'networkidle2'})
    
    console.log('--- goto done')    
    let pageTitle = await page.title()
    pagePdfOptions.path = path.join(outputDir, pageTitle + '.pdf')
    
    console.log('--- writing pdf:', pagePdfOptions.path)    
    await page.pdf(pagePdfOptions)

    await page.close()
  }
  await browser.close()

})()