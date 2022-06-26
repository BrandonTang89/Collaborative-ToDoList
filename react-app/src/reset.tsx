import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { sendPasswordReset } from "./FirebaseAccess";
import { Segment, Header, Grid, Button, Card, Modal, Icon, Form, TextArea, Message, Divider } from 'semantic-ui-react';
import "./login.css";
const auth = getAuth();

function Reset() {
    const [email, setEmail] = useState("");
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
                    Reset Password
                </Header>
                <Segment stacked>
                    <Form size='large'>
                        <Header>Send a reset Email</Header>
                        <Form.Input
                            fluid
                            icon='user'
                            iconPosition='left'
                            placeholder='E-mail address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />

                        <Button color='teal' fluid size='large' onClick={async () => {
                            await sendPasswordReset(email);
                            alert("Password reset link sent!");
                        }}>
                            Send Email
                        </Button>
                    </Form>

                </Segment>
                <Message>
                    <a href='/'>Back to Login</a>
                </Message>
            </Grid.Column>
        </Grid >


    );
}
export default Reset;