import React from 'react';
import { Box, Button, Paper, Typography, LinearProgress } from '@mui/material';
import { Constants } from 'shared';
import FormTextField from '../components/elements/FormTextField';
import { useForm } from 'react-hook-form';
import GoogleIcon from '@mui/icons-material/Google';
import { useRouter } from 'next/router';
import Logo from '../components/elements/Logo';
import GitHubIcon from '@mui/icons-material/GitHub';
import usePasswordStrength from '../hooks/usePasswordStrength';
import Head from 'next/head';
import Link from 'next/link';
import { signIn } from "next-auth/react";
// import useWeb3Login from '../hooks/useWeb3Login';
import { AppNextPage } from '../types/types';
import { useUserContext } from '../contexts/UserContext';
import MetamaskIcon from '../components/elements/MetamaskIcon';

const SignupPage: AppNextPage = (props) => {



  const { w3tSign } = useUserContext();


  return (
    <React.Fragment>
      <Head>
        <title>{Constants.APP_NAME} - Signup</title>
        <meta name="description" content="Crypto Connect login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        <Box sx={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', pb: 8 }}>
          <Logo />  
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ maxWidth: 360, py: 8, px: 6, pb: 4 }} elevation={2}>

            <Box sx={{ mb: 5, gap: .5, display: 'flex', flexDirection: 'column' }}>

              <Button sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', py: 1.25 }} onClick={() => signIn('github')}>
                <GitHubIcon />
                <Typography variant='subtitle2'>Sign up with Github</Typography>
              </Button>

              <Button sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', py: 1.25 }} onClick={() => signIn('google')}>
                <GoogleIcon />
                <Typography variant='subtitle2'>Sign up with Google</Typography>
              </Button>

              <Button sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', py: 1.25 }} onClick={w3tSign}>
                <MetamaskIcon />
                <Typography variant='subtitle2'>Sign up with Metamask</Typography>
              </Button>

            </Box>

            <SignupForm />

          </Paper>
        </Box>

        <Box sx={{ flex: '1' }} />

      </Box>
    </React.Fragment>
  )
}


const SignupForm = ({ }) => {



  const { handleSubmit, reset, control, watch, setValue } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSignup = ({ username, password }) => {

  }



  const password = watch('password');
  const confirmPassword = watch('confirmPassword');


  const { strength } = usePasswordStrength({ password });

  return (
    <form onSubmit={handleSubmit(onSignup)}>
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
          inputProps={{ maxLength: 128 }}
          helperText={strength?.feedback}
        />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', minHeight: 20, mb: .5 }}>
          {strength &&
            <React.Fragment>
              <LinearProgress sx={{ flex: '1' }} color={strength.index < 1 ? 'error' : 'inherit'} variant="determinate" value={strength.progress} />
              <Typography sx={{ lineHeight: 1, minWidth: 64, textAlign: 'center'}} color={strength.index < 1 ? 'error' : 'inherit'} variant='body2'>{strength.label}</Typography>
            </React.Fragment>
            }
        </Box>

        <FormTextField
          size='small'
          name='confirmPassword'
          type='password'
          control={control}
          fullWidth
          label='Confirm Password'
          inputProps={{ maxLength: 128 }}
          error={confirmPassword && password !== confirmPassword}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 1, pt: 1 }}>
        <Button sx={{ minWidth: 120 }} variant='contained' type='submit'>Signup</Button>
        <Link passHref href='/login'>
          <Button size='small' sx={{ minWidth: 120 }}>login</Button>
        </Link>
      </Box>
    </form>
  )
}


export async function getStaticProps(context) {
  return {
    props: {},
  }
}

SignupPage.authGuard = 'unauthenticated';
export default SignupPage;
