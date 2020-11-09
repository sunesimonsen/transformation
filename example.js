const fs = require("fs").promises;

const { glob } = require("./packages/glob");

const {
  extend,
  filter,
  map,
  parallel,
  program,
  tap,
} = require("./packages/core");

const main = async () => {
  await program(
    glob("./packages/*/package.json"),
    parallel(map(fs.readFile), 4),
    map(JSON.parse),
    extend({
      localDependencies: map(({ dependencies }) =>
        Object.keys(dependencies).filter((dependency) =>
          dependency.startsWith("@transformation/")
        )
      ),
    }),
    filter(({ localDependencies }) => localDependencies.length > 0),
    tap(
      ({ name, localDependencies }) =>
        `${name} => ${localDependencies.join(", ")}`
    )
  );
};

main();
