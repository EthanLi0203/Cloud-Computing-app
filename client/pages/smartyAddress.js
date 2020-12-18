import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
const SmartAddress = () => {
    return (
        <Layout>
            <h2 className="text-center pt-4 pb-4">Address</h2>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <SearchBar/>
                </div>
            </div>
        </Layout>
    );
};

export default SmartAddress;