import React from 'react';
import { useRouter } from 'next/router';
import { asArray } from 'shared';
import { useVerifyEmailMutation } from '../../types/gql';


const AppContinual = () => {
  const router = useRouter();

  const [verifyEmail, { called }] = useVerifyEmailMutation({
    onCompleted() {
      router.push('/dashboard');
    },
    onError(err) {
      router.push('/');
    }
  });

  React.useEffect(() => {
    
    if (!called && router.query.verify) {
      const [token] = asArray(router.query.verify);
      verifyEmail({
        variables: {
          token,
        },
      });
    }

  }, [called, router.query, verifyEmail]);

  return null;
}

export default AppContinual;