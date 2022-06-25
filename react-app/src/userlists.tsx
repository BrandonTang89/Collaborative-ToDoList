import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Segment, Header, Divider, Grid, Button, Card, Modal, Icon, Form, TextArea, Message } from 'semantic-ui-react';
import { logout, getUserlists, UpdateList, AddList, DeleteList } from "./FirebaseAccess";
import { UsersDropDown } from "./UI_Components";
import "./App.css"
const auth = getAuth();

const ListModal = (props: { listInfo: { id: string, name: string, desc: string, users: Array<string>, owner: string }, refreshCallback: any, isCreate: boolean, children: React.ReactNode; }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [listName, setListName] = useState<string>(props.listInfo.name);
    const [listDesc, setListDesc] = useState<string>(props.listInfo.desc);
    const [users, setUsers] = useState<Array<string>>(props.listInfo.users);
    const [owner, setOwner] = useState<string>(props.listInfo.owner);
    const handleUsersChange = (users: Array<string>) => { setUsers(users); }

    const [isError, setIsError] = useState<boolean>(false);

    let trigger_element = props.children
    const modalHeader = (props.isCreate) ? "Add New List" : "Edit List";
    const modalContentHeader = (props.isCreate) ? null : <Header>Editing List: {props.listInfo.name}</Header>;


    const modalActions = (props.isCreate) ?
        <>
            <Button onClick={() => {
                setOpen(false);
                setListName(props.listInfo.name);
                setListDesc(props.listInfo.desc);
                setUsers(props.listInfo.users);
                setOwner(props.listInfo.owner);
            }}>Cancel</Button>

            <Button color='green' onClick={() => {
                if (listName === "" || owner === "") {
                    setIsError(true);
                    return;
                }
                setIsError(false);
                console.log("Adding List", listName);

                AddList({
                    id: props.listInfo.id,
                    name: listName,
                    desc: listDesc,
                    users: users,
                    owner: owner
                }).then(res => {
                    if (res) {
                        console.log("Task Added");
                        props.refreshCallback();
                        setOpen(false);

                        // Reset the form
                        setListName(props.listInfo.name);
                        setListDesc(props.listInfo.desc);
                        setUsers(props.listInfo.users);
                        setOwner(props.listInfo.owner);
                    }
                    else console.log("Task Addition Failed");
                });
            }}>
                <Icon name='checkmark' /> Save
            </Button>
        </>
        :
        <>
            <Button.Group floated="left">
                <Button negative onClick={() => {
                    DeleteList({
                        id: props.listInfo.id,
                        name: listName,
                        desc: listDesc,
                        users: users,
                        owner: owner
                    }).then(res => {
                        if (res) {
                            console.log("Task Deleted");
                            props.refreshCallback();
                            setOpen(false);
                        }
                        else console.log("Task Deletion Failed");
                    });
                }}>Delete Task</Button>
            </Button.Group>

            <Button onClick={() => {
                setOpen(false);
                setListName(props.listInfo.name);
                setListDesc(props.listInfo.desc);
                setUsers(props.listInfo.users);
                setOwner(props.listInfo.owner);
            }}>Cancel</Button>

            <Button color='green' onClick={() => {

                if (listName === "" || owner === "") {
                    setIsError(true);
                    return;
                }
                setIsError(false);
                console.log("Updating Task", listName);

                UpdateList({
                    id: props.listInfo.id,
                    name: listName,
                    desc: listDesc,
                    users: users,
                    owner: owner
                }).then(res => {
                    if (res) {
                        console.log("Task Updated");
                        props.refreshCallback();
                        setOpen(false);
                    }
                    else console.log("Task Update Failed");
                });

            }}>
                <Icon name='checkmark' /> Save
            </Button>
        </>

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            closeOnDimmerClick={false}
            closeOnEscape={false}
            trigger={trigger_element}
        >
            <Modal.Header>{modalHeader}</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    {modalContentHeader}
                    <Form error={isError}>
                        <Form.Field>
                            <label>List Name</label>
                            <input placeholder="List Name" defaultValue={listName} onChange={(e: any) => setListName(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <label>List Description</label>
                            <TextArea placeholder='List Description' defaultValue={listDesc} onChange={(e: any) => setListDesc(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Users</label>
                            <UsersDropDown currentUsers={users} onChange={handleUsersChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>Owner</label>
                            <input
                                placeholder='Owner Email Address'
                                defaultValue={owner}
                                onChange={(e: any) => setOwner(e.target.value)}
                            />
                        </Form.Field>
                        <Message
                            error
                            header='Error'
                            content='Ensure the list name and owner are not empty!'
                        />
                    </Form>

                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                {modalActions}

            </Modal.Actions>
        </Modal>);
}
ListModal.defaultProps = { isCreate: false };

function UserLists() {
    const navigate = useNavigate();

    const [userlists, setUserlists] = useState<Array<{ id: string, name: string, desc: string, users: Array<string>, owner: string }>>([]);
    const [authUser, setAuthUser] = useState(false);

    onAuthStateChanged(auth, user => {
        if (!user) {
            navigate("/");
        }
        setAuthUser(true);


    });

    const initialiseUserLists = async () => {
        let newuserlist = await getUserlists(auth.currentUser);
        //console.log("User Lists", newuserlist);
        setUserlists(newuserlist);
    };
    useEffect(() => {
        // console.log("getting userlists");
        initialiseUserLists().catch(err => console.error(err))
        console.log(auth.currentUser?.email);

    }, [authUser]);


    return (
        <div className="mainBodySegment">
            <Segment>
                <div style={{ textAlign: 'center' }}>
                    <h1>{auth.currentUser?.displayName}'s To-Do Lists</h1>
                    <Button basic onClick={logout}>Logout</Button>
                </div>
                <Divider></Divider>
                <Grid doubling columns={5} stretched>
                    <Grid.Column>
                        <ListModal key={(auth.currentUser == null ? "" : (auth.currentUser.email == null ? "" : auth.currentUser.email))} listInfo={{ id: "", name: "", desc: "", users: [], owner: (auth.currentUser == null ? "" : (auth.currentUser.email == null ? "" : auth.currentUser.email)) }} refreshCallback={initialiseUserLists} isCreate={true}>
                            <Card link>
                                <Card.Content style={{ backgroundColor: "#dce8e5" }}>
                                    <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <h1 style={{ color: "black" }}>Add Task</h1>

                                    </div>
                                </Card.Content>
                            </Card>
                        </ListModal>
                    </Grid.Column>
                    {userlists.map(list =>
                        (list.owner === auth.currentUser?.email) ?
                            <Grid.Column>
                                <ListModal key={list.id} listInfo={list} refreshCallback={initialiseUserLists}>
                                    <Card link>
                                        <Card.Content href={"dashboard/" + list.id}>
                                            <Card.Header>{list.name}</Card.Header>
                                            <Card.Meta>{list.id}</Card.Meta>
                                            <Card.Description>{list.desc}</Card.Description>
                                        </Card.Content>

                                        <Card.Content extra>
                                            <Button basic fluid color='grey'>Edit</Button>
                                        </Card.Content>
                                    </Card>
                                </ListModal>
                            </Grid.Column>
                            : <Grid.Column>
                                <Card link>
                                    <Card.Content href={"dashboard/" + list.id}>
                                        <Card.Header>{list.name}</Card.Header>
                                        <Card.Meta>{list.id}</Card.Meta>
                                        <Card.Description>{list.desc}</Card.Description>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>

                    )}
                </Grid>
            </Segment >

        </div >

    );
}
export default UserLists;