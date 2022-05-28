import Footer from "./Footer"
import Header from "./Header"

const Layout = ({ children }) => (
    <section className="m-0 p-0 stretchToScreen bg-white">
        <Header />
        {
            children
        }
        <Footer />
    </section>
)

export default Layout