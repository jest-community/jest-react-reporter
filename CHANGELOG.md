# [5.0.0](https://github.com/jest-community/jest-react-reporter/compare/v4.0.1...v5.0.0) (2025-02-15)


### chore

* upgrade typescript ([#219](https://github.com/jest-community/jest-react-reporter/issues/219)) ([341c2f9](https://github.com/jest-community/jest-react-reporter/commit/341c2f9bf2e78c1d7fb22e2dfac79ce3daedee8d))


### BREAKING CHANGES

* Node versions 14, 16 and 21 are no longer supported

## [4.0.1](https://github.com/jest-community/jest-react-reporter/compare/v4.0.0...v4.0.1) (2024-05-12)


### Bug Fixes

* update to React 18 ([#223](https://github.com/jest-community/jest-react-reporter/issues/223)) ([47b27fa](https://github.com/jest-community/jest-react-reporter/commit/47b27fa7d08da150c7c0ad450e3871c25d4aeba4))

# [4.0.0](https://github.com/jest-community/jest-react-reporter/compare/v3.0.0...v4.0.0) (2022-09-06)


### Features

* drop node 12 ([49089b5](https://github.com/jest-community/jest-react-reporter/commit/49089b566843aadd80096cf8c6f5d84e6c1d4a7d))
* update to Jest 29 and support 27-29 in peer dependencies ([#100](https://github.com/jest-community/jest-react-reporter/issues/100)) ([a0aaa14](https://github.com/jest-community/jest-react-reporter/commit/a0aaa14b9ab18690a1d8d29009a37dbf55278c24))


### BREAKING CHANGES

* No longer support Node 12

# [3.0.0](https://github.com/jest-community/jest-react-reporter/compare/v2.0.1...v3.0.0) (2022-02-26)


### Bug Fixes

* **deps:** update jest monorepo to v27 (major) ([#31](https://github.com/jest-community/jest-react-reporter/issues/31)) ([bc9d09f](https://github.com/jest-community/jest-react-reporter/commit/bc9d09f3bfa2672b33498d3607e1c0f91b32ad97))
* put string inside Text ([3481e50](https://github.com/jest-community/jest-react-reporter/commit/3481e5016349ce32bce10d1ff75bdc3ee171cd7b))


### Features

* drop node 10 and 13 ([abccf17](https://github.com/jest-community/jest-react-reporter/commit/abccf17cb29292f8f7ddddd4bce72202456e6fd9))
* update ink to v3 ([#41](https://github.com/jest-community/jest-react-reporter/issues/41)) ([15cb8b9](https://github.com/jest-community/jest-react-reporter/commit/15cb8b96c1db49128df8f7030a1702993ed82dba))


### BREAKING CHANGES

* Remove support for node 10 and 13

## [2.0.1](https://github.com/jest-community/jest-react-reporter/compare/v2.0.0...v2.0.1) (2020-05-23)


### Bug Fixes

* disable `esModuleInterop` ([074ff80](https://github.com/jest-community/jest-react-reporter/commit/074ff80f790e0dc8d741bb9893d59d31825ffe92))

# [2.0.0](https://github.com/jest-community/jest-react-reporter/compare/v1.1.10...v2.0.0) (2020-05-23)


### Bug Fixes

* build with (patched) ncc ([146370d](https://github.com/jest-community/jest-react-reporter/commit/146370dd6a3a1908766c98b33434261b185ef4c3))
* update dependencies ([f2e12da](https://github.com/jest-community/jest-react-reporter/commit/f2e12da36d9203af4763e8c805548160e8bd92e6))
* use `import type` syntax ([8ff117c](https://github.com/jest-community/jest-react-reporter/commit/8ff117c93c7a9a05b7d7883bac74489bf9d06ee1))


### BREAKING CHANGES

* do not emit type information
* drop support for Node 8

## [1.1.10](https://github.com/jest-community/jest-react-reporter/compare/v1.1.9...v1.1.10) (2019-11-14)

### Bug Fixes

- respect `verbose` config
  ([14f9ab7](https://github.com/jest-community/jest-react-reporter/commit/14f9ab7a28be4a19b202a123ea21f2c0c50e8588)),
  closes [#6](https://github.com/jest-community/jest-react-reporter/issues/6)

## [1.1.9](https://github.com/jest-community/jest-react-reporter/compare/v1.1.8...v1.1.9) (2019-11-13)

### Bug Fixes

- care less about width of terminal
  ([aa29f45](https://github.com/jest-community/jest-react-reporter/commit/aa29f4513d113306f840d46877003e38fe3d9fe5))
- handle duplicate log messages without barfing
  ([d48891a](https://github.com/jest-community/jest-react-reporter/commit/d48891ad69f2b50463561cf1bd62bb036e57677c))
- use normal spaces as padding instead of nbsp
  ([6a33c81](https://github.com/jest-community/jest-react-reporter/commit/6a33c81482a3341ffc7ff13919f38bde3fcf9448))

## [1.1.8](https://github.com/jest-community/jest-react-reporter/compare/v1.1.7...v1.1.8) (2019-11-13)

### Bug Fixes

- print to stderr
  ([de507dc](https://github.com/jest-community/jest-react-reporter/commit/de507dccce388a56271a640fed128c82dab93192))

## [1.1.7](https://github.com/jest-community/jest-react-reporter/compare/v1.1.6...v1.1.7) (2019-11-13)

### Bug Fixes

- always pass column width
  ([636edb8](https://github.com/jest-community/jest-react-reporter/commit/636edb827457ef2385f8e5a564ba910462ce3f64))

## [1.1.6](https://github.com/jest-community/jest-react-reporter/compare/v1.1.5...v1.1.6) (2019-11-13)

### Bug Fixes

- include TS types in bundle
  ([541a8d0](https://github.com/jest-community/jest-react-reporter/commit/541a8d0e3e733e35075521b864e2d1df6223a846))

## [1.1.5](https://github.com/jest-community/jest-react-reporter/compare/v1.1.4...v1.1.5) (2019-11-13)

### Bug Fixes

- correct dimming of text in summary
  ([2299ec7](https://github.com/jest-community/jest-react-reporter/commit/2299ec7e6d15af27f08b5c83ee4094de915e3eda))

## [1.1.4](https://github.com/jest-community/jest-react-reporter/compare/v1.1.3...v1.1.4) (2019-11-13)

### Bug Fixes

- use padding for spacing rather than spaces
  ([c98de61](https://github.com/jest-community/jest-react-reporter/commit/c98de619f5d23f80a6d77fa53d80b5addef600a0))

## [1.1.3](https://github.com/jest-community/jest-react-reporter/compare/v1.1.2...v1.1.3) (2019-11-13)

### Bug Fixes

- only print pattern if not the default
  ([e5e271e](https://github.com/jest-community/jest-react-reporter/commit/e5e271e17ac589edf4a22a53ee268d9ffab2e09d))

## [1.1.2](https://github.com/jest-community/jest-react-reporter/compare/v1.1.1...v1.1.2) (2019-11-13)

### Bug Fixes

- always show estimation if higher than runtime
  ([bd653b1](https://github.com/jest-community/jest-react-reporter/commit/bd653b1d5dd1c81f504dd832166c413f996dd6ba))

## [1.1.1](https://github.com/jest-community/jest-react-reporter/compare/v1.1.0...v1.1.1) (2019-11-12)

### Bug Fixes

- do not print post summary message if silent
  ([888fced](https://github.com/jest-community/jest-react-reporter/commit/888fced1c9ff1c01c90a4a5bccd528c73fd06962))

# [1.1.0](https://github.com/jest-community/jest-react-reporter/compare/v1.0.2...v1.1.0) (2019-11-12)

### Features

- add message after summary
  ([ca67328](https://github.com/jest-community/jest-react-reporter/commit/ca67328ef616fb1d549a5c5d2aa0a408cbf10b0f))

## [1.0.2](https://github.com/jest-community/jest-react-reporter/compare/v1.0.1...v1.0.2) (2019-11-12)

### Bug Fixes

- always render a summary, remove progress and estimation when done
  ([4bc5cb3](https://github.com/jest-community/jest-react-reporter/commit/4bc5cb33d8b250c361e9812cd991ca0cb714536d))

## [1.0.1](https://github.com/jest-community/jest-react-reporter/compare/v1.0.0...v1.0.1) (2019-11-12)

### Bug Fixes

- unmount from within app rather than from teh outside
  ([eb2dc86](https://github.com/jest-community/jest-react-reporter/commit/eb2dc8676089c75142b72275a764cac3d9f72091))

# 1.0.0 (2019-11-10)

### Features

- initial commit
  ([4a83048](https://github.com/jest-community/jest-react-reporter/commit/4a8304892e28b1a12d97bca8ad1e61db878d09b8))
