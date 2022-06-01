import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import React from 'react';
import useProject from '../hooks/useProject';
import { ProjectQuery, SelfProjectsQuery, useProjectQuery, useSelfProjectsQuery } from '../types/gql';

export type UserContextValue = {
  session: Session | null;
  loading: boolean;
  status: "authenticated" | "loading" | "unauthenticated";
  project: ProjectQuery['project'] | null;
  projects: SelfProjectsQuery['selfProjects'] | null;
}

export const UserContext = React.createContext<UserContextValue>({ session: null, loading: true, status: "unauthenticated", project: null, projects: null });

export function useUserContext() {
  return React.useContext(UserContext);
}

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {

  const [projectId] = useProject();

  const { data: session, status } = useSession();

  
  const { data: projectData, loading: projectLoading } = useProjectQuery({
    variables: {
      projectId,
    },
    skip: !projectId || !session,
  });
  const { data: selfProjectsData } = useSelfProjectsQuery({ context: { serverless: true }, skip: !session });
  
  const loading = status === 'loading' || projectLoading;

  return (
    <UserContext.Provider
      value={{
        session,
        loading,
        status,
        project: projectData?.project ?? null,
        projects: selfProjectsData?.selfProjects ?? null
      }}
    >
      {children}
    </UserContext.Provider>
  )
}