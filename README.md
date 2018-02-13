# coveo-odata

[![Build Status](https://travis-ci.org/coveo/odataclient.svg?branch=master)](https://travis-ci.org/coveo/odataclient)
[![bitHound Overall Score](https://www.bithound.io/github/coveo/odataclient/badges/score.svg)](https://www.bithound.io/github/coveo/odataclient)
[![bitHound Dependencies](https://www.bithound.io/github/coveo/odataclient/badges/dependencies.svg)](https://www.bithound.io/github/coveo/odataclient/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/coveo/odataclient/badges/devDependencies.svg)](https://www.bithound.io/github/coveo/odataclient/master/dependencies/npm)
[![Npm total downloads badge](https://img.shields.io/npm/dt/odataclient.svg)](https://www.npmjs.com/package/odataclient)

Typescript OData client destined to be run in browsers. Highly inspired from [o.js](https://github.com/janhommes/o.js) and [odata-client](https://github.com/kanthoney/odata-client).

## Usage

### Initialization

```typescript
const client = new OData({
    endpoint: "https://contoso.crm.dynamics.com/",
    headers: [
        { name: "Content-Type", value: "application/json" },
        { name: "Accept", value: "application/json" },
        { name: "OData-MaxVersion", value: "4.0" },
        { name: "OData-Version", value: "4.0" }
    ]
});
```

Initializes the client on the endpoint `https://contoso.crm.dynamics.com/`.

### Resource

```typescript
client
    .resource("api/data")
    .resource("v9.0")
    .resource("accounts");
```

Configures the client to point toward `https://contoso.crm.dynamics.com/api/data/v9.0/accounts`.

### Query Options
```typescript
client
    .filter("name eq 'Fourth Coffee'")
    .select(["name", "accountnumber"]);
```

Adds the query options `?$filter=name eq 'Fourth Coffee'&$select=name,accountnumber`. Also supports `count`, `orderby`, `top` query options, among others. 

### GET, POST, etc.
```typescript
client1.get();

client2.post(data);
```

### Sending a Query
```typescript
client.build<T>();
```

Launches an HTTP request and returns a `Promise<T>` where T is the expected type of the response object.

### Full example

### Sending a Query
```typescript
interface IAccount {
    accountnumber: string;
    name: string;
}

client
    .resource("accounts")
    .select(["name", "accountnumber"]);
    .build<IODataCollection<IAccount>>()
    .then(accounts => accounts.value.forEach(account => console.log(account.name)));
```

## Install
```sh
npm install coveo-odata
```
> The project is at its early stages, some components can still have _lots_ of breaking changes between versions.

### Building
Make sure you have Node JS and NPM installed.
Run `npm install` to get the required dependencies and build the library.

### Running the tests suite
Run `npm test` to run all tests and get the code coverage!

## Contributing
1. Search the issues, if it is not already there, add one.
2. Fork the repository
3. Code Code Code
4. Submit a pull request
5. Wait for some nice guy to review and merge

## License
Coveo-odata is distributed under [MIT license](LICENSE).