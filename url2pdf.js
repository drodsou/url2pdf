const puppeteer = require('puppeteer-core')
const fs = require('fs')
const path = require('path')

const packageJson = require('./package.json');


async function main() {   // ; is important!

  // process url parameter
  let param = process.argv[2]
  if (!param) {
    console.log('ERROR: I need one paramenter: the url of the page, or the path to a text file with a list of urls')
    process.exit(-1)
  }

  if (param = '--version') {
    console.log(`url2pdf v${packageJson.version}`);
    process.exit(0);
  }
  // possible argument option
  // docs: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
  pagePdfOptions = {
    format: 'A4',
    landscape:false, 
    printBackground:true
  }

  let configPagePdfOptions = (arr)=>{
    if (arr.includes('landscape')) { pagePdfOptions.landscape = true }
    if (arr.includes('portrait')) { pagePdfOptions.landscape = false }
    if (arr.includes('a3')) { pagePdfOptions.format = 'A3' }
    if (arr.includes('a4')) { pagePdfOptions.format = 'A4' }
    if (arr.includes('a5')) { pagePdfOptions.format = 'A5' }

    console.log('page.pdf options:', pagePdfOptions)
  }

  let paramOptions = process.argv.slice(3).map(e=>e.toLowerCase())
  configPagePdfOptions(paramOptions)
  

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
    urls = fileContents.split('\n').map(r=>r.trim())
  }
 

  // enter puppeteer, generate pdf for each 'urls' element

  //let localChrome = './node_modules/puppeteer/.local-chromium/win64-672088/chrome-win/chrome.exe'

  // let localChrome =  path.resolve(walkSync('./node_modules/puppeteer/.local-chromium')
  //   .filter(e=>e.includes('chrome.exe'))[0]);

  let chromePath = 'chrome'   // Chrome needs to be en PATH
  // if (fs.existsSync(localChrome)) {
  //   console.log('using local Chromium')
  //   chromePath = localChrome
  // }
  // else {
  //   console.log(`Using system's Chrome (must be in PATH)`)
  // }
  console.log(`Using system's Chrome (must be in PATH)`)


  const browser = await puppeteer.launch( {
    executablePath: chromePath,   // pkg needs this
    ignoreHTTPSErrors: true,    // ignore self-signed certificate errors
    headless: true
  } )
  var page;
  var firstTime= true;
  
  for (let url of urls) {
    // -- check if line is comment, with pdf options
    // -- example valid directive: # landscape a3
    if (url.startsWith('#')) {
      let nextPdfParams = url.split(' ').map(e=>e.toLowerCase())
      configPagePdfOptions(nextPdfParams)
      continue // skip # line
    }

    page = await browser.newPage()
    
    console.log('• pdfing', url)    
    await page.goto(url, {waitUntil: 'networkidle0'})
    // await page.goto(url, {waitUntil: 'domcontentloaded'})
    // await page.waitForNavigation({waitUntil: 'networkidle0'});
    
    // if (firstTime) { 
    //   firstTime = false; 
    //   console.log('waiting for first page')
    //   await new Promise(r=>setTimeout(r,5000)); 
    // }
    console.log('--- goto done')    
    let pageTitle = await page.title()
    pagePdfOptions.path = path.join(outputDir, pageTitle + '.pdf')
    
    console.log('--- writing pdf:', pagePdfOptions.path)    
    await page.pdf(pagePdfOptions)

    console.log('closing page');
    await page.close()
  }
  await browser.close()

  await questionAsync('-- FINISHED. Press Enter')
} // main

main()

// ------------------------ HELPERS

function questionAsync(txt) {
  return new Promise (resolve=>{
    let rline = require('readline').createInterface({input: process.stdin, output: process.stdout })
    rline.question( txt, (answer)=>{
      rline.close();
      resolve(answer)
    })
  })
}


function walkSync (dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(dir + '/' + file, filelist)
      : filelist.concat( dir + '/' + file);
  });
return filelist;
}
