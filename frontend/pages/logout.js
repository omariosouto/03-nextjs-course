import React from 'react';
import { useRouter } from 'next/router';
import { HttpClient } from '../src/infra/HttpClient/HttpClient';
import { tokenService } from '../src/services/auth/tokenService'

export default function LogoutPage() {
  const router = useRouter();
  
  React.useEffect(async () => {
    try {
      await HttpClient('/api/refresh', {
        method: 'DELETE'
      });
      tokenService.delete();
      router.push('/');
    } catch(err) {
      alert(err.message);
    }
  }, []);

  return (
    <div>
      Você será redirecionado em instantes...
    </div>
  )
}
