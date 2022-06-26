import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Segment, Header, Grid, Button, Card, Modal, Icon, Form, TextArea, Message, Label, Menu } from 'semantic-ui-react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { logout, getUserlists, UpdateList, AddList, DeleteList, getUserName } from "./FirebaseAccess";
import { UsersDropDown } from "./UI_Components";
const auth = getAuth();

const ListModal = (props: { listInfo: { id: string, name: string, desc: string, users: Array<string>, owner: string }, refreshCallback: any, isCreate: boolean, children: React.ReactNode; }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
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
                if (listName === "" || owner === "" || !(users.includes(owner))) {
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
                        console.log("List Added");
                        props.refreshCallback();
                        setOpen(false);

                        // Reset the form
                        setListName(props.listInfo.name);
                        setListDesc(props.listInfo.desc);
                        setUsers(props.listInfo.users);
                        setOwner(props.listInfo.owner);
                    }
                    else console.log("List Addition Failed");
                });
            }}>
                <Icon name='checkmark' /> Save
            </Button>
        </>
        :
        <>
            <Button.Group floated="left">
                <Button negative onClick={() => {
                    setConfirmDeleteOpen(true);

                }}>Delete List</Button>
            </Button.Group>
            <Modal
                onClose={() => setConfirmDeleteOpen(false)}
                open={confirmDeleteOpen}
                size='small'
            >
                <Modal.Header>Confirm Deletion</Modal.Header>
                <Modal.Content>
                    <header>Are you sure you want to delete {props.listInfo.name}?</header>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        content='Cancel'
                        onClick={() => {
                            setConfirmDeleteOpen(false);
                        }}
                    />
                    <Button
                        negative
                        icon='x'
                        content='Delete List'
                        onClick={() => {
                            DeleteList({
                                id: props.listInfo.id,
                                name: listName,
                                desc: listDesc,
                                users: users,
                                owner: owner
                            }).then(res => {
                                if (res) {
                                    console.log("List Deleted");
                                    props.refreshCallback();
                                    setOpen(false);
                                    setConfirmDeleteOpen(false);
                                }
                                else console.log("List Deletion Failed");
                            });
                        }}
                    />

                </Modal.Actions>
            </Modal>

            <Button onClick={() => {
                setOpen(false);
                setListName(props.listInfo.name);
                setListDesc(props.listInfo.desc);
                setUsers(props.listInfo.users);
                setOwner(props.listInfo.owner);
            }}>Cancel</Button>

            <Button color='green' onClick={() => {

                if (listName === "" || owner === "" || !(users.includes(owner))) {
                    setIsError(true);
                    return;
                }
                setIsError(false);
                console.log("Updating List", listName);

                UpdateList({
                    id: props.listInfo.id,
                    name: listName,
                    desc: listDesc,
                    users: users,
                    owner: owner
                }).then(res => {
                    if (res) {
                        console.log("List Updated");
                        props.refreshCallback();
                        setOpen(false);
                    }
                    else console.log("List Update Failed");
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
                            list={['Ensure Name is not empty', 'Ensure Owner is not empty', 'Ensure Owner is in users list']}
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
    const [searchText, setSearchText] = useState("");
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (!user) {
                navigate("/");
            }
            console.log("running this");
            if (user != null) {
                initialiseUserLists().catch(err => console.error(err))
                initaliseUserName().catch(err => console.error(err))
                console.log(auth.currentUser?.email);
            }
        });
    }, []);

    const initialiseUserLists = async () => {
        let newuserlist = await getUserlists(auth.currentUser);
        //console.log("User Lists", newuserlist);
        setUserlists(newuserlist);
    };

    const initaliseUserName = async () => {
        let username = await getUserName(auth.currentUser);
        // console.log("username is ", username)
        setUserName(username);
    }


    return (
        <div className="mainBodySegment">
            <Menu attached='top' size='huge' key='menu' stackable>
                <Menu.Item header>{userName}'s To-Do Lists</Menu.Item>
                <Menu.Menu position='right'>
                    <Menu.Item
                        name='logout'
                        onClick={logout}
                    />
                    <div className='ui right aligned category search item'>
                        <div className='ui transparent icon input'>
                            <input
                                placeholder='Search lists...'
                                onChange={(e: any) => setSearchText(e.target.value)}
                                defaultValue={searchText}
                            />

                            <i className='search link icon' />
                        </div>
                        <div className='results' />
                    </div>
                </Menu.Menu>
            </Menu>

            <Segment attached='bottom' key='user list segment' style={{ backgroundColor: "#ededed" }}>
                <Grid doubling stackable columns={5} stretched>
                    <Grid.Column>
                        <ListModal key={(auth.currentUser == null ? "" : (auth.currentUser.email == null ? "" : auth.currentUser.email))}
                            listInfo={{
                                id: "", name: "", desc: "",
                                users: [(auth.currentUser == null ? "" : (auth.currentUser.email == null ? "" : auth.currentUser.email))],
                                owner: (auth.currentUser == null ? "" : (auth.currentUser.email == null ? "" : auth.currentUser.email))
                            }}
                            refreshCallback={initialiseUserLists}
                            isCreate={true}>
                            <Card link>
                                <Card.Content style={{ backgroundColor: "#f7f7f7" }}>
                                    <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <h1 style={{ color: "black" }}> + New List</h1>

                                    </div>
                                </Card.Content>
                            </Card>
                        </ListModal>
                    </Grid.Column>
                    {userlists.filter((list) => (list.name.includes(searchText))).map(list =>
                        (list.owner === auth.currentUser?.email) ?
                            <Grid.Column key={list.id}>
                                <Card link>
                                    <Card.Content href={"dashboard/" + list.id}>

                                        <Card.Header>{list.name}
                                            <Label attached='top right'>Owner</Label></Card.Header>
                                        <Card.Meta style={{wordWrap: "break-word"}}>{list.id}</Card.Meta>
                                        <Card.Description>{list.desc}</Card.Description>
                                    </Card.Content>

                                    <Card.Content extra>
                                        <ListModal listInfo={list} refreshCallback={initialiseUserLists}>
                                            <Button basic fluid color='grey'>Edit</Button>
                                        </ListModal>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                            : <Grid.Column key={list.id}>
                                <Card link>
                                    <Card.Content href={"dashboard/" + list.id}>
                                        <Card.Header>{list.name}</Card.Header>
                                        <Card.Meta>{list.id}</Card.Meta>
                                        <Card.Description>{list.desc}</Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <p style={{wordWrap: "break-word"}}>Owner: {list.owner}</p>
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