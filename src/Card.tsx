import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { deepOrange, pink, red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/router';
import { cancelLike, like } from '../api/post';

type User = {
    id: number,
    username: string,
    avatar: string,
}

type Feed = {
    user: User,
    id: number,
    title: string,
    content: string,
    images: string[],
    publishedAt: Date,
    likeCount: number,
    commentCount: number,
    isLiked: boolean,
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const CardList = ({items}: {items: Feed[]}) => {
    return (
        <>
            {items.map((feed: Feed) => {
                return <FeedCard key={feed.id} {...feed}/>
            })}
        </>
    );
};

export const FeedCard = (props: Feed) => {
  const router = useRouter();
  const [expanded, setExpanded] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(props.isLiked);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const AvatarClick = (userId: number) => {
    console.log(userId);
    router.push(`/user`);
  }

  const handleLike = async () => {
    console.log(props);
    const response = isLiked ? await cancelLike(props.id) : await like(props.id);
    console.log(response.data);
    setIsLiked(!isLiked);
  }

  return (
    <Card key={props.id} sx={{ width: "80%", marginLeft: "10%" }}>
      <CardHeader
        avatar={props.user.avatar 
            ? <Avatar aria-label="recipe" alt={props.user.username} src={props.user.avatar} onClick={() => AvatarClick(props.user.id)}></Avatar> 
            : <Avatar sx={{ bgcolor: deepOrange[500] }} aria-label="recipe" onClick={() => AvatarClick(props.user.id)}>{props.user.username.substring(props.user.username.length - 2)}</Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.user.username}
        subheader="说"
      />
      {props.images && <CardMedia
        component="img"
        height="194"
        image={props.images[0]}
        alt="image"
      />}
      {props.content && <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.content}
        </Typography>
      </CardContent>}
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={handleLike}>
          {isLiked ? <FavoriteIcon sx={{ color: pink[500] }} /> : <FavoriteIcon />}
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
    </Card>
  );
}