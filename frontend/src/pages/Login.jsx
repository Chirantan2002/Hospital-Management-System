import LoginPage from "../components/LoginPage";
import usePageTitle from "../hooks/usePageTitle";

const Login = () => {
  // custom page title
  usePageTitle("Doctor Admin Login");

  return (
    <div>
      <LoginPage />
    </div>
  );
};

export default Login;
