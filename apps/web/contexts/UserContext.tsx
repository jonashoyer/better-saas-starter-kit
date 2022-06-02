import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useCookie } from 'react-use';
import useProject from '../hooks/useProject';
import { ProjectQuery, SelfProjectsQuery, useProjectQuery, useSelfProjectsQuery } from '../types/gql';
import { noop, Constants } from 'shared';

import w3t from 'web3token';
import Web3 from 'web3';
import ms from 'ms';


declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var ethereum: any | undefined;
}

export type UserContextValue = {
  session: Session | null;
  loading: boolean;
  status: "authenticated" | "loading" | "unauthenticated";
  
  project: ProjectQuery['project'] | null;
  projects: SelfProjectsQuery['selfProjects'] | null;

  web3: Web3 | null;
  web3Token: string | null;
  w3tSign: () => void;
  w3tClear: () => void;
}

export const UserContext = React.createContext<UserContextValue>({
    session: null,
    loading: true,
    status: "unauthenticated",
    project: null,
    projects: null,
    web3: null,
    web3Token: null,
    w3tSign: noop,
    w3tClear: noop,
});

export function useUserContext() {
  return React.useContext(UserContext);
}

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {

  const [projectId] = useProject();

  const { data: session, status } = useSession();


  const web3 = React.useMemo(() => {
    if (!process.browser) return null;
    if (!window.ethereum) return null;
    return new Web3(window.ethereum);
  }, []);

  const [web3Token, updateWeb3Token, deleteWeb3Token] = useCookie('w3t');

  const w3tSign = React.useCallback(async () => {

    if (!web3) return;
    const token = await w3t.sign(web3, { statement: Constants.WEB3_TOKEN_STATEMENT, expiresIn: '24h', domain: window.location.hostname, omitStatement: true });

    updateWeb3Token(token, { expires: new Date(Date.now() + ms('24h')) });

    const { address, payload } = await w3t.verify(web3, token, { statement: Constants.WEB3_TOKEN_STATEMENT });

    console.log({ address, payload });

  }, [updateWeb3Token, web3]);

  const w3tClear = React.useCallback(() => {
    deleteWeb3Token();
  }, [deleteWeb3Token]);



  const hasAuth = !!web3Token || !!session; 
  
  const { data: projectData, loading: projectLoading } = useProjectQuery({
    variables: {
      projectId,
    },
    skip: !hasAuth,
  });

  const { data: selfProjectsData, loading: selfLoading } = useSelfProjectsQuery({ context: { serverless: true }, skip: !hasAuth });
  
  const loading = status === 'loading' || projectLoading || selfLoading;

  return (
    <UserContext.Provider
      value={{
        session,
        loading,
        status,
        project: projectData?.project ?? null,
        projects: selfProjectsData?.selfProjects ?? null,

        web3,
        web3Token,
        w3tSign,
        w3tClear,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}