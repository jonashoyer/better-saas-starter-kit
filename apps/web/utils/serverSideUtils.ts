import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { ParsedUrlQuery } from "querystring";
import { Constants } from "shared";
import { authorizeWeb3Token } from "shared-server";
import { ProjectDocument, ProjectQuery, SelfProjectsDocument, SelfProjectsQuery } from "../types/gql";
import { initializeApollo } from "./GraphqlClient";
import { prisma } from 'utils/prisma';

type Context = GetServerSidePropsContext<ParsedUrlQuery>;

export const createApolloClient = (ctx: Context) => initializeApollo({ headers: ctx.req.headers });

export const getProjectId = (ctx: Context): string | null => ctx.req.cookies[Constants.PROJECT_ID_COOKIE_KEY] ?? null;

export interface FetchUserContextResult {
  projectId?: string;
  session: Session;
  project: ProjectQuery['project'] | null;
  projects: Array<SelfProjectsQuery['self']['projects'][0]['project']> | null;
  client: ApolloClient<NormalizedCacheObject>;
}


const getUserSession = async (ctx: Context) => {
  try {

    if (ctx.req.cookies.w3t) {
      console.log(ctx.req.cookies.w3t);
      const { user, decoded } = await authorizeWeb3Token(prisma, ctx.req.cookies.w3t);
      return { user, expires: new Date(decoded.payload.expiresAt).toISOString() };
    }

    const session = await getSession(ctx);
    return session;
  } catch {
    return null;
  }
}

export const fetchUserContext = async (ctx: Context, _client?: ApolloClient<NormalizedCacheObject>): Promise<FetchUserContextResult> => {

  const client = _client || createApolloClient(ctx);

  const projectId = getProjectId(ctx);

  const session = await getUserSession(ctx);

  if (!session) return { projectId: null, session: null, project: null, projects: [], client };

  try {

    const [
      projectQuery,
      projectsQuery,
    ] = await Promise.all([
      client.query({
        query: ProjectDocument,
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
      project: projectQuery?.data?.project ?? null,
      projects: projectsQuery?.data?.self.projects.map(e => e.project) ?? [],
      client,
    }
  } catch (err) {
    return { projectId: null, session: null, project: null, projects: [], client };
  }
}