import { SortOrder, useProjectInvoicesLazyQuery } from "../types/gql";


const useFetchInvoices = (projectId: string) => {
  return useProjectInvoicesLazyQuery({
    variables: {
      projectId: projectId,
      ...defaultInvoiceVariables,
    }
  });
}

export default useFetchInvoices;

export const defaultInvoiceVariables = {
  invoicesWhere: {
    total: { gt: 0 },
  },
  invoicesOrderBy: { dueDate: SortOrder.Desc },
}