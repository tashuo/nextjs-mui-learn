import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import { Alert, AlertColor, Button, IconButton } from '@mui/material';

export default function SnackBarNotice({currentState, currentMessage, currentPostId, stateChange, sverity}: {currentState: boolean, currentMessage: string, currentPostId: number, stateChange?: Function, sverity?: AlertColor}) {
    const [open, setOpen] = React.useState(currentState);
    const [message, setMessage] = React.useState(currentMessage);
    const [postId, setPostId] = React.useState(currentPostId);
    // console.log(`currentPostid: ${postId}`);

    React.useEffect(() => {
        console.log(`snackbar currentState: ${currentState}, ${currentMessage}, ${currentPostId}`);
        setOpen(currentState);
        setMessage(currentMessage);
        setPostId(currentPostId);
    }, [currentState, currentMessage, currentPostId])

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        console.log(`close currentPostid: ${postId}`);
        stateChange && stateChange();
        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
        >
            <Alert onClose={handleClose} severity={sverity ? sverity : 'success'} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}