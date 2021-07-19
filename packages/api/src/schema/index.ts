import { GraphQLScalarType } from 'graphql';
import { DateTimeResolver, JSONObjectResolver } from 'graphql-scalars';
import * as NexusSchema from 'nexus';
import { nexusPrisma } from 'nexus-plugin-prisma';
import * as path from 'path';
import * as types from './types';

export default NexusSchema.makeSchema({
  types,
  plugins: [
    nexusPrisma({
      experimentalCRUD: true,
      scalars: {
        DateTime: DateTimeResolver,
        Json: new GraphQLScalarType({
          ...JSONObjectResolver,
          name: 'Json',
          description: 'The `JSON` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
        })
      }
    }),
    NexusSchema.declarativeWrappingPlugin(),
  ],
  outputs: {
    typegen: path.join(
      __dirname,
      '../../node_modules/@types/nexus-typegen/index.d.ts',
    ),
  },
  contextType: {
    module: require.resolve('../context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: require.resolve('.prisma/client/index.d.ts'),
        alias: 'prisma',
      },
    ],
  },
});
