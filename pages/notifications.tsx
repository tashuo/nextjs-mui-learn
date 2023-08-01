import { useEffect } from 'react';
import Layout from '../src/Layout';
import NotificationTabs from '../src/NotificationTabs';
import { isLogin } from '../lib/helper';
import { useRouter } from 'next/router';

export default function Notifications() {
    const router = useRouter();
    useEffect(() => {
        if (!isLogin()) {
            router.push(`/signIn?redirectUrl=${encodeURIComponent(router.asPath)}`);
            return;
        }
    }, []);
    
    return (
      <Layout title='notifications'>
        <NotificationTabs />
      </Layout>
    );
}
