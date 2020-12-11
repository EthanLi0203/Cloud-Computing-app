import Layout from '../components/Layout'
import Link from 'next/link'
const Index = () => 
(
    <Layout>
        <p>Index page</p>
        <Link href='/signin'>
            <a>Signin</a>
        </Link>
        <br></br>
        <Link href='/smartyAddress'>
            <a>Address</a>
        </Link>
    </Layout>
)

export default Index; 