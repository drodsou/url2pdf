converts urls to pdf file


# dist standalone windows executable requirements

'chrome.exe' must be in the PATH

# example 

```
node url2pdf https://www.google.com 

or

url2pdf-win64 https://www.google.com

```

or

```
node url2pdf text-file-with-urls landscape A3
```

# parameters

  1: url or tex-file-with-urls
  
  2,3...: [optional] landscape A3
  See: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
   
 

# output

outputs to current dir if single url or to text-file-with-urls directory

# format of text-file-with-urls

Either:

a) an url per line, \n 

b) a comment line starting with `#` that will be skipped

c) a comment/directive line starting with `#` and containing pdf config `landscape/portrait` `a3/a4/a5` similar to command line parameters, that line will be skipped as url but used as configuration for next pages/s. Example:

```
# landscape a4
```


# compiling

compiling to exe eg with 'npm run dist-win' will raise this warning:

```
Warning Cannot include directory %1 into executable.
  The directory must be distributed with executable as %2.
  node_modules\puppeteer\.local-chromium
  path-to-executable/puppeteer
```

It is Ok if you plan to use the executable with in a system with a installed Chrome accesible in the accesible in the PATH
