import React from 'react';

const defaultPasswordStrengthLevels = [{ maxStrength: 12, label: 'Too weak' }, { maxStrength: 19, label: 'Strong' }, { maxStrength: 35, label: 'Excellent' }, { maxStrength: Infinity, label: 'God Like' }];

export interface UsePasswordStrengthOptions {
  password?: string;
  strengthLevels?: { maxStrength: number, label: string, description?: string }[];
}

const usePasswordStrength = ({ password, strengthLevels = defaultPasswordStrengthLevels }: UsePasswordStrengthOptions) => {
  
  const [strength, setStrength] = React.useState<null | { label: string, color?: string, level: number, progress: number, feedback: string | null }>(null);
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

    const strengthLevel = strengthLevels.sort((a, b) => a.maxStrength - b.maxStrength).reduce<null | { label: string, color?: string, level: number }>((result, e, index) => {
      if (result) return result;
      if (e.maxStrength <= strength.guesses_log10) return null;
      return { level: index, ...e };
    }, null);

    if (!strengthLevel) return;

    setStrength({ ...strengthLevel, progress: ((strengthLevel.level + 1) / strengthLevels.length) * 100, feedback: strength.feedback.warning || null });

  }, [password, strengthLevels, zxcvbn]);

  return { zxcvbn, strength };
}

export default usePasswordStrength;