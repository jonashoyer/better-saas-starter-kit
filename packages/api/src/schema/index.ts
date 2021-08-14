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
        module: path.join(process.cwd(), '..', '..', 'node_modules', '.prisma', 'client', 'index.d.ts'),
        alias: 'prisma',
      },
    ],
  },
});
