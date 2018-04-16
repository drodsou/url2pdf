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

just an url per line, \n 