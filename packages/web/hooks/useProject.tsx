import { createStateContext, useCookie } from 'react-use';
import { Constants } from 'bs-shared-kit';

export const [useProjetValue, ProjectValueProvider] = createStateContext<string>(null);

const useProject = (): [string, (v: string) => void] => {

  const [ctxValue, setCtxValue] = useProjetValue();  
  const [v, s] = useCookie(Constants.PROJECT_ID_COOKIE_KEY);

  const set = (projectId: string) => {
    s(projectId, { expires: 365 });
    setCtxValue(projectId);
  }
  return [ctxValue ?? v, set];
}

export default useProject;