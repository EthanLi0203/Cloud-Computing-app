import Layout from '../components/Layout'
import Link from 'next/link'
const Index = () => 
(
    <Layout>
        <p>Index page</p>
        <Link href='/signin'>
            <a>Signin</a>
        </Link>
    </Layout>
)

export default Index;