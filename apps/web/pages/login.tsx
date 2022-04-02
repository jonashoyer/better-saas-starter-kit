import React from 'react';
import { Box, Button, Paper, TextField, Typography, Divider, LinearProgress } from '@mui/material';
import { Constants } from 'shared';
import FormTextField from '../components/elements/FormTextField';
import { useForm } from 'react-hook-form';
import GoogleIcon from '@mui/icons-material/Google';
import { useRouter } from 'next/router';
import Logo from '../components/elements/Logo';
import GitHubIcon from '@mui/icons-material/GitHub';
import Head from 'next/head';
import Link from 'next/link';
import { useSession, getProviders, signIn } from "next-auth/react";
// import useWeb3Login from '../hooks/useWeb3Login';
import { AppNextPage } from '../types/types';

const LoginPage: AppNextPage = (props) => {

  const { data: session, status } = useSession();

  console.log({ session, status });

  React.useEffect(() => {
    getProviders().then(providers => console.log(providers));
  },[]);

  return (
    <React.Fragment>
      <Head>
        <title>{Constants.APP_NAME} - Login</title>
        <meta name="description" content="Crypto Connect login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        <Box sx={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', pb: 8 }}>
          <Logo />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ maxWidth: 360, py: 8, px: 6, pb: 4 }} elevation={2}>
            <LoginForm />
          </Paper>
        </Box>

        <Box sx={{ flex: '1' }} />

      </Box>
    </React.Fragment>
  )
}

const LoginForm = ({ }) => {

  const router = useRouter();

  // const { loading, logined, auth } = useWeb3Login();

  const { handleSubmit, reset, control, watch, setValue } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });


  // React.useEffect(() => {
  //   if (!logined) return;
  //   router.push('/');
  // }, [logined, router]);

  const onLogin = ({ email, password }) => {
    signIn("credentials", { email, password });
  }


  return (
    <React.Fragment>
      <Box sx={{ mb: 5, gap: .5, display: 'flex', flexDirection: 'column' }}>
        <Button sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', py: 1.25 }} onClick={() => signIn('github')}>
          <GitHubIcon />
          <Typography variant='subtitle2'>Sign in with Github</Typography>
        </Button>

        <Button sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', py: 1.25 }} onClick={() => signIn('google')}>
          <GoogleIcon />
          <Typography variant='subtitle2'>Sign in with Google</Typography>
        </Button>

        {/* <Button sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', py: 1.25 }} onClick={auth}>
          <Box component='img' sx={{ filter: 'grayscale(100%) brightness(125%)' }} src='/img/metamask-fox.svg' height={22} />
          <Typography variant='subtitle2'>Sign in with Metamask</Typography>
        </Button> */}

      </Box>
      <form onSubmit={handleSubmit(onLogin)}>
        <Box sx={{ mb: 3 }}>
          <FormTextField
            size='small'
            name='email'
            control={control}
            fullWidth
            label='Email'
          // disabled={loading}
          />
          <FormTextField
            size='small'
            name='password'
            type='password'
            control={control}
            fullWidth
            label='Password'
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 1, pt: 1 }}>
          <Button sx={{ minWidth: 120 }} variant='contained' type='submit'>Login</Button>
          <Link passHref href='/signup'>
            <Button size='small' sx={{ minWidth: 120 }}>Signup</Button>
          </Link>
        </Box>
      </form>
    </React.Fragment>
  )
}

export async function getStaticProps(context) {
  return {
    props: {},
  }
}

LoginPage.authGuard = 'unauthenticated';
export default LoginPage;
