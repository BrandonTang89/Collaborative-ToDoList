import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signInWithGoogle, logInWithEmailAndPassword } from "./FirebaseAccess";
import { Segment, Header, Grid, Button, Icon, Form, Message,  Divider } from 'semantic-ui-react';
const auth = getAuth();

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [localOkay, setLocalOkay] = useState(true);
    const [googleOkay, setGoogleOkay] = useState(true);
    onAuthStateChanged(auth, user => {
        if (user) {
            navigate("/userlists");
        }
    });
    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>

            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h1' color='teal' textAlign='center'>
                    Welcome to Brandon's Collaborative To-Do App
                </Header>
                <Segment stacked>
                    <Form size='large' error={!localOkay}>
                        <Header>Login to Your Account</Header>
                        <Form.Input
                            fluid
                            icon='user'
                            iconPosition='left'
                            placeholder='E-mail address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button color='teal' fluid size='large' onClick={async () => {
                            let res = await logInWithEmailAndPassword(email, password);
                            setLocalOkay(res);
                        }}>
                            Login
                        </Button>
                        <Message error hidden={localOkay}>
                            <Message.Header>Login Failed</Message.Header>
                            <p>Please check your email and password and try again.</p>
                            {//<p>Note that if you have signed in with Google, that will replace your local account.</p>
                            }
                            <p><a href="/reset">Forgot Password?</a></p>
                        </Message>
                        <Divider horizontal>OR</Divider>
                    </Form>
                    <Form>

                        <Button color='google plus' fluid onClick={
                            async () => {
                                let res = await signInWithGoogle();
                                setGoogleOkay(res);
                            }}>
                            <Icon name='google' /> Login with Google
                        </Button>
                        <Message error hidden={googleOkay}>
                            <Message.Header>Google Login Failed</Message.Header>
                        </Message>
                    </Form>
                </Segment>
                <Message>
                    New to us? <a href='/register'>Sign Up</a>
                </Message>
            </Grid.Column>
        </Grid >


    );
}
export default Login;