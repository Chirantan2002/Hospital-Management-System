import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ContactPage from "../components/ContactPage"
import usePageTitle from "../hooks/usePageTitle"

const Contact = () => {
  // custom page title
  usePageTitle("Contact Us");
  
  return (
    <div>
      <Navbar/>
      <ContactPage/>
      <Footer/>
    </div>
  )
}

export default Contact
