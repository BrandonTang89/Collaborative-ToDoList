import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, } from "firebase/auth";
import { signInWithGoogle, registerWithEmailAndPassword } from "./FirebaseAccess";
import { Segment, Header, Grid, Button, Icon, Form, Message, Divider } from 'semantic-ui-react';
const auth = getAuth();

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();
    onAuthStateChanged(auth, user => {
        if (user) {
            navigate("/userlists");
        }
    });
    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>

            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h1' color='teal' textAlign='center'>
                    Welcome Onboard!
                </Header>
                <Form size='large'>
                    <Segment stacked>
                        <Header>Register</Header>
                        <Form.Input
                            fluid
                            icon='user'
                            iconPosition='left'
                            placeholder='Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)} />
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

                        <Button color='teal' fluid size='large' onClick={() => registerWithEmailAndPassword(name, email, password)}>
                            Register
                        </Button>
                        <Divider horizontal>OR</Divider>
                        <Button color='google plus' fluid onClick={signInWithGoogle}>
                            <Icon name='google' /> Register with Google
                        </Button>
                    </Segment>
                </Form>
                <Message>
                    Already have an account? <a href='/'>Login</a>
                </Message>
            </Grid.Column>
        </Grid>


    );
}
export default Register;