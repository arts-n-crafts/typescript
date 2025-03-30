# Changelog


## v0.0.5

[compare changes](https://github.com/jvhellemondt/arts-and-crafts.ts/compare/v0.0.4...v0.0.5)

### 🏡 Chore

- Add repository type ([282b78a](https://github.com/jvhellemondt/arts-and-crafts.ts/commit/282b78a))
- Add vitest/globals to tsconfig ([fec28be](https://github.com/jvhellemondt/arts-and-crafts.ts/commit/fec28be))

### ❤️ Contributors

- Jens Van Hellemondt <jens@invictus.codes>

## v0.0.4

[compare changes](https://github.com/jvhellemondt/arts-and-crafts.ts/compare/v0.0.3...v0.0.4)

### 💅 Refactors

- **AggregateRoot:** Move id to first argument ([6d70b9c](https://github.com/jvhellemondt/arts-and-crafts.ts/commit/6d70b9c))

### 🤖 CI

- Add github action to verify latest changes ([b4f464b](https://github.com/jvhellemondt/arts-and-crafts.ts/commit/b4f464b))
- Update release-it to use coverage ([d569101](https://github.com/jvhellemondt/arts-and-crafts.ts/commit/d569101))

### ❤️ Contributors

- Jens Van Hellemondt <jens@invictus.codes>

## v0.0.3

[compare changes](https://github.com/jvhellemondt/arts-and-crafts.ts/compare/v0.0.2...v0.0.3)

### 🏡 Chore

- Rename package to arts-and-crafts ([9e9c56a](https://github.com/jvhellemondt/arts-and-crafts.ts/commit/9e9c56a))

### ❤️ Contributors

- Jens Van Hellemondt <jens@invictus.codes>

## v0.0.2


### 🚀 Enhancements

- **AggregateRoot:** Should be defined ([f41be10](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/f41be10))
- **Entity:** Apply factory pattern ([953f6bd](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/953f6bd))
- **root:** Add a watch specific test mode ([bb428a0](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/bb428a0))
- **AggregateRoot:** Should apply events ([e6d146e](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/e6d146e))
- **AggregateRoot:** Should mark events as committed by clearing uncommittedEvents ([4a7b6b3](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/4a7b6b3))
- **Specification:** Add Specification and AndSpecification ([7f0d923](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/7f0d923))
- **Specification:** Add OrSpecification ([f4d9660](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/f4d9660))
- **Specification:** OrSpecification should/ should not satisfy ([b36c48f](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/b36c48f))
- **Specificaton:** NotSpecification should be defined ([e78c142](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/e78c142))
- **Specificaton:** NotSpecification should/ should not be satisfied ([c2a0e46](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/c2a0e46))
- **Repository:** Should be defined and have a find, load and store method ([ed6df1c](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/ed6df1c))
- **Repository:** Should be able to store a new event from an aggregate ([c3ff9c7](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/c3ff9c7))
- **AggregateRoot:** Should rehydrate events ([16520b4](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/16520b4))
- **AggregateRoot:** Should rehydrate events ([e7f38d1](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/e7f38d1))
- **Repository:** Should rehydrate the aggregate based on its events ([0ddac9d](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/0ddac9d))
- **EventHandler:** Should be defined ([15b9c61](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/15b9c61))
- **QueryHandler:** Should process the MockUserCreated event and dispatch the MockUserRegistrationEmailSentEvent ([9851d95](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/9851d95))
- **EventBus:** Should be able subscribe to events ([c1d24bd](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/c1d24bd))
- **CommandHandler:** Should process the command and emit the UserCreated event ([7521ba1](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/7521ba1))
- **CommandHandler:** Should process the MockUpdateUserName Command and emit the MockUserNameUpdated Event ([4c1fb35](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/4c1fb35))
- **ProjectionHandler:** Should be defined ([3f34fc5](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/3f34fc5))
- **Specification:** Add toQuery method ([ab27fcf](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/ab27fcf))
- **QueryBus:** Update Query specification and add mock query handlers ([97c8cee](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/97c8cee))
- **ProjectionHandler:** Add ProjectionHandler interface and Database interface ([204c0fc](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/204c0fc))
- **Specification:** Should be defined ([6ec2b4a](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/6ec2b4a))
- **Specification:** Should return the correct filter for lookups ([14d99ab](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/14d99ab))
- **Specification:** (AgeSpecification) should return the correct filter for lookups ([0a71fc4](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/0a71fc4))
- **Specification:** Add toQuery to binary specifications ([e3b8a80](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/e3b8a80))
- Add husky for precommit and -push ([586d34a](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/586d34a))
- **QueryHandler:** Should be defined ([28b3962](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/28b3962))
- Add UnknownFunction type ([9fbda34](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/9fbda34))
- Add MockUserByEmailSpecification and its tests ([926578e](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/926578e))
- **database:** Add Database spec and implement InMemory ([4978fb7](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/4978fb7))
- **querybus:** Implement database spec ([db82957](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/db82957))
- **querybus:** Queryhandler should return the requested data ([15f2e6f](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/15f2e6f))
- **domainevent:** Split metadata to props and internal. Generate eventId and event timestamp ([8962c5a](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/8962c5a))
- **eventbus:** Should be able publish events ([21a2e4e](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/21a2e4e))
- **QueryBus:** It should be defined ([1599113](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/1599113))
- **QueryBus:** Should throw an error if the query handler is not registered ([c8ec1ef](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/c8ec1ef))
- **QueryBus:** Should be able to register a handler ([4285822](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/4285822))
- **QueryBus:** Should execute a query ([e0efcf7](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/e0efcf7))
- **Database:** Should return TableDoesNotExistException if the table does not exist ([1ca99c3](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/1ca99c3))
- **Database:** Should throw an error if the operation is not supported ([9a07e53](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/9a07e53))
- **ProjectionHandler:** Should update projection with create event ([927d11a](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/927d11a))
- **ProjectionHandler:** Should update projection with update event ([c095383](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/c095383))
- **ScenarioTest:** Should add the events provided to the given step to the eventStore ([7c30c32](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/7c30c32))
- **ScenarioTest:** Should execute the command in the when step ([30a45b2](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/30a45b2))
- **ScenarioTest:** Should have executed the command, as an event, in the then step ([10c132e](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/10c132e))
- **CommandBus:** Command should have a type ([ab2aa3c](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/ab2aa3c))
- **QueryBus:** Query should have a type ([1c12c95](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/1c12c95))
- **EventBus:** Event should have a type ([be77518](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/be77518))
- **ScenarioTest:** Should have executed the query with the expected result in the then step ([53de265](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/53de265))
- **ValueObject:** Should be defined ([e616be2](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/e616be2))
- **ValueObject:** Should implement IValueObject ([b013e5c](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/b013e5c))
- **ValueObject:** Should equal based on hash if its value is equal (string) ([8cf411c](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/8cf411c))
- **ValueObject:** Should equal based on hash if its value is equal (others) ([f94d660](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/f94d660))
- **ValueObject:** Should not equal based on hash if its value is not equal ([fbfc6da](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/fbfc6da))
- **ValueObject:** Should return the value given ([60f00a4](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/60f00a4))
- **ScenarioTest:** Should throw an error when a command is given and then the expected event is not triggered ([d388722](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/d388722))
- **ScenarioTest:** Should have dispatched an event based on listening to an event ([43eabc6](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/43eabc6))
- **ScenarioTest:** Should throw an error if the when is an event and then is not an event ([554ee17](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/554ee17))

### 🩹 Fixes

- **CommandBus:** Add aggregateId to payload ([1e87826](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/1e87826))
- **CommandBus:** Should process the command via commandBus and return the event ([a668560](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a668560))
- **MockUserCreatedEventHandler:** Only run on created event ([86d15e7](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/86d15e7))
- **MockUserProjection:** Do not throw error on unknown events ([2d3f240](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/2d3f240))
- **ScenarioTest:** Find event by constructor name ([a8ce7eb](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a8ce7eb))

### 💅 Refactors

- **Entity:** Update typing ([084e30d](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/084e30d))
- **AggregateRoot:** Cleanup test ([5261b67](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/5261b67))
- **Repository:** Remove find method and separate the tests ([e8bd751](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/e8bd751))
- **DomainEvent:** Redesign DomainEvent ([7a93450](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/7a93450))
- **CommandBus:** Simplify types ([a83ca93](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a83ca93))
- **QueryBus:** Simplify types ([c713de1](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/c713de1))
- **Repository:** Simplify types ([a8f488e](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a8f488e))
- **Entity:** Simplify types ([1bc31f2](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/1bc31f2))
- **Aggregate:** Simplify types ([c464df6](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/c464df6))
- **ScenarioTest:** Simplify types ([23bfe5c](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/23bfe5c))
- **DomainEvent:** Simplify types ([23f583a](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/23f583a))
- **CommandBus:** Rename MockCommand to MockUpdateUserNameCommand ([a3c27b1](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a3c27b1))
- **Repository:** Rename MockRepository to MockUserRepository ([fa2f066](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/fa2f066))
- **Specification:** Update the result type of toQuery method ([cdcf51e](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/cdcf51e))
- **Specification:** Update typings toQuery method ([43f7826](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/43f7826))
- **Specification:** ToQuery should return an array ([5986074](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/5986074))
- **EventBus:** Should subscribe event handlers without specific event ([26f7a30](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/26f7a30))
- **specification:** Update toQuery type to FilledArray ([af9f99a](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/af9f99a))
- **EventStore:** Add eventBus to the eventStore ([9eddd81](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/9eddd81))
- **InMemoryEventStore:** Only create empty array when aggregate was not in event store ([09037ee](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/09037ee))
- **ScenarioTest:** Should execute the givens and when-command in the then step ([8d13cc3](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/8d13cc3))
- **ScenarioTest:** Should execute the givens and when-command in the then step ([57ebe9b](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/57ebe9b))
- Move Module interface to separate file ([a611884](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a611884))
- Update generics for AggregateRoot and update consequently ([88912b6](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/88912b6))

### 🏡 Chore

- Migrate to submodule ([dd61150](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/dd61150))
- Remove unused index.ts ([5659907](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/5659907))
- **types:** Improve typing and type inference ([a59109e](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a59109e))
- **config:** Add commitlint and update husky ([b4af9f3](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/b4af9f3))
- Rename test:coverage to coverage ([f420997](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/f420997))
- **ProjectionHandler:** Remove start from interface, prefer eventBus.subscribe ([a230d7d](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a230d7d))
- **eslint:** Update eslint config to use antfu's and lint:fix ([d4a5aa4](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/d4a5aa4))
- Rename mocks to examples ([851c6f7](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/851c6f7))
- Add release flow ([50b09f0](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/50b09f0))
- **release:** V0.0.1 ([dd6e75b](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/dd6e75b))
- Update package name to -essentials ([6424d45](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/6424d45))
- **ScenarioTest:** Move tests to their action type ([00a338d](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/00a338d))
- **ScenarioTest:** Remove falsy check at isEvent within ScenarioTest ([060ced7](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/060ced7))
- **husky:** Enable coverage check ([a8fcf07](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a8fcf07))

### ✅ Tests

- **AggregateRoot:** Should do nothing on an unhandled event ([a1d710b](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a1d710b))
- **AggregateRoot:** Add tests for missing create/rehydrate methods ([f2fb2f5](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/f2fb2f5))
- **ScenarioTest:** Add failure cases ([100f632](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/100f632))
- **ScenarioTest:** Should throw an error if the when is an event and then is not found ([54bb91d](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/54bb91d))

### ❤️ Contributors

- Jens Van Hellemondt <jens@invictus.codes>

## v0.0.1


### 🚀 Enhancements

- **AggregateRoot:** Should be defined ([f41be10](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/f41be10))
- **Entity:** Apply factory pattern ([953f6bd](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/953f6bd))
- **root:** Add a watch specific test mode ([bb428a0](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/bb428a0))
- **AggregateRoot:** Should apply events ([e6d146e](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/e6d146e))
- **AggregateRoot:** Should mark events as committed by clearing uncommittedEvents ([4a7b6b3](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/4a7b6b3))
- **Specification:** Add Specification and AndSpecification ([7f0d923](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/7f0d923))
- **Specification:** Add OrSpecification ([f4d9660](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/f4d9660))
- **Specification:** OrSpecification should/ should not satisfy ([b36c48f](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/b36c48f))
- **Specificaton:** NotSpecification should be defined ([e78c142](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/e78c142))
- **Specificaton:** NotSpecification should/ should not be satisfied ([c2a0e46](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/c2a0e46))
- **Repository:** Should be defined and have a find, load and store method ([ed6df1c](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/ed6df1c))
- **Repository:** Should be able to store a new event from an aggregate ([c3ff9c7](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/c3ff9c7))
- **AggregateRoot:** Should rehydrate events ([16520b4](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/16520b4))
- **AggregateRoot:** Should rehydrate events ([e7f38d1](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/e7f38d1))
- **Repository:** Should rehydrate the aggregate based on its events ([0ddac9d](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/0ddac9d))
- **EventHandler:** Should be defined ([15b9c61](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/15b9c61))
- **QueryHandler:** Should process the MockUserCreated event and dispatch the MockUserRegistrationEmailSentEvent ([9851d95](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/9851d95))
- **EventBus:** Should be able subscribe to events ([c1d24bd](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/c1d24bd))
- **CommandHandler:** Should process the command and emit the UserCreated event ([7521ba1](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/7521ba1))
- **CommandHandler:** Should process the MockUpdateUserName Command and emit the MockUserNameUpdated Event ([4c1fb35](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/4c1fb35))
- **ProjectionHandler:** Should be defined ([3f34fc5](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/3f34fc5))
- **Specification:** Add toQuery method ([ab27fcf](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/ab27fcf))
- **QueryBus:** Update Query specification and add mock query handlers ([97c8cee](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/97c8cee))
- **ProjectionHandler:** Add ProjectionHandler interface and Database interface ([204c0fc](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/204c0fc))
- **Specification:** Should be defined ([6ec2b4a](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/6ec2b4a))
- **Specification:** Should return the correct filter for lookups ([14d99ab](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/14d99ab))
- **Specification:** (AgeSpecification) should return the correct filter for lookups ([0a71fc4](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/0a71fc4))
- **Specification:** Add toQuery to binary specifications ([e3b8a80](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/e3b8a80))
- Add husky for precommit and -push ([586d34a](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/586d34a))
- **QueryHandler:** Should be defined ([28b3962](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/28b3962))
- Add UnknownFunction type ([9fbda34](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/9fbda34))
- Add MockUserByEmailSpecification and its tests ([926578e](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/926578e))
- **database:** Add Database spec and implement InMemory ([4978fb7](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/4978fb7))
- **querybus:** Implement database spec ([db82957](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/db82957))
- **querybus:** Queryhandler should return the requested data ([15f2e6f](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/15f2e6f))
- **domainevent:** Split metadata to props and internal. Generate eventId and event timestamp ([8962c5a](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/8962c5a))
- **eventbus:** Should be able publish events ([21a2e4e](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/21a2e4e))
- **QueryBus:** It should be defined ([1599113](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/1599113))
- **QueryBus:** Should throw an error if the query handler is not registered ([c8ec1ef](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/c8ec1ef))
- **QueryBus:** Should be able to register a handler ([4285822](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/4285822))
- **QueryBus:** Should execute a query ([e0efcf7](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/e0efcf7))
- **Database:** Should return TableDoesNotExistException if the table does not exist ([1ca99c3](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/1ca99c3))
- **Database:** Should throw an error if the operation is not supported ([9a07e53](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/9a07e53))
- **ProjectionHandler:** Should update projection with create event ([927d11a](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/927d11a))
- **ProjectionHandler:** Should update projection with update event ([c095383](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/c095383))
- **ScenarioTest:** Should add the events provided to the given step to the eventStore ([7c30c32](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/7c30c32))
- **ScenarioTest:** Should execute the command in the when step ([30a45b2](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/30a45b2))
- **ScenarioTest:** Should have executed the command, as an event, in the then step ([10c132e](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/10c132e))
- **CommandBus:** Command should have a type ([ab2aa3c](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/ab2aa3c))
- **QueryBus:** Query should have a type ([1c12c95](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/1c12c95))
- **EventBus:** Event should have a type ([be77518](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/be77518))
- **ScenarioTest:** Should have executed the query with the expected result in the then step ([53de265](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/53de265))
- **ValueObject:** Should be defined ([e616be2](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/e616be2))
- **ValueObject:** Should implement IValueObject ([b013e5c](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/b013e5c))
- **ValueObject:** Should equal based on hash if its value is equal (string) ([8cf411c](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/8cf411c))
- **ValueObject:** Should equal based on hash if its value is equal (others) ([f94d660](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/f94d660))
- **ValueObject:** Should not equal based on hash if its value is not equal ([fbfc6da](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/fbfc6da))
- **ValueObject:** Should return the value given ([60f00a4](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/60f00a4))

### 🩹 Fixes

- **CommandBus:** Add aggregateId to payload ([1e87826](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/1e87826))
- **CommandBus:** Should process the command via commandBus and return the event ([a668560](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a668560))
- **MockUserCreatedEventHandler:** Only run on created event ([86d15e7](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/86d15e7))
- **MockUserProjection:** Do not throw error on unknown events ([2d3f240](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/2d3f240))

### 💅 Refactors

- **Entity:** Update typing ([084e30d](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/084e30d))
- **AggregateRoot:** Cleanup test ([5261b67](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/5261b67))
- **Repository:** Remove find method and separate the tests ([e8bd751](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/e8bd751))
- **DomainEvent:** Redesign DomainEvent ([7a93450](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/7a93450))
- **CommandBus:** Simplify types ([a83ca93](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a83ca93))
- **QueryBus:** Simplify types ([c713de1](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/c713de1))
- **Repository:** Simplify types ([a8f488e](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a8f488e))
- **Entity:** Simplify types ([1bc31f2](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/1bc31f2))
- **Aggregate:** Simplify types ([c464df6](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/c464df6))
- **ScenarioTest:** Simplify types ([23bfe5c](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/23bfe5c))
- **DomainEvent:** Simplify types ([23f583a](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/23f583a))
- **CommandBus:** Rename MockCommand to MockUpdateUserNameCommand ([a3c27b1](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a3c27b1))
- **Repository:** Rename MockRepository to MockUserRepository ([fa2f066](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/fa2f066))
- **Specification:** Update the result type of toQuery method ([cdcf51e](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/cdcf51e))
- **Specification:** Update typings toQuery method ([43f7826](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/43f7826))
- **Specification:** ToQuery should return an array ([5986074](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/5986074))
- **EventBus:** Should subscribe event handlers without specific event ([26f7a30](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/26f7a30))
- **specification:** Update toQuery type to FilledArray ([af9f99a](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/af9f99a))
- **EventStore:** Add eventBus to the eventStore ([9eddd81](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/9eddd81))
- **InMemoryEventStore:** Only create empty array when aggregate was not in event store ([09037ee](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/09037ee))
- **ScenarioTest:** Should execute the givens and when-command in the then step ([8d13cc3](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/8d13cc3))
- **ScenarioTest:** Should execute the givens and when-command in the then step ([57ebe9b](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/57ebe9b))

### 🏡 Chore

- Migrate to submodule ([dd61150](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/dd61150))
- Remove unused index.ts ([5659907](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/5659907))
- **types:** Improve typing and type inference ([a59109e](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a59109e))
- **config:** Add commitlint and update husky ([b4af9f3](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/b4af9f3))
- Rename test:coverage to coverage ([f420997](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/f420997))
- **ProjectionHandler:** Remove start from interface, prefer eventBus.subscribe ([a230d7d](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a230d7d))
- **eslint:** Update eslint config to use antfu's and lint:fix ([d4a5aa4](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/d4a5aa4))
- Rename mocks to examples ([851c6f7](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/851c6f7))
- Add release flow ([50b09f0](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/50b09f0))

### ✅ Tests

- **AggregateRoot:** Should do nothing on an unhandled event ([a1d710b](https://github.com/jvhellemondt/crafts-and-arts.ts/commit/a1d710b))

### ❤️ Contributors

- Jens Van Hellemondt <jens@invictus.codes>

