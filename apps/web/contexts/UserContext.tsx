import { SessionContextValue, signOut, signIn, useSession } from 'next-auth/react';
import React from 'react';
import { useCookie } from 'react-use';
import useProject from '../hooks/useProject';
import { ProjectQuery, SelfProjectsQuery, useProjectQuery, useSelfProjectsQuery, BaseSelfFragment } from '../types/gql';
import { noop, Constants } from 'shared';
import w3t from 'web3token';
import Web3 from 'web3';


// TODO: Move this
declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var ethereum: any | undefined;
}

export type UserContextValue = {
  nextAuth: SessionContextValue;
  w3t: { web3: Web3 | null, sign: () => void };
  user: BaseSelfFragment | null;	
  logout: () => void;
  loading: boolean;
  
  project: ProjectQuery['project'] | null;
  projects: Array<SelfProjectsQuery['self']['projects'][0]['project']> | null;
}

export const UserContext = React.createContext<UserContextValue>({
  nextAuth: { data: null, status: 'loading' },
  w3t: { web3: null, sign: noop },
  user: null,
  logout: noop,
  loading: true,
  project: null,
  projects: null,
});

export function useUserContext() {
  return React.useContext(UserContext);
}

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {

  const [projectId] = useProject();

  const nextAuthSession = useSession();


  const web3 = React.useMemo(() => {
    if (!process.browser) return null;
    if (!window.ethereum) return null;
    return new Web3(window.ethereum);
  }, []);

  const [_, updateSessionToken] = useCookie(Constants.NEXT_AUTH_SESSION_TOKEN_COOKIE);

  const w3tSign = React.useCallback(async () => {

    if (!web3) return;
    const token = await w3t.sign(web3, { statement: Constants.WEB3_TOKEN_STATEMENT, expiresIn: Constants.NEXT_AUTH_SESSION_MAX_AGE, domain: window.location.hostname, omitStatement: true });

    updateSessionToken(token);
    signIn('w3t', { callbackUrl: '/dashboard' });

  }, [updateSessionToken, web3]);

  const w3tValue = React.useMemo(() => ({
    web3,
    sign: w3tSign,
  }), [w3tSign, web3]);


  const logout = React.useCallback(() => {
    // w3tClear();
    signOut({ callbackUrl: '/' });
  }, []);


  const hasAuth = !!nextAuthSession.data;
  
  const { data: projectData, loading: projectLoading } = useProjectQuery({
    variables: {
      projectId,
    },
    skip: !hasAuth,
  });

  const { data: selfData, loading: selfLoading } = useSelfProjectsQuery({ context: { serverless: true }, skip: !hasAuth });
  
  const loading = nextAuthSession.status === 'loading' || projectLoading || selfLoading;

  return (
    <UserContext.Provider
      value={{
        nextAuth: nextAuthSession,
        w3t: w3tValue,
        user: selfData?.self ?? null,
        logout,
        loading,
        project: projectData?.project ?? null,
        projects: selfData?.self?.projects.map(e => e.project) ?? null,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const userLogout = () => {
  signOut({ callbackUrl: '/' });
}