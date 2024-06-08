import { getServerSession } from 'next-auth';
import SignupPage from '@/components/auth/SignupPage';

import { redirect } from 'next/navigation';
import { NEXT_AUTH_CONFIG } from '@/lib/auth';

type Props = {}

export default async function Signup({ }: Props) {
    
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    console.log("dse",session);
    if (session?.user) {
        redirect('/');
    }

    return (
        <div>
            <SignupPage />
        </div >
    )
}