export type User = {
    id: number,
    username: string,
    avatar_url: string,
}

export type Feed = {
    user: User,
    id: number,
    title: string,
    content: string,
    image_urls: string[],
    publishedAt: Date,
    like_count: number,
    comment_count: number,
    collect_count: number,
    isLiked: boolean,
    created_at_friendly: string,
}

export type PaginationData<T> = {
    items: T[],
    meta: {
      totalPages: number,
      limit: number,
      nextPage: number,
      total?: number,
      page?: number,
      isLoading?: boolean,
    }
}

export type CursorPaginationData<T> = {
    items: T[],
    meta: {
      cursor: number;
      limit: number,
      hasMore: boolean,
      isLoading?: boolean,
    }
}

export type UserProfileData = {
    id: number;
    username: string;
    avatar_url: string;
    description: string;
    gender: string;
    interactionInfo: {
        isFollowing: boolean;
        followingCount: number;
        followerCount: number;
        receivedLikeCount: number;
        receivedCollectCount: number;
    }
}

export type CommentInfo = {
    id: number;
    content: string;
    created_at: Date;
    user: User;
    interaction_info: {
        like_count: number,
        liked: boolean,
        reply_count: number
    },
    children?: CommentInfo[];
    parent?: CommentInfo;
    created_at_friendly?: string;
    mpath?: string;
}

export type PostInfo = Feed;

export type Notice = {
    id: number;
    type: string;
    operator: User;
    created_at_friendly: string;
    post?: PostInfo;
    comment?: CommentInfo;
}
