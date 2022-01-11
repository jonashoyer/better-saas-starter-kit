import { mutationType, objectType } from "nexus";

export const StatusResponse = objectType({
  name: 'StatusResponse',
  definition(t) {
    t.boolean('ok');
    t.string('message');
  }
})

export const Mutation = mutationType({
  definition(t) {
    
  }
})