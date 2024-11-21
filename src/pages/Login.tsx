import LoginForm from '../components/LoginForm'
import Background from "../components/Background";
import TopBar from '../components/TopBar';

const Login = () => {
    return (
        <Background>
            <TopBar/>
            <LoginForm/>
        </Background>
    )
}

export default Login;
