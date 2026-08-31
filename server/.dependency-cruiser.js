/**
 * Clean Architecture boundaries for the API. Run from server/, so paths here are
 * relative to that directory.
 */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      comment: 'Two modules that import each other cannot be read, tested or moved on their own.',
      severity: 'error',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'entities-know-no-outer-layer',
      comment: 'Entities are the innermost layer. Use cases, transports and storage stay invisible to them.',
      severity: 'error',
      from: {
        path: '^entities/',
      },
      to: {
        path: '^(services|controllers|db|routes)/',
      },
    },
    {
      name: 'entities-use-no-packages',
      comment: 'The photo entity needs no npm package. Add an exception here only when a domain rule itself needs one.',
      severity: 'error',
      from: {
        path: '^entities/',
      },
      to: {
        dependencyTypes: ['npm', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-bundled'],
      },
    },
    {
      name: 'services-know-no-transport',
      comment: 'Use cases answer to any caller, so HTTP controllers and routes stay invisible to them.',
      severity: 'error',
      from: {
        path: '^services/',
      },
      to: {
        path: '^(controllers|routes)/',
      },
    },
    {
      name: 'prisma-stays-in-db',
      comment: 'The ORM lives behind the repository port. This is the rule that catches a service importing the Prisma client. prisma.config.ts is CLI configuration rather than application code.',
      severity: 'error',
      from: {
        pathNot: '^db/|^prisma[.]config[.]ts$',
      },
      to: {
        path: 'node_modules/(@prisma/|prisma/|[.]prisma/)',
      },
    },
    {
      name: 'storage-stays-behind-the-port',
      comment: 'Only the composition root reaches for the db module. Use cases take the repository port. Tests may reach the fake client.',
      severity: 'error',
      from: {
        path: '^(entities|services|controllers|routes)/',
        pathNot: '[.]spec[.]ts$',
      },
      to: {
        path: '^db/',
      },
    },
    {
      name: 'express-stays-at-the-edge',
      comment: 'Express belongs to the transport layer: controllers, routes and app.ts. models/index.ts is the exception, since it aliases express types for every layer.',
      severity: 'error',
      from: {
        pathNot: '^(controllers|routes)/|^app[.]ts$|^models/index[.]ts$',
      },
      to: {
        path: 'node_modules/express/',
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    // Count type-only imports too, or a service could pull a controller's types in unseen.
    tsPreCompilationDeps: true,
  },
}
