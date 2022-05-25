import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { ParsedUrlQuery } from "querystring";
import { Constants } from "shared";
import { CurrentProjectDocument, CurrentProjectQuery, SelfProjectsDocument, SelfProjectsQuery } from "../types/gql";
import { initializeApollo } from "./GraphqlClient";

type Context = GetServerSidePropsContext<ParsedUrlQuery>;

export const createApolloClient = (ctx: Context) => initializeApollo({}, ctx.req.headers);;

export const getProjectId = (ctx: Context): string | null => ctx.req.cookies[Constants.PROJECT_ID_COOKIE_KEY] ?? null;

export interface FetchUserContextResult {
  projectId?: string;
  session: Session;
  project: CurrentProjectQuery['currentProject'] | null;
  projects: SelfProjectsQuery['selfProjects'] | null;
  client: ApolloClient<NormalizedCacheObject>;
}


export const fetchUserContext = async (ctx: Context, _client?: ApolloClient<NormalizedCacheObject>): Promise<FetchUserContextResult> => {

  const client = _client || createApolloClient(ctx);

  const projectId = getProjectId(ctx);
  const session = await getSession(ctx);

  console.log({ projectId, session, headers: ctx.req.headers });

  const [
    projectQuery,
    projectsQuery,
  ] = await Promise.all([
    client.query({
      query: CurrentProjectDocument,
      variables: {
        projectId: projectId,
      },
    }),
    client.query({
      query: SelfProjectsDocument,
    }),
  ]);

  return {
    projectId,
    session,
    project: projectQuery?.data?.currentProject ?? null,
    projects: projectsQuery?.data?.selfProjects ?? [],
    client,
  }
}