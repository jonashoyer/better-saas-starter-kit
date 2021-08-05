import { enumType, objectType } from 'nexus';

export const PaymentMethod = objectType({
  name: 'PaymentMethod',
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.brand();
    t.model.last4();
    t.model.expMonth();
    t.model.expYear();
    t.model.type();
    t.model.importance();
    t.model.project();
  },
});

export const PaymentMethodImportance = enumType({
  name: 'PaymentMethodImportance',
  members: ['PRIMARY', 'BACKUP', 'OTHER']
})