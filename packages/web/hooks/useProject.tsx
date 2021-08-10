import { createStateContext, useCookie } from 'react-use';
import { Constants } from 'bs-shared-kit';

export const [useProjetValue, ProjectValueProvider] = createStateContext<string>(null);

const useProject = (): [string, (v: string) => void] => {

  const [ctxValue, setCtxValue] = useProjetValue();  
  const [v, s, clear] = useCookie(Constants.PROJECT_ID_COOKIE_KEY);

  const set = (projectId: null | string) => {
    if (projectId) s(projectId, { expires: 365 });
    else clear();
    setCtxValue(projectId);
  }
  return [ctxValue ?? v, set];
}

export default useProject;