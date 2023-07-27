import { useRouter } from "next/router";
import { CommentInfo } from "../lib/types";
import { Avatar, Stack, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Comment } from "@mui/icons-material";
import { useEffect, useState } from "react";

export const BaseCommentNode = ({comment, children, showBorder, handleClick}: {comment: CommentInfo, showBorder?: boolean, children?: any, handleClick: Function}) => {
    const borderBottom = showBorder ? 1 : 0;
    return (
        <Stack
            direction='row'
            spacing={0.5}
            mt={2}
            onClick={(event: React.MouseEvent<HTMLElement>) => { event.stopPropagation(); handleClick(comment)}}
        >
            <div>
                <Avatar
                    alt={comment.user.username}
                    sx={{ width: 24, height: 24 }}
                    src={comment.user.avatar_url}
                />
            </div>
            <Stack
                spacing={2}
                sx={{ borderBottom: borderBottom, borderBottomColor: '#ddd', width: '100%' }}
            >
                <div>
                    <Typography
                        variant="body2"
                        component="div"
                        fontSize={12}
                        fontWeight={5}
                        pb={2}
                    >
                        {comment.user.username}
                    </Typography>
                </div>
                <div>
                    <Typography
                        variant="body1"
                        component="div"
                        pb={2}
                    >
                        {comment.content}
                    </Typography>
                </div>
                <Stack
                    spacing={2}
                >
                    <Stack
                        direction='row'
                        spacing={2}
                        justifyContent='space-between'
                        fontSize={10}
                        lineHeight={12}
                    >
                        <div>
                            <Typography
                                variant="body2"
                                component="div"
                            >
                                {comment.created_at_friendly}
                            </Typography>
                        </div>
                        <Stack
                            direction='row'
                            spacing={2}
                        >
                            <Stack
                                direction='row'
                                spacing={0}
                            >
                                <FavoriteIcon fontSize="small" />
                                <Typography
                                    variant="body2"
                                    component="div"
                                    ml={0.5}
                                >
                                    15
                                </Typography>
                            </Stack>
                            <Stack
                                direction='row'
                                spacing={0}
                            >
                                <Comment fontSize="small" />
                                <Typography
                                    component="div"
                                    ml={0.5}
                                >
                                    20
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    {
                        children && (<Stack>{children}</Stack>)
                    }
                </Stack>
            </Stack>
        </Stack>
    );
}

export const CommentNode = ({comment, handleClick}: {comment: CommentInfo, handleClick: Function}) => {
    const [page, setPage] = useState(1);

    const [childrenComments, setChildrenComments] = useState(comment.children || new Array<CommentInfo>());

    return (
        <BaseCommentNode comment={comment} showBorder={true} handleClick={handleClick}>
            {
                childrenComments.length > 0 && (
                    childrenComments.map((v: CommentInfo) => (<BaseCommentNode key={v.id} comment={v} handleClick={handleClick} />))
                )
            }
        </BaseCommentNode>
    );
}