import React from 'react';

const defaultPasswordStrengthLevels = [[12, 'Too weak'], [19, 'Strong'], [35, 'Excellent'], [Infinity, 'God like']];

export interface usePasswordStrength {
  password?: string;
  strengthLevels?: [number, string, string][];
}

const usePasswordStrength = ({ password, strengthLevels = defaultPasswordStrengthLevels }) => {
  
  const [strength, setStrength] = React.useState<null | { label: string, color?: string, index: number, progress: number, feedback: string | null }>(null);
  const [zxcvbn, setZxcvbn] = React.useState(null);

  React.useEffect(() => {
    if (!process.browser || !password || zxcvbn) return;
    (async () => {
      const _zxcvbn = (await import('zxcvbn')).default;
      setZxcvbn(() => _zxcvbn);
    })();
  }, [password, zxcvbn]);

  React.useEffect(() => {

    if (!password || !zxcvbn) return setStrength(null);

    const strength = zxcvbn(password);

    const strengthLevel = strengthLevels.reduce<null | { label: string, color?: string, index: number }>((result, e, index) => {
      if (result) return result;
      if (e[0] <= strength.guesses_log10) return null;
      return { label: e[1] as string, color: e[2] as string, index };
    }, null);

    if (!strengthLevel) return;

    setStrength({ ...strengthLevel, progress: ((strengthLevel.index + 1) / strengthLevels.length) * 100, feedback: strength.feedback.warning || null });

  }, [password, strengthLevels, zxcvbn]);

  return { zxcvbn, strength };
}

export default usePasswordStrength;