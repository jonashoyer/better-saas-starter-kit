import * as NexusSchema from 'nexus';
import { nexusPrisma } from 'nexus-plugin-prisma';
import * as path from 'path';
import * as types from './types';

export default NexusSchema.makeSchema({
  types,
  plugins: [
    nexusPrisma({
      experimentalCRUD: true,
      paginationStrategy: 'prisma',
    }),
    NexusSchema.declarativeWrappingPlugin(),
    NexusSchema.fieldAuthorizePlugin({
      formatError({ error, info }) {
        console.error(error, info);
        return error;
      }
    }),
    NexusSchema.nullabilityGuardPlugin({
      onGuarded({
        fallback,
        ctx,
        info,
        type
      }) {
        // This could report to a service like Sentry, or log internally - up to you!
        console.error(
          `Error: Saw a null value for non-null field ${info.parentType.name}.${info.fieldName}, type: ${type}, ${info.rootValue ? `(${info.rootValue.id})` : ""}`
        );
      },
      fallbackValues: {
        Int: () => 0,
        String: () => "",
        Boolean: () => false,
        Date: () => new Date(0),
        DateTime: () => new Date(0),
        Json: () => null,
        JSONObject: () => {},
      },
    })
  ],
  outputs: {
    typegen: path.join(process.cwd(), 'generated', 'nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'generated', 'schema.graphql'),
  },
  contextType: {
    module: path.join(process.cwd(), 'graphql', 'context.ts'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: path.join(process.cwd(), '..', '..', 'node_modules', '.prisma', 'client', 'index.d.ts'),
        alias: 'prisma',
      },
    ],
  },
});
