import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Avatar, InputAdornment, Stack, TextField, TextareaAutosize } from '@mui/material';
import { PhotoOutlined } from '@mui/icons-material';
import Input from '@mui/material/Input';
import { Box } from '@mui/material';
import { ImageList } from '@mui/material';
import { ImageListItem } from '@mui/material';
import { uploadFiles } from '../api/user';
import { publish } from '../api/post';
import { isBrowser } from '../lib/helper';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PostForm({isOpen, setState}: {isOpen: boolean, setState: Function}) {
  const [open, setOpen] = React.useState(isOpen);
  const [files, setFiles] = React.useState(new Array<File>());
  const titleRef = React.useRef<HTMLInputElement>(null);
  const contentRef = React.useRef<HTMLInputElement>(null);
  const avatar = isBrowser() ? localStorage.getItem('avatar') : '';
  const nickname = isBrowser() ? localStorage.getItem('nickname') : '';
  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    setFiles([]);
    setState(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files ? Array.from(e.target.files) : new Array<File>());
  }

  const handlePublish = async () => {
    const title = titleRef.current ? titleRef.current.value : '';
    const content = contentRef.current ? contentRef.current.value : '';
    console.log(title, content, files);
    setFiles([]);
    setState(1);
    let filePaths = [];
    if (files.length > 0) {
        filePaths = (await uploadFiles(files)).data;
        console.log(filePaths);
    }
    const response = await publish(content, filePaths, title);
    console.log(response);
    setState(2);
  }

  return (
    <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Create
            </Typography>
            <Button autoFocus color="inherit" onClick={handlePublish}>
              publish
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem>
            <TextField
              margin="dense"
              label="可选标题"
              fullWidth
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Avatar alt={nickname as string} src={avatar as string} sx={{width: 24, height: 24}}/>
                  </InputAdornment>
                ),
              }}
              inputRef={titleRef}
            />
          </ListItem>
          <ListItem>
            <TextField
              autoFocus
              margin="dense"
              label="交换你的想法..."
              multiline
              fullWidth
            //   maxRows={12}
              variant="standard"
              inputRef={contentRef}
              className='border-0 focus:border-0 h-max'
            />
          </ListItem>
          { files && 
            (<ListItem>
                <ImageList
                    sx={{ }}
                    cols={3}
                >
                    {
                        files.map((file: File, k) => (
                            <ImageListItem key={k}>
                                <img
                                  src={URL.createObjectURL(file)}
                                  srcSet={URL.createObjectURL(file)}
                                  alt={file.name}
                                  width='200'
                                />
                            </ImageListItem>
                        ))
                    }
                </ImageList>
            </ListItem>
          )}
        </List>
        <Box sx={{ width: '100%', position: 'fixed', bottom: 0 }} className='bg-slate-50'>
            <Stack direction='row' spacing={1.5}>
                <Input
                    id='select-image'
                    type='file'
                    inputProps={{ multiple: true }}
                    onChange={handleFileSelect}
                    className='hidden'
                />
                <label htmlFor='select-image'>
                    <PhotoOutlined />
                </label>
            </Stack>
        </Box>
    </Dialog>
  );
}