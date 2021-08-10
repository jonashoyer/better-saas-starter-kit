import React from 'react';
import Head from 'next/head';
import { useSession, getSession  } from "next-auth/client";
import { Box, Button, Paper, TextField, Typography } from '@material-ui/core';
import { CurrentProjectDocument, useCurrentProjectQuery, useDeleteProjectMutation, useUpdateProjectMutation } from 'types/gql';
import ProductPricingsLayout from '@/components/layouts/ProductPricingsLayout';
import prisma from '@/utils/prisma';
import { GetServerSideProps } from 'next';
import { apolloClient, initializeApollo } from '@/utils/GraphqlClient';
import { Constants } from 'bs-shared-kit';
import { setCookie } from '@/utils/cookies';
import useProject from '@/hooks/useProject';
import PageLayout from '@/components/layouts/PageLayout';
import { LoadingButton } from '@material-ui/lab';
import DialogTextfield from '@/components/elements/DialogTextfield';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

export default function Home(props: any) {

  const router = useRouter();
  
  const { t, lang } = useTranslation();
  
  const [projectId, setProject] = useProject();

  const [updateProject, { loading: updateLoading }] = useUpdateProjectMutation();

  const [deleteProject, { loading: deleteLoading }] = useDeleteProjectMutation({
    onCompleted() {
      setProject(null);
      router.push('/');
    },
  });

  const [name, setName] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);


  const { data: currentProjectData } = useCurrentProjectQuery({
    variables: {
      projectId,
    },
    onCompleted({ currentProject }) {
      setName(currentProject?.name);
    }
  });
  
  const onNameSave = (e: any) => {
    e?.preventDefault?.();
    if (!name) return;
    updateProject({ variables: { input: { id: projectId, name } } });
  }
  
  const onDelete = () => {
    deleteProject({ variables: { id: projectId } });
  }

  return (
    <React.Fragment>

      <DialogTextfield
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        loading={deleteLoading}
        controllerProps={{
          rules: {
            validate: input => input == currentProjectData.currentProject.name
          }
        }}
        useformProps={{ mode: 'all' }}
        label={t('settings:projectName')}
        title={t('settings:deleteProject')}
        content={t('settings:deleteProjectContent', { projectName: currentProjectData?.currentProject?.name })}
        onSubmit={onDelete}
        submitText='Delete'
        submitButtonProps={{
          color: 'error',
        }}
      />

      <Head>
        <title>APP</title>
        <meta name="description" content="Cloud Flash" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout padded>

        <Box sx={{ py: 1 }}>
          <ProductPricingsLayout products={props.products} />
        </Box>

        <Paper sx={{ p: 3, mb: 2, maxWidth: 768, mx: 'auto' }}>

          <Typography variant='h6' gutterBottom>{t('settings:projectSettings')}</Typography>

          <TextField
            size='small'
            margin='normal'
            label={t('settings:projectId')}
            fullWidth
            value={currentProjectData?.currentProject.id ?? ''}
            onChange={() => { }}
          />

          <form onSubmit={onNameSave}>
            <TextField
              margin='normal'
              label={t('settings:projectName')}
              fullWidth
              value={name ?? ''}
              onChange={e => setName(e.target.value)}
              disabled={updateLoading}
              InputProps={{
                endAdornment: (
                  <LoadingButton
                    loading={updateLoading}
                    variant='outlined'
                    onClick={onNameSave}
                    disabled={name == currentProjectData?.currentProject?.name}
                  >
                    {t('common:save')}
                  </LoadingButton>
                )
              }}
            />
          </form>

        </Paper>

        <Paper sx={{ p: 3, maxWidth: 768, margin: 'auto', borderWidth: 1, borderStyle: 'solid', borderColor: t => t.palette.error.main }} elevation={0}>
          <Typography variant='h6' color='error' gutterBottom>{t('settings:dangerZone')}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant='subtitle1'>Delete this project</Typography>
              <Typography variant='body2'>Delete this project</Typography>
            </Box>
            <Box>
              <Button variant='contained' color='error' onClick={() => setDeleteDialogOpen(true)}>{t('settings:deleteThisProject')}</Button>
            </Box>
          </Box>
        </Paper>


      </PageLayout>
    </React.Fragment>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx) as any;

  const client = initializeApollo({}, ctx.req.headers);

  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      prices: {
        where: { active: true },
      }
    },
  });

  if (session?.user) {

    const projectId = ctx.req.cookies[Constants.PROJECT_ID_COOKIE_KEY];

    const { data: { currentProject } } = await client.query({
      query: CurrentProjectDocument,
      variables: {
        projectId,
      },
    })

    if (!projectId && currentProject?.id) setCookie(ctx.res, Constants.PROJECT_ID_COOKIE_KEY, currentProject.id, { maxAge: 31540000000 });

    return {
      props: { products, projectId: currentProject?.id, initialApolloState: client.extract() },
    };
  }

  return {
    props: { products },
  };
}