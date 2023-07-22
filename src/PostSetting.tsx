import { Box, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import SnackBarNotice from "./SnackBarNotice";

export default function PostSetting({stateChange, currentState, postId}: { currentState: boolean, stateChange: Function, postId: number}) {
    const [state, setState] = useState(false);
    const [snackState, setSnackSate] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');

    useEffect(() => {
        setState(currentState);
    }, [currentState])

    const handleClose = () => {
        setState(false);
        stateChange(false);
    }

    const handleClick = (message = '客官稍安勿躁, 该功能还在排期中:d') => {
        setSnackSate(true);
        setSnackMessage(message);
    }

    const handleSnackStateChange = (snackState = false) => {
        setSnackSate(snackState);
    }

    return (
        <>
            <Drawer
                anchor="bottom"
                open={state}
                onClose={handleClose}
            >
                <Box 
                    sx={{width: 'auto'}}
                    role="presentation"
                    onClick={handleClose}
                    onKeyDown={handleClose}
                >
                    <List>
                        <ListItem key="不感兴趣" onClick={() => handleClick('不感兴趣先忍忍')}>
                          <ListItemButton className="text-center">
                            <ListItemText primary="不感兴趣" />
                          </ListItemButton>
                        </ListItem>
                        <ListItem key="举报" onClick={() => handleClick('息怒息怒')}>
                          <ListItemButton className="text-center">
                            <ListItemText primary="举报" />
                          </ListItemButton>
                        </ListItem>
                        <ListItem key="取消">
                          <ListItemButton className="text-center">
                            <ListItemText primary="取消" />
                          </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <SnackBarNotice currentState={snackState} currentMessage={snackMessage} currentPostId={postId} stateChange={handleSnackStateChange} sverity="info"/>
        </>
    );
}