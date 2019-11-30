<!-- ======================================================================================================================= -->
<!-- README                                                                                                                  -->
<!-- ======================================================================================================================= -->
# This package has been deprecated
This package has been deprecated and you should follow `isolatedModules` in `tsconfig.json` .

---

# next-tsc

[![npm](https://img.shields.io/npm/v/next-tsc.svg)](https://www.npmjs.com/package/next-tsc)
[![license](https://img.shields.io/github/license/jagaapple/next-tsc.svg)](https://opensource.org/licenses/MIT)
[![@jagaapple_tech](https://img.shields.io/badge/contact-%40jagaapple_tech-blue.svg)](https://twitter.com/jagaapple_tech)

Use TypeScript with TypeScript compiler (tsc) in Next.js.


## Table of Contents

<!-- TOC depthFrom:2 -->

- [Table of Contents](#table-of-contents)
- [Features](#features)
  - [What is the issue of next-typescript?](#what-is-the-issue-of-next-typescript)
  - [Why the issue is not fixed?](#why-the-issue-is-not-fixed)
- [Quick Start](#quick-start)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Setup](#setup)
- [Contributing to next-tsc](#contributing-to-next-tsc)
- [License](#license)

<!-- /TOC -->


## Features
next-tsc is to provide TypeScript build system for [Next.js](https://github.com/zeit/next.js) using TypeScript compiler (tsc)
via [ts-loader](https://github.com/TypeStrong/ts-loader).

### What is the issue of next-typescript?
Next.js provides official TypeScript plugin
[next-typescript](https://github.com/zeit/next-plugins/tree/master/packages/next-typescript).
next-typescript had used [ts-loader](https://github.com/TypeStrong/ts-loader) depends on webpack for old Next.js, but this uses
Babel ([@babel/preset-typescript](https://github.com/babel/babel/tree/master/packages/babel-preset-typescript)) instead since
Next.js 7.

Babel 7 supports to build TypeScript files without type checkings and it does not depend on other TypeScript tools such as tsc.
In order to be simpler build systems in Next.js, Next.js 7 uses Babel 7 and latest next-typescript drops ts-loader and uses it
instead.

However TypeScript build system of Babel has an issue. This issue is not critical, but very annoying.
The issue is Babel throws warnings when re-exporting interfaces, types, and others like the following.

```ts
// src/models/user.ts
export interface UserModel {
  id: number;
  name: string;
}
export const createUser = (id: number, name: string) => ({ id, name });

// src/models/index.ts
export { UserModel, createUser } from "./user";

// src/main.ts
import { UserModel } from "./models";
...
```

```bash
[warning] in ./src/models/index.ts
"export 'UserModel' was not found in './user'
```

On large project, developers create index.ts to encapsulate the API calls from the web application into a single folder. If you
define some interfaces and re-export them, you will get too many warnings.

---

The GitHub issue:
[next-typescript uses ts-loader again · Issue #306 · zeit/next-plugins](https://github.com/zeit/next-plugins/issues/306)

### Why the issue is not fixed?
TypeScript build system of Babel does not support re-export (https://github.com/babel/babel/issues/8361#issuecomment-428756919).

To solve the issue, next-typescript should use ts-loader again, but it is breaking change.


## Quick Start
### Requirements
- npm or Yarn
- webpack 4.0.0 or higher
- Next.js 5.0.0 or higher
- TypeScript 2.4.1 or higher

### Installation

```bash
$ npm install --save -D next-tsc
```

If you are using Yarn, use the following command.

```bash
$ yarn add --dev next-tsc
```

### Setup
First, setup your Next.js settings.

```js
// next.config.js
const withTypeScript = require("next-tsc");

module.exports = withTypeScript();
```

You should set `noEmit` to `false` or remove the property in `tsconfig.json` .

```js
{
  "compilerOptions": {
    ...
    "noEmit": false, // or remove this property
    ...
```


## Contributing to next-tsc
Bug reports and pull requests are welcome on GitHub at
[https://github.com/jagaapple/next-tsc](https://github.com/jagaapple/next-tsc). This project
is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the
[Contributor Covenant](http://contributor-covenant.org) code of conduct.

Please read [Contributing Guidelines](./.github/CONTRIBUTING.md) before development and contributing.


## License
The library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Copyright 2018 Jaga Apple. All rights reserved.
