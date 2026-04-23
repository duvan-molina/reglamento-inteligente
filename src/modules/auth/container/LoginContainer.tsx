import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import LoginComponent from '../components/LoginComponent';
import type { LoginFormData } from '../types';

export default function LoginContainer() {
  const [errorProp, setErrorProp] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '' }
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setErrorProp('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (err: any) {
      setErrorProp(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginComponent
      register={register}
      errors={errors}
      errorProp={errorProp}
      loading={loading}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
