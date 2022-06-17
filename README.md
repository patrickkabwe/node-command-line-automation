### Node Command-line automation

An automation app that get data by running a command in the app directory based on the available operation and sends a report in a Csv or Json format

##### RUN PROJECT

1. Clone project : `git clone <repo_url>`
2. Change Directory : `cd /path/to/cloned/repo`
3. Install Dependancies : `yarn`
4. Install the script with : `npm install -g .`
5. Run `cova`

If all good you should see an output like this one

```
Usage: cova [options]

Options:
      --help          Show help                                        [boolean]
      --version       Show version number                              [boolean]
  -o, --operation     customers or catalogs                  [string] [required]
  -c, --companyId     companyId                              [string] [required]
  -u, --username      username                               [string] [required]
  -p, --password      password                               [string] [required]
  -e, --emailList     A string of email list separated by comma
                                                             [string] [required]
  -i, --clientId      clientId                               [string] [required]
  -s, --clientSecret  clientSecret                           [string] [required]

Missing required arguments: o, c, u, p, e, i, s
```

Happy Coding 🚀

