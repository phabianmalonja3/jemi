
import { cookies } from 'next/headers';
import ForgotClient from './ForgotClient';




  export default async function  ForgotPasswordPage() {



    const token = (await  cookies()).get("token");

    console.log(token)




    console.log()



  return <ForgotClient token={token} />
}
